/**
 * @module lawSet The LawSet type and functions for working with_sets_ of laws.
 */
import {Array as AR, Option as OP, pipe, Tuple as TU} from 'effect'
import type {ParameterOverrides, UnknownLaw} from './law.js'
import {checkLaw} from './law.js'

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
  laws: UnknownLaw[]
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
 * import {checkLaws, Law, LawSet, tinyPositive} from 'effect-ts-laws'
 *
 * // A pair of laws with no law sets.
 * const setA: LawSet = LawSet()(
 *   'some feature under test',
 *   Law('law₁', '∀n ∈ ℕ: n = n', tinyPositive)(x => x === x),
 *   Law('law₂', '∀n ∈ ℕ: n ≤ n', tinyPositive)(x => x <= x),
 * )
 *
 * // Another that will run “setA” _before_ its own laws
 * const setB: LawSet = LawSet(setA)(
 *   'another feature under test',
 *   Law('law₁', '∀n ∈ ℕ: n - n = 0', tinyPositive)(x => x - x === 0),
 * )
 *
 * // Will check “setA” as a prerequisite
 * assert.deepStrictEqual(checkLaws(setB), [])
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
    ...laws: UnknownLaw[]
  ): LawSet => ({name, laws, sets})

/**
 * Just like {@link LawSet}, but with an empty list of `LawSet`s.
 * @category constructors
 */
export const lawTests = (name = '', ...laws: UnknownLaw[]): LawSet => ({
  name,
  laws: laws,
  sets: [],
})

/**
 * Just like {@link lawTests}, but explicitly anonymous.
 *
 * Anonymous LawSets do not appear as a distinct group in test results. Instead
 * they appear right next to their siblings.
 * @param laws - Laws under test.
 * @category constructors
 */
export const anonymousLawTests = (...laws: UnknownLaw[]): LawSet =>
  lawTests('', ...laws)

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
  (...add: UnknownLaw[]) =>
  ({laws, ...rest}: LawSet): LawSet => ({
    ...rest,
    laws: [...laws, ...add],
  })

/**
 * Adds a required child LawSets to a parent LawSet.
 * @param them - Child LawSet that will be added.
 * @returns Parent LawSet with the child LawSet added.
 * @category combinators
 */
export const addLawSets =
  (...them: LawSet[]): ((lawSet: LawSet) => LawSet) =>
  /**
   * Parent LawSet that will get a new child.
   */
  self => {
    const {sets, ...rest} = self
    return {...rest, sets: [...sets, ...them]}
  }

/**
 * Test the law set in a pure function with no `vitest` imports involved.
 *
 * See also {@link vitest.testLaws | testLaws}.
 * @returns Possibly empty array of failure messages.
 * @category harness
 */
export const checkLaws = (
  {sets, laws}: LawSet,
  parameters?: ParameterOverrides,
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
  (parameters?: ParameterOverrides) =>
  (
    /**
     * The law sets to test.
     */
    ...sets: LawSet[]
  ): string[] =>
    checkLaws(lawSetTests(...sets), parameters)

/**
 * Filter the laws that are direct children of a LawSet by matching a regular
 * expression on the law _name_, and return the new filtered LawSet. LawSets
 * that survive the filter remain untouched.
 *
 * Useful when you need to remove from a LawSet laws that are problematic
 * perhaps because they are slow or difficult to generate.
 * @example
 * import {equivalenceLaws, filterLaws, tinyInteger} from 'effect-ts-laws'
 * import {Number as NU, pipe} from 'effect'
 *
 * // Extract reflexivity law from equivalence laws.
 * const reflexivity = pipe(
 *   {a: tinyInteger, equalsA: NU.Equivalence, F: NU.Equivalence},
 *   equivalenceLaws<number>,
 *   filterLaws(/reflexivity/),
 * )
 *
 * assert.equal(reflexivity.laws.length, 1)
 * assert.equal(reflexivity.laws[0]?.name, 'reflexivity')
 * @param re - Regular expression will be matched vs. law name.
 * @returns Input LawSet, but includes only laws with names matching `re`.
 * @category combinators
 */
export const filterLaws =
  (re: RegExp) =>
  /**
   * LawSet that is parent of laws to be filtered.
   */
  ({laws, ...rest}: LawSet): LawSet => ({
    ...rest,
    laws: laws.filter(({name}) => re.test(name)),
  })

/**
 * Just like `filterLaws` but recursive.
 * @param re - Regular expression will be matched vs. law name.
 * @returns Input LawSet, but includes only laws with names matching `re`, with
 * all required LawSets also filtered.
 * @category combinators
 */
export const filterLawsDeep =
  (re: RegExp) =>
  /**
   * LawSet to filter.
   */
  ({laws, sets, ...rest}: LawSet): LawSet => ({
    ...rest,
    laws: laws.filter(({name}) => re.test(name)),
    sets: sets.map(filterLawsDeep(re)),
  })

/**
 * The anonymous empty LawSet.
 * @category constructors
 */
export const emptyLawSet: LawSet = anonymousLawTests()

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
