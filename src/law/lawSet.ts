import {Array as AR, Option as OP, pipe, Tuple as TU} from 'effect'
import {checkLaw, Law, ParameterOverrides} from './law.js'

/**
 * A `LawSet` is a recursive data structure with an array of {@link Law}s
 * and an array of base `LawSet`s that models the laws required
 * by some function or datatype. The `LawSet` passes only if all its
 * `LawSet`s and all its own laws pass.
 *
 * You can try to find counterexamples to a set of laws using the functions
 * {@link checkLaw} and {@link checkLaws}.
 *
 * Functions in the `ts-effect-laws/test` entry point will try to find
 * counterexamples as part of a [vitest](https://vitest.dev/) test.
 *
 * Laws will be deduplicated in the scope of a run of `checkLaw` and
 * `checkLaws`, so that the same law will not run more than once per
 * datatype.
 *
 * This is required because typeclass laws are arranged in a parallel `extends`
 * hierarchy to the typeclasses themselves, so that a law could appear multiple
 * times in a test.
 *
 * Consider for example the law tests for `Array`. It has instances we wish to
 * check both for `Applicative` and for `Monad`. In `effect-ts`, both extend
 * `Covariant`. Thus testing the `Array` instance for `Applicative` will run the
 * laws for `Covariant`. But testing for the `Monad` laws will run the
 * `Covariant` law tests _again_. Deduplication avoids this issue.
 *
 * A `LawSet` can be tested by calling `testLaws(lawSet)` inside a `vitest`
 * suite, and will appear in the test results as a list of tests grouped inside
 * a `describe()` block, if it has a name, or as a flat list of test blocks if
 * it does not. The function must be imported from `effect-ts-laws/vitest`.
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
 * Assemble a set of laws for some unit under test. You can check them using the
 * functions {@link checkLaw} and {@link checkLaws }. They can be tested in a
 * [vitest](https://vitest.dev/) test suite using the
 * [testLaw](https://middle-ages.github.io/effect-ts-laws-docs/functions/vitest.testLaw.html)
 * and
 * [testLaw](https://middle-ages.github.io/effect-ts-laws-docs/functions/vitest.testLaw.html)
 * functions.
 * @example
 * ```ts
 * // A pair of laws with no law sets.
 * const setA: LawSet = LawSet()(
 *   'some feature under test',
 *   Law('law₁', '∀n ∈ ℕ: n = n', tinyPositive)(x => x === x),
 *   Law('law₂', '∀n ∈ ℕ: n ≤ n', tinyPositive)(x => x <= x),
 * )
 *
 * // Another that will run “setA” _before_ its own laws
 * const setA: LawSet = LawSet(setA)(
 *   'another feature under test',
 *   Law('law₁', '∀n ∈ ℕ: n - n = 0', tinyPositive)(x => x - x === 0),
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
 * Test the law set in a pure function with no `vitest` imports involved.
 * @returns Possibly empty array of failure messages.
 * @category harness
 */
export const checkLaws = (
  {sets, laws}: LawSet,
  parameters: ParameterOverrides = {},
): string[] => {
  const ownOptions: OP.Option<string>[] = AR.map(laws, law =>
    checkLaw(law, parameters),
  )

  return [
    ...AR.flatMap(sets, lawSet => checkLaws(lawSet, parameters)),
    ...AR.getSomes(ownOptions),
  ]
}

/**
 * Check a list of `LawSet`s.
 * @returns Possibly empty array of failure messages.
 * @category harness
 */
export const checkLawSets =
  (parameters: ParameterOverrides = {}) =>
  (
    /**
     * The law sets to test.
     */
    ...sets: LawSet[]
  ): string[] =>
    checkLaws(lawSetTests(...sets), parameters)

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
