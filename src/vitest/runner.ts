import {describe, test} from 'vitest'
import {
  asAssert,
  Law,
  LawSet,
  lawSetTests,
  ParameterOverrides,
  UnknownArgs,
} from '../law.js'

/**
 * Attempts to find a counterexample for the single given {@link Law}.
 *
 * Meant to be called from inside a `Vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()`/`it()` block. For example:
 * @example
 * ```ts
 * import fc from 'fast-check'
 * import { Law } from 'effect-ts-laws'
 * import { testLaw } from 'effect-ts-laws/vitest'
 * const myLaw = Law(
 *   'law name',
 *   'law note',
 *   fc.integer()
 * )((a: number) => a === a)
 * describe('testLaw', () => { testLaw(myLaw) })
 * // testLaw
 * // ✓ law name: law note
 * ```
 * @category vitest
 */
export const testLaw = <Ts extends UnknownArgs>(law: Law<Ts>): void => {
  const {note, parameters} = law

  const suffix =
    (parameters?.verbose ?? false) && note !== '' ? `: ${note}` : ''

  test(law.name + suffix, () => {
    asAssert(law)()
  })
}

/**
 * Attempts to find a counterexample for a set of {@link Law}s.
 *
 * Meant to be called from inside a `vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()` or `it()` block.
 *
 * Test results will be shown grouped under the given `LawSet.name`.
 * Laws found in the `sets` field will be shown under their own names as
 * children.
 *
 * Entries in the optional configuration will override any `fast-check`
 * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html)
 * found in the laws.
 * @param lawSet - Laws to test.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testLaws = (
  {name = '', sets, laws}: LawSet,
  parameters: ParameterOverrides = {},
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
 * Test a list of `LawSet`s. This is exactly like `testLaws` but accepts
 * a list of `LawSet`s rather than a single one.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testLawSets =
  (parameters: ParameterOverrides = {}) =>
  (
    /**
     * The law sets to test.
     */
    ...sets: LawSet[]
  ): void => {
    testLaws(lawSetTests(...sets), parameters)
  }
