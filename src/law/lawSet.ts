import {Array as AR, Option as OP, pipe, Tuple as TU} from 'effect'
import fc from 'fast-check'
import {describe} from 'vitest'
import {checkLaw, Law, testLaw} from './law.js'

/**
 * A `LawSet` is a recursive data structure with an array of {@link Law}s
 * and an array of base `LawSet`s that models the laws required
 * by some function or datatype. The `LawSet` passes only if all its
 * `LawSet`s and all its own laws pass. A `LawSet` can be tested
 * by calling `testLaws(lawSet)` inside a `vitest` suite, and will
 * appear in the test results as a list of tests grouped inside a
 * `describe()` block, if it has a name, or as a flat list
 * of test blocks if it does not.
 * @category model
 */
export interface LawSet {
  /**
   * Optional name of unit under test. Runner uses this for `describe()`
   * block name. If missing, no `describe()` block is wrapped around
   * child laws.
   */
  name?: string

  /**
   * Possibly empty list of `LawSet`s that must pass before we run the laws
   * in this set.
   */
  sets: LawSet[]

  /**
   * Possibly empty list laws that must pass for the law set to pass.
   */
  laws: Law<any>[]
}

/**
 * Assemble a set of laws for some unit under test. You can run them with the
 * function {@link testLaws}.
 * @example
 * ```ts
 * // A pair of laws with no law sets.
 * const setA: LawSet = LawSet()(
 *   'some unit under test',
 *   Law('law₁', '∀n ∈ ℕ: n = n', tinyPositive)(x => x === x),
 *   Law('law₂', '∀n ∈ ℕ: n ≤ n', tinyPositive)(x => x <= x),
 * )
 * ```
 * @param sets - Requirements for the new `LawSet`.
 * @category constructors
 */
export const LawSet =
  (...sets: LawSet[]) =>
  (
    /**
     * Test suite name.
     */
    name = '',
    /**
     * List of {@link Law}s that must pass for this `LawSet` to pass.
     */
    ...laws: Law<any>[]
  ): LawSet => ({name, laws, sets})

/**
 * Just like {@link LawSet}, but with an empty list of `LawSet`s.
 * @category constructors
 */
export const lawTests = (name = '', ...laws: Law<any>[]): LawSet => ({
  name,
  laws: laws,
  sets: [],
})

/**
 * Just like {@link LawSet}, but with an empty list of laws, no
 * name, and the `sets` list is _deduped_ to avoid running
 * the same `LawSet` twice.
 * @category constructors
 */
export const lawSetTests = (...sets: LawSet[]): LawSet =>
  pipe({name: '', laws: [], sets}, dedupe, TU.getFirst)

/**
 * Adds a list of laws to the law set.
 * @category combinators
 */
export const addLaws =
  (...add: Law<any>[]) =>
  ({laws, ...rest}: LawSet): LawSet => ({
    ...rest,
    laws: [...laws, ...add],
  })

/**
 * Adds a required set of laws to the `LawSet`.
 * @category combinators
 */
export const addLawSet =
  (add: LawSet) =>
  ({sets, ...rest}: LawSet) => ({
    ...rest,
    sets: [...sets, add],
  })

/**
 * Attempts to find a counter example for a set of {@link Law}s.
 *
 * Meant to be called from inside a `vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()` or `it()` block.
 *
 * Test results will be shown grouped under the given `LawSet.name`.
 * `sets` test results will be shown under their own names as children.
 *
 * Entries in the optional configuration will override any `fast-check`
 * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html)
 * found in the laws.
 * @param lawSet - Laws to test.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category harness
 */
export const testLaws = (
  {name = '', sets, laws}: LawSet,
  parameters: Overrides = {},
): void => {
  if (laws.length === 0 && sets.length === 0) return

  const run = () => {
    for (const lawSet of sets) testLaws(lawSet, parameters)
    for (const law of laws)
      testLaw({...law, parameters: {...law.parameters, ...parameters}})
  }

  if (name === '') run()
  else describe(name, run)
}

/**
 * Just like {@link testLaws} but in _verbose_ mode.
 * @category harness
 * @param lawSet - Laws to test.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category harness
 */
export const verboseLaws = (
  lawSet: LawSet,
  parameters: Overrides = {},
): void => {
  testLaws(lawSet, {verbose: true, ...parameters})
}

/**
 * Just like {@link testLaws} but in a pure function: no `vitest` blocks are
 * used.
 * @returns Possibly empty array of failure messages.
 * @category harness
 */
export const checkLaws = (
  {sets, laws}: LawSet,
  parameters: Overrides = {},
): string[] => {
  const ownOptions: OP.Option<string>[] = AR.map(laws, law => checkLaw(law))

  return [
    ...AR.flatMap(sets, lawSet => checkLaws(lawSet, parameters)),
    ...AR.getSomes(ownOptions),
  ]
}

/**
 * `fast-check` runtime
 * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * Fields with a type that depends on the property argument list
 * are omitted here and must be set on individual law tests.
 * @category fast-check
 */
export type Overrides = Omit<
  fc.Parameters,
  'reporter' | 'asyncReporter' | 'examples'
>

// Rebuilds the tree filtering out LawSets so that LawSet.name is unique
const dedupe = (
  {name = '', sets: lawSets, laws = []}: LawSet,
  argNames = new Set<string>(),
): [LawSet, Set<string>] => {
  let names = argNames

  const sets = []
  for (const lawSet of lawSets) {
    const {name = '', ...rest} = lawSet
    if (name === '') {
      sets.push(lawSet)
    } else {
      if (names.has(name)) continue
      const [res, childNames] = dedupe({name, ...rest}, names.add(name))
      sets.push(res)
      names = childNames
    }
  }

  return [{name, sets, laws}, names]
}
