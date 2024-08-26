import {Option as OP} from 'effect'
import {constant, pipe} from 'effect/Function'
import fc from 'fast-check'
import {expect, test} from 'vitest'
import {buildLaw, Law, NAryPredicate, UnknownArgs} from './law.js'

/**
 * A `LawTest` is a {@link Law} with arbitraries and runtime configuration.
 * It can be converted into a fast-check property and tested.
 */
export interface LawTest<Args extends UnknownArgs = UnknownArgs>
  extends Law<Args> {
  /** List of arbitraries required for testing the predicate. */
  arbitraries: ArbitrariesFor<Args>

  /**
   * `fast-check` configuration
   * [parameters](https://fast-check.dev/api/v2/interfaces/fc.Parameters.html).
   */
  parameters?: fc.Parameters<Args>
}

/**
 * The type of the arbitrary tuple that is required for a predicate of `Args`.
 * For example if the predicate is `(a: number, b: string) ⇒ boolean`, then
 * the type of its arbitraries tuple, `ArbtrariesFor<[a: number, b: string]>`
 * will be `[fc.Arbitrary<number>, fc.Arbitrary<string>]`.
 */
export type ArbitrariesFor<Args extends UnknownArgs> = {
  [K in keyof Args]: fc.Arbitrary<Args[K]>
}

/**
 * Build a `LawTest`. First parameter list is the same as the one required
 * by {@link buildLaw}: a law name, predicate, and optional note.
 *
 * The second parameter list is a tuple of arbitraries that match
 * the predicate and an optional `fast-check` runtime configuration where
 * you can set, for example, the number of tests to run with the key
 * `numRuns`. The runtime configuration is
 * [documented here](https://fast-check.dev/api/v2/interfaces/fc.Parameters.html).
 */
export const lawTest =
  <LawArgs extends UnknownArgs>(
    name: string,
    predicate: NAryPredicate<LawArgs>,
    note?: string,
  ) =>
  (
    arbitraries: ArbitrariesFor<LawArgs>,
    parameters?: fc.Parameters<LawArgs>,
  ): LawTest<LawArgs> => ({
    ...buildLaw(name, predicate, note),
    ...(parameters !== undefined && {parameters}),
    arbitraries,
  })

/**
 * Convert a {@link LawTest} into a
 * [fast-check property](https://fast-check.dev/docs/core-blocks/properties/).
 * The optional note will be displayed on failure or in verbose mode.
 */
export const asProperty = <LawArgs extends UnknownArgs>({
  note,
  predicate,
  arbitraries,
}: LawTest<LawArgs>): fc.IPropertyWithHooks<LawArgs> =>
  fc.property<LawArgs>(...arbitraries, (...args: LawArgs) => {
    expect(
      predicate(...args),
      pipe(
        note,
        OP.getOrElse(() => undefined),
      ),
    ).toBeTruthy()
  })

/**
 * Attempts to find a counter example for the single given {@link LawTest}.
 *
 * Meant to be called from inside a `vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()` or `it()` block. For
 * example:
 * 
 * @example
 * ```ts
 * const lawTest: LawTest<[number, number]> = …

 * describe('testLaw', () => { testLaw(iut) })
 * ```
 */
export const testLaw = <LawArgs extends UnknownArgs>(
  lawTest: LawTest<LawArgs>,
) => {
  const {parameters, ...law} = lawTest
  const property = asProperty(law)

  const note =
    (parameters?.verbose ?? false)
      ? pipe(
          law.note,
          OP.match({onNone: constant(''), onSome: note => ` ${note}`}),
        )
      : ''

  test(law.name + note, () => {
    fc.assert(property, parameters)
  })
}
