import {
  Array as AR,
  Cause as CA,
  Either as EI,
  flow,
  List as LI,
  Option as OP,
  pipe,
  String as STR,
} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Monad as arbitraryMonad} from './instances.js'
import {LiftArbitrary} from './types.js'

const {map, flatMap} = arbitraryMonad

/**
 * Returns an `Either` arbitrary given a pair of arbitraries for the underlying
 * left and right values.
 * @category arbitraries
 */
export const either = <A, E>(
  e: fc.Arbitrary<E>,
  a: fc.Arbitrary<A>,
): fc.Arbitrary<EI.Either<A, E>> =>
  fc.oneof(a.map<EI.Either<A, E>>(EI.right), e.map<EI.Either<A, E>>(EI.left))

/**
 * Returns an `Option` arbitrary given an arbitrary for the underlying value.
 * @category arbitraries
 */
export const option = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<OP.Option<A>> =>
  fc.oneof(pipe(a, map(OP.some)), fc.constant(OP.none<A>()))

/**
 * An integer arbitrary small enough so that we can avoid having to think about
 * numeric overflows in generated functions.
 * @category arbitraries
 */
export const tinyInteger: fc.Arbitrary<number> = fc.integer({
  min: -100,
  max: 100,
})

/**
 * An array of tiny integers with max size fixed at 4.
 * @category arbitraries
 */
export const tinyArray = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<A[]> =>
  fc.array(a, {maxLength: 4})

/**
 * An array of tiny integers with max size fixed at 4.
 * @category arbitraries
 */
export const tinyIntegerArray: fc.Arbitrary<number[]> = tinyArray(tinyInteger)

/**
 * Given a {@link LiftArbitrary} function, and 1..n `Arbitrary`s for
 * different types `A₁, A₂, ...Aₙ`, returns the given list except every
 * arbitrary for type `Aᵢ` has been replaced by an arbitrary for type
 * `Kind<F,In1,Out2,Out1,Aᵢ>`. For example:
 * @example
 * ```ts
 * const [arbOptionString, arbOptionNumber] = liftArbitraries<OptionTypeLambda>(
 *   Arbitraries.option,
 * )(
 *   fc.integer(),
 *   fc.string(),
 * )
 * // arbOptionString ≡ fc.Arbitrary<Option<string>>
 * // arbOptionNumber ≡ fc.Arbitrary<Option<number>>
 * ```
 * @category lifting
 */
export const liftArbitraries = <
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  liftArbitrary: LiftArbitrary<F, In1, Out2, Out1>,
) => {
  type Data<T> = Kind<F, In1, Out2, Out1, T>

  return <const Arbs extends fc.Arbitrary<unknown>[]>(...arbs: Arbs) =>
    AR.map(arbs, (arb: fc.Arbitrary<unknown>) => liftArbitrary(arb)) as {
      [K in keyof Arbs]: fc.Arbitrary<
        Data<Arbs[K] extends fc.Arbitrary<infer T> ? T : never>
      >
    }
}

/**
 * Build an arbitrary error from an arbitrary of a message.
 * @param message Arbitrary for the error message string.
 * @returns Arbitrary error.
 * @category arbitraries
 */
export const error: (message: fc.Arbitrary<string>) => fc.Arbitrary<Error> =
  map(s => new Error(s))

/**
 * Build an arbitrary record with arbitrary string keys and
 * values built from the given arbitrary.
 * @param value Arbitrary for the record values.
 * @returns Arbitrary record.
 * @category arbitraries
 */
export const stringKeyRecord = <T>(value: fc.Arbitrary<T>) =>
  pipe(
    uniqueStrings,
    flatMap(
      flow(
        AR.map(key => [key, value] as const),
        Object.fromEntries,
        fc.record,
      ),
    ),
  ) as fc.Arbitrary<Record<string, T>>

const uniqueStrings = fc.uniqueArray(
  fc.string({
    minLength: 1,
    maxLength: 5,
  }),
  {
    minLength: 1,
    maxLength: 5,
    comparator: STR.Equivalence,
  },
)

/**
 * Lift an arbitrary into an arbitrary for the effect-ts linked-list `List`
 * type.
 * @category arbitraries
 */
export const list = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<LI.List<A>> =>
  tinyArray(a).map(LI.fromIterable)

/**
 * Arbitrary [Cause](https://effect-ts.github.io/effect/effect/Cause.ts.html).
 * @category arbitraries
 */
export const cause = <A>(
  a: fc.Arbitrary<A>,
  defect: fc.Arbitrary<unknown> = tinyInteger,
): fc.Arbitrary<CA.Cause<A>> => {
  const depthIdentifier = fc.createDepthIdentifier()
  return fc.letrec<{
    atomic: CA.Cause<A>
    composed: CA.Cause<A>
    cause: CA.Cause<A>
  }>(tie => ({
    cause: fc.oneof(
      {maxDepth: 3, depthIdentifier},
      tie('atomic'),
      tie('composed'),
    ),
    composed: map(
      fc.tuple(
        fc.oneof(
          fc.constant('sequential' as const),
          fc.constant('parallel' as const),
        ),
        fc.tuple(tie('cause'), tie('cause')),
      ),
      ([op, pair]) => CA[op](...pair),
    ),
    atomic: fc.oneof(
      fc.constant(CA.empty),
      map(defect, CA.die),
      map(a, CA.fail),
    ),
  })).cause
}
