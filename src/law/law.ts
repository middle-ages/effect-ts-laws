import {Option as OP, Predicate as PR} from 'effect'
import {tupled} from 'effect/Function'
import fc from 'fast-check'

/**
 * A paper-thin wrapper over a fast-check property and its runtime
 * configuration adding:
 * 1. `Law ≡ property + assert + test` - Testing a law will run the
 *    _fast-check_ property inside an assertion inside
 *    [a vitest](https://vitest.dev/guide/features.html)
 *    `test(() => {...})` block. This means you can call
 *    [testLaw](https://middle-ages.github.io/effect-ts-laws-docs/functions/testLaw.html)
 *    and/or
 *    [testLaws](https://middle-ages.github.io/effect-ts-laws-docs/functions/testLaws.html)
 *    from inside a `describe(() => {...})` block, or even from the
 *    top level of your test file, but _not_ inside a
 *    `test(() => {...})` block.
 *       - The law can also be _checked_, instead of _tested_ using `checkLaw`.
 *         This exactly the same as `testLaw`, except in a pure function that
 *         returns the test results without using any `vitest` blocks.
 * 2. `Law`s can be grouped under a single label into `LawSet` . Useful for
 *    testing units that require multiple laws, for example typeclasses. Besides
 *    its child _laws_, a `LawSet` can includes other `LawSets` as requirements
 *    to be run as a guard before testing its own laws.
 * 3. A law has a name, just like the `fc.Property` it is wrapping, but also
 *    a field for a note. It is shown only on failure or when the `fast-check`
 *    runtime parameter `verbose` is true.
 * A law can be converted into a `fast-check` property and tested.
 * @typeParam Ts - Tuple whose elements are the predicate arguments.
 * @category model
 */
export interface Law<Ts extends UnknownArgs> {
  /**
   * Law name to be used as test name. You can include a description of the
   * unit under test or anything else you wish to appear in the test name,
   * for example: `MyList.map:associative`.
   */
  name: string

  /**
   * A note shown only on failure or in verbose mode.
   */
  note: string

  /**
   * Predicate to be tested. Its arguments will appear in a single tuple.
   */
  predicate: PR.Predicate<Ts>

  /** Arbitrary for the arguments tuple of the predicate. */
  arbitrary: fc.Arbitrary<Ts>

  /**
   * `fast-check` configuration
   * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
   */
  parameters?: fc.Parameters<[Ts]>
}

/**
 * Build a law from a name, a predicate, an optional note, an arbitrary for the
 * predicate arguments, and optional `fast-check` runtime parameters.
 * The runtime parameters are
 * [documented here](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * @example
 * ```ts
 * import fc from 'fast-check'
 * import {Law} from 'effect-ts-laws'
 * const law: Law<[number, number]> = Law(
 *   'sum of positives ≥ both',           // • law name
 *   '∀a,b in N, sum=a+b: sum≥a ∧ sum≥b', // • law note
 *   fc.integer(),                        // • list of
 *   fc.integer(),                        //   arbitraries
 * )(                                     //   required for...
 *    (x, y) => x + y >= x && x + y >= y, // • the law predicate
 *    {numRuns: 10_000}                   // • optional runtime config
 * )
 * ```
 * @typeParam Ts -  Argument type of predicate. For example, if the law
 * predicate signature is `Predicate<[a: number, b: string]>`, then `T`
 * would be `[a: number, b: string]`.
 * @param name - Law name, shown as test label.
 * @param note - String note to be shown on failure or in verbose mode.
 * @param arbitraries - A tuple of arbitraries, one per predicate argument.
 * @category constructors
 */
export const Law =
  <Ts extends UnknownArgs>(
    name: string,
    note: string,
    ...arbitraries: {[K in keyof Ts]: fc.Arbitrary<Ts[K]>}
  ) =>
  (
    /**
     * Law predicate. Its argument type is encoded in `Ts`.
     */
    predicate: (...args: Ts) => boolean,
    /**
     * `fast-check` runtime parameters.
     */
    parameters: fc.Parameters<[Ts]> = {},
  ): Law<Ts> => ({
    name,
    note,
    predicate: tupled(predicate),
    arbitrary: fc.tuple<Ts>(...arbitraries),
    parameters,
  })

/**
 * Return the given law but with its predicate negated.
 * @typeParam T - Argument type of law predicate. For example, if
 * the law predicate type is `Predicate<[number, number]>`, then
 * `T` would be `[number, string]`.
 * @param law - The law to be negated.
 * @returns A new `Law` object.
 * @category combinators
 */
export const negateLaw = <Ts extends UnknownArgs>({
  predicate,
  ...law
}: Law<Ts>): Law<Ts> => ({...law, predicate: PR.not(predicate)})

/**
 * Run the law and return either `None` on pass or `Some<string>` with the error
 * report on fail.
 * @category harness
 */
export const checkLaw = <Ts extends UnknownArgs>(
  law: Law<Ts>,
  parameters: ParameterOverrides = {},
): OP.Option<string> => {
  let failMessage: string | undefined = undefined

  try {
    asAssert(law)(parameters)
  } catch (e) {
    /* v8 ignore next 2 */
    if (!(e instanceof Error)) throw new Error(e as string)
    failMessage = e.message
  }

  return OP.fromNullable(failMessage)
}

/**
 * Convert the law into a `fast-check` assertion.
 * @category harness
 */
export const asAssert =
  <Ts extends UnknownArgs>({
    name,
    note,
    predicate,
    arbitrary,
    parameters,
  }: Law<Ts>) =>
  (overrides: ParameterOverrides = {}): void => {
    fc.assert(
      fc.property<[Ts]>(arbitrary, (args: Ts) => {
        if (predicate(args)) return true
        throw new Error(`${name}: ${note}`)
      }),
      {...parameters, ...overrides},
    )
  }

/**
 * A base type for law predicate argument types.
 * @category model
 * @internal
 */
export type UnknownArgs = [unknown, ...unknown[]]

/**
 * `fast-check` runtime
 * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html).
 * Fields with a type that depends on the property argument list
 * are omitted here and must be set on individual law tests.
 * @category fast-check
 */
export type ParameterOverrides = Omit<
  fc.Parameters,
  'reporter' | 'asyncReporter' | 'examples'
>
