import {Array as AR, Either as EI, Option as OP} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {LiftArbitrary} from './types.js'

/**
 * Returns an `Either` arbitrary given a pair of arbitraries for the underlying
 * left and right values.
 *
 * @category Arbitraries
 */
export const either = <A, E>(
  e: fc.Arbitrary<E>,
  a: fc.Arbitrary<A>,
): fc.Arbitrary<EI.Either<A, E>> =>
  fc.oneof(a.map<EI.Either<A, E>>(EI.right), e.map<EI.Either<A, E>>(EI.left))

/**
 * Returns an `Option` arbitrary given an arbitrary for the underlying value.
 *
 * @category Arbitraries
 */
export const option = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<OP.Option<A>> =>
  fc.oneof(a.map(OP.some), fc.constant(OP.none<A>()))

/**
 * An integer arbitrary small enough so that we can avoid having to think about
 * numeric overflows in generated functions.
 *
 * @category Arbitraries
 */
export const tinyInteger: fc.Arbitrary<number> = fc.integer({
  min: -100,
  max: 100,
})

/**
 * Given a {@link LiftArbitrary} function, and 1..n `Arbitrary`s for
 * different types `A₁, A₂, ...Aₙ`, returns the given list except every
 * arbitrary for type `Aᵢ` has been replaced by an arbitrary for type
 * `Kind<F,In1,Out2,Out1,Aᵢ>`. For example:
 *
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
 *
 * @category Arbitraries
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
