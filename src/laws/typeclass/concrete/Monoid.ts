import {Law} from '#law'
import {Monoid as MO} from '@effect/typeclass'
import type {TypeLambda} from 'effect/HKT'
import {UnderlyingArbitrary} from '../../../arbitrary.js'
import type {BuildConcrete} from './given.js'
import {defineConcreteLaws} from './given.js'
import {semigroupLaws} from './Semigroup.js'

/**
 * Build typeclass laws for `Monoid` and its requirement `Semigroup` laws.
 * @category typeclass laws
 */
export const monoidLaws: BuildConcrete<MonoidTypeLambda> = given => {
  const {F, equalsA, a, suffix} = given
  type A = UnderlyingArbitrary<typeof a>

  return defineConcreteLaws(
    'Monoid',
    Law(
      'left identity',
      '∅ ⊕ a = a',
      a,
    )((a: A) => equalsA(F.combine(F.empty, a), a)),

    Law(
      'right identity',
      'a = a ⊕ ∅',
      a,
    )((a: A) => equalsA(F.combine(a, F.empty), a)),
  )(suffix, semigroupLaws(given))
}

/**
 * Type lambda for the `Monoid` typeclass.
 * @category type lambda
 */
export interface MonoidTypeLambda extends TypeLambda {
  readonly type: MO.Monoid<this['Target']>
}

declare module './given.js' {
  interface ConcreteLambdas {
    Monoid: MonoidTypeLambda
  }
}
