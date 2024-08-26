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

/** The type of the arbitrary tuple that is required for a predicate of `Args`. */
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
  <Args extends UnknownArgs>(
    name: string,
    predicate: NAryPredicate<Args>,
    note?: string,
  ) =>
  (
    arbitraries: ArbitrariesFor<Args>,
    parameters?: fc.Parameters<Args>,
  ): LawTest<Args> => ({
    ...buildLaw(name, predicate, note),
    ...(parameters !== undefined && {parameters}),
    arbitraries,
  })

/**
 * Convert a {@link LawTest} into a
 * [fast-check property](https://fast-check.dev/docs/core-blocks/properties/).
 * The optional note will be displayed on failure or in verbose mode.
 */
export const asProperty = <Args extends UnknownArgs>({
  note,
  predicate,
  arbitraries,
}: LawTest<Args>): fc.IPropertyWithHooks<Args> =>
  fc.property<Args>(...arbitraries, (...args: Args) => {
    expect(
      predicate(...args),
      pipe(
        note,
        OP.getOrElse(() => undefined),
      ),
    ).toBeTruthy()
  })

/**
 * Attempts to find a counter example for a single {@link LawTest}.
 *
 * Meant to be called from inside a `vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()` or `it()` block.
 */
export const testLaw = <Args extends UnknownArgs>({
  parameters,
  ...law
}: LawTest<Args>) => {
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
