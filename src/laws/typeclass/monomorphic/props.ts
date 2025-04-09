import type {LiftArbitrary} from '#arbitrary'
import {
  predicate,
  testPredicateEquivalence,
  tinyPositive,
  tinyString,
} from '#arbitrary'
import type {LiftEquivalence} from '#law'
import {Monoid as MO, Semigroup as SE} from '@effect/typeclass'
import {
  Equivalence as EQ,
  Function as FN,
  Number as NU,
  Predicate as PR,
  Struct as ST,
  String as STR,
} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import type {GivenConcerns, ParameterizedGiven} from '../parameterized/given.js'
import {unfoldMonomorphicGiven} from './given.js'
import {monoPredicateArbitrary} from './mono.js'

/**
 * An underlying type for monomorphic typeclass tests that is an alternative to
 * the `Mono` type, this type is an object vs. `Mono` which is an array.  This
 * lets you test laws on higher order datatypes that require an object as only
 * parameter, for example React functional components.
 * @category monomorphic
 */
export interface MonoProps {
  x: number
  y: string
}

/**
 * An arbitrary for the alternative monomorphic underlying type `MonoProps`.
 * @category monomorphic
 */
export const propsArbitrary: fc.Arbitrary<MonoProps> = fc.record({
  x: tinyPositive,
  y: tinyString,
})

/**
 * An arbitrary predicate the alternative monomorphic underlying type
 * `MonoProps`.
 * @category monomorphic
 */
export const propsPredicateArbitrary: fc.Arbitrary<PR.Predicate<MonoProps>> =
  predicate<MonoProps>()

/**
 * Monoid instance for the `MonoProps` type.
 * @category monomorphic
 */
export const propsMonoid: MO.Monoid<MonoProps> = MO.fromSemigroup(
  SE.struct({
    x: SE.min(NU.Order),
    y: SE.make(FN.dual(2, STR.concat)),
  }),
  {x: 0, y: ''},
)

/**
 * An equivalence for the alternative monomorphic underlying type `MonoProps`.
 * @category monomorphic
 */
export const propsEquivalence: EQ.Equivalence<MonoProps> = ST.getEquivalence({
  x: NU.Equivalence,
  y: STR.Equivalence,
})

/**
 * Build a sampling equivalence for predicates of the underlying `Mono` type.
 * @category monomorphic
 */
export const propsPredicateEquivalence: EQ.Equivalence<
  PR.Predicate<MonoProps>
> = testPredicateEquivalence(propsArbitrary)

/**
 * Unfold options for monomorphic typeclass law tests. This is a version of
 * {@link unfoldMonoGiven} on the underlying type `{x: number; y: string}`.
 * @category monomorphic
 */
export const unfoldPropsGiven = <
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  getEquivalence: LiftEquivalence<F, R, O, E>,
  getArbitrary: LiftArbitrary<F, R, O, E>,
): GivenConcerns<F, MonoProps, MonoProps, MonoProps, R, O, E> =>
  unfoldMonomorphicGiven<F, MonoProps, R, O, E>({
    a: propsArbitrary,
    equalsA: propsEquivalence,
    Monoid: propsMonoid,
    getEquivalence,
    getArbitrary,
  })

const contravariant = <
  Typeclass extends TypeLambda,
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
>(
  F: Kind<Typeclass, R, O, E, F>,
): ParameterizedGiven<
  Typeclass,
  F,
  MonoProps,
  MonoProps,
  MonoProps,
  R,
  O,
  E
> => ({
  F,
  ...unfoldPropsGiven(
    (<T>(_: EQ.Equivalence<T>) => propsPredicateEquivalence) as LiftEquivalence<
      F,
      R,
      O,
      E
    >,
    (<T>(_: fc.Arbitrary<T>) => monoPredicateArbitrary) as LiftArbitrary<
      F,
      R,
      O,
      E
    >,
  ),
})

unfoldPropsGiven.contravariant = contravariant
