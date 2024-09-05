import {Array as AR, Option as OP, pipe, Tuple as TU} from 'effect'
import fc from 'fast-check'
import {describe} from 'vitest'
import {checkLaw, Law, testLaw, UnknownArgs} from './law.js'

/**
 * A `LawSet` is a recursive data structure with an array of {@link Law}s
 * and an array of base `LawSet`s that models the laws required
 * by some function or datatype. The `LawSet` passes only if all its
 * `LawSet`s and all its own laws pass. A `LawSet` can be tested
 * by calling `testLaws(lawSet)` inside a `vitest` suite, and will
 * appear in the test results as a list of tests grouped inside a
 * `describe()` block, if it has a name, or as a flat list
 * of test blocks if it does not.
 * @typeParam T - Tuple whose elements are the predicate arguments
 * of every law in the set.
 * @typeParam U - Tuple whose elements are the `LawSet` arguments
 * of every set of laws in the requirements.
 * @category model
 */
export interface LawSet<
  Ts extends UnknownArgs[],
  Ls extends LawSet<any, any>[] = [],
> {
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
  sets: Ls

  /**
   * Possibly empty list laws that must pass for the law set to pass.
   */
  laws: {[K in keyof Ts]: Law<Ts[K]>}
}

/**
 * Assemble a set of laws for some unit under test. You can run them with the
 * function {@link testLaws}.
 * @example
 * ```ts
 * // A pair of laws with no law sets.
 * const setA: LawSet<[[number], [number]]> = LawSet()(
 *   'some unit under test',
 *   Law('law₁', '∀n ∈ ℕ: n = n', tinyPositive)(x => x === x),
 *   Law('law₂', '∀n ∈ ℕ: n ≤ n', tinyPositive)(x => x <= x),
 * )
 * ```
 * @param sets - Requirements for the new `LawSet`.
 * @category constructors
 */
export const LawSet =
  <Ls extends LawSet<any, any>[]>(...sets: Ls) =>
  <Ts extends UnknownArgs[]>(
    /**
     * Test suite name.
     */
    name = '',
    /**
     * List of {@link Law}s that must pass for this `LawSet` to pass.
     */
    ...laws: {[K in keyof Ts]: Law<Ts[K]>}
  ): LawSet<Ts, Ls> => ({name, laws, sets})

/**
 * Just like {@link LawSet}, but with an empty list of `LawSet`s.
 * @category constructors
 */
export const lawTests = <Ts extends UnknownArgs[]>(
  name = '',
  ...laws: LawSet<Ts>['laws']
): LawSet<Ts> => ({name, laws: laws, sets: []})

/**
 * Just like {@link LawSet}, but with an empty list of laws, no
 * name, and the `sets` list is _deduped_ to avoid running
 * the same `LawSet` twice.
 * @category constructors
 */
export const lawSetTests = <Ls extends LawSet<any, any>[]>(...sets: Ls) =>
  pipe({name: '', laws: [], sets}, dedupe, TU.getFirst) as LawSet<[], Ls>

/**
 * Adds a list of laws to the law set.
 * @category combinators
 */
export const addLaws =
  <Us extends UnknownArgs[]>(...add: {[K in keyof Us]: Law<Us[K]>}) =>
  <Ts extends UnknownArgs[], Ls extends LawSet<any, any>[]>({
    laws,
    ...rest
  }: LawSet<Ts, Ls>): LawSet<[...Ts, ...Us], Ls> => ({
    ...rest,
    laws: [...laws, ...add],
  })

/**
 * Adds a required set of laws to the `LawSet`.
 * @category combinators
 */
export const addLawSet =
  <L extends LawSet<any, any>>(add: L) =>
  <Ts extends UnknownArgs[], Ls extends LawSet<any, any>[]>({
    sets,
    ...rest
  }: LawSet<Ts, Ls>) => ({
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
 * @returns The same optional `Set<string>` given in `previous`, except
 * all `LawSet` names tested in _this_ call will be added.
 * @category harness
 */
export const testLaws = <
  Ts extends UnknownArgs[],
  Ls extends LawSet<any, any>[],
>(
  {name = '', sets, laws}: LawSet<Ts, Ls>,
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
 * Just like {@link testLaws} but in a pure function: no `vitest` blocks are
 * used.
 * @returns Possibly empty array of failure messages.
 * @category harness
 */
export const checkLaws = <
  Ts extends UnknownArgs[],
  Ls extends LawSet<any, any>[],
>(
  {sets, laws}: LawSet<Ts, Ls>,
  parameters: Overrides = {},
): string[] => {
  const ownOptions: OP.Option<string>[] = AR.map(laws, law =>
    checkLaw(law as Law<Ts[number]>),
  )

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
const dedupe = <L extends LawSet<any, any>>(
  {name, sets: lawSets, ...rest}: L,
  argNames = new Set<string>(),
): [L, Set<string>] => {
  let names = argNames

  const sets = []
  for (const lawSet of lawSets) {
    const {name = '', ...rest} = lawSet as LawSet<any, any>
    if (name === '') {
      sets.push(lawSet)
    } else {
      if (names.has(name)) continue
      const [res, childNames] = dedupe({name, ...rest}, names.add(name))
      sets.push(res)
      names = childNames
    }
  }

  return [{name, sets, ...rest} as L, names]
}
