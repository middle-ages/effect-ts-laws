import {Array as AR, pipe} from 'effect'
import fc from 'fast-check'
import {describe} from 'vitest'
import {UnknownArgs} from './law.js'
import {LawTest, testLaw} from './lawTest.js'

const defaultSuiteName = 'laws'

/**
 * A `LawList` is a named list of {@link LawTest}s. It can be run inside a
 * `vitest` suite, and will appear in the test results as a list of tests
 * inside a single `describe()` block.
 */
export interface LawList<ArgLists extends UnknownArgs[] = UnknownArgs[]> {
  /**
   * Name of unit under test. Runner uses this for `describe()`
   * block name. The name `laws` will be used if none is given.
   */
  unitName: string

  /** List of laws that must pass for the law list to pass. */
  laws: {[K in keyof ArgLists]: LawTest<ArgLists[K]>}

  /**
   * List of predicates extracted from the laws, one per law. Useful when you
   * want to test the laws using your own data.
   */
  predicates: LawPredicates<ArgLists>
}

/**
 * `fast-check` run-time
 * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * Fields with a type that depends on the property argument list
 * are omitted here and must be set on individual law tests.
 */
export type ParameterOverrides = Omit<
  fc.Parameters,
  'reporter' | 'asyncReporter' | 'examples'
>

/**
 * Assemble a set of laws for some unit under test. You can run them with the
 * function {@link testLaws}.
 */
export const lawTests = <ArgLists extends UnknownArgs[]>(
  laws: LawList<ArgLists>['laws'],
  unitName: string = defaultSuiteName,
): LawList<ArgLists> => ({
  unitName,
  laws,
  predicates: pipe(
    Object.values(laws),
    AR.map(law => law.predicate),
  ) as LawPredicates<ArgLists>,
})

/**
 * Attempts to find a counter example for a list of {@link LawTest}s.
 *
 * Meant to be called from inside a `vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()` or `it()` block.
 *
 * Test results will show laws grouped under the optional `unitName` if given,
 * or the suite named `laws`.
 *
 * Entries in the optional configuration will override any `fast-check`
 * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html)
 * found in the laws.
 */
export const testLaws = <ArgLists extends UnknownArgs[]>(
  {unitName, laws}: LawList<ArgLists>,
  overrides: ParameterOverrides = {},
): void => {
  describe(unitName, () => {
    for (const item of laws) {
      type Args = ArgLists[number]
      const law = item as LawTest<Args>
      testLaw({...law, parameters: {...law.parameters, ...overrides}})
    }
  })
}

/** Just like  {@link testLaws}, but in _verbose_ mode. */
export const verboseLaws = <ArgLists extends UnknownArgs[]>(
  lawList: LawList<ArgLists>,
  parameters: ParameterOverrides = {},
) => {
  testLaws(lawList, {...parameters, verbose: true})
}

/** The type of all predicates extracted from every law in a `LawList`. */
export type LawPredicates<ArgLists extends UnknownArgs[]> = {
  [K in keyof ArgLists]: LawTest<ArgLists[K]>['predicate']
}
