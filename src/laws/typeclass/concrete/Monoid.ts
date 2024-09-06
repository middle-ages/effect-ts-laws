import {Monoid as MO} from '@effect/typeclass'
import {TypeLambda} from 'effect/HKT'
import {Law} from '../../../law.js'
import {ConcreteGiven, concreteLaws} from './given.js'
import {Semigroup} from './Semigroup.js'

/**
 * Test typeclass laws for `Monoid` and its requirement `Semigroup` laws.
 * @category typeclass laws
 */
export const Monoid = <A>(given: ConcreteGiven<MonoidTypeLambda, A>) => {
  const {F, equalsA, a, suffix} = given

  return concreteLaws(
    'Monoid',
    Law(
      'leftIdentity',
      '∅ ⊹ a = a',
      a,
    )((a: A) => equalsA(F.combine(F.empty, a), a)),

    Law(
      'rightIdentity',
      'a = a ⊹ ∅',
      a,
    )((a: A) => equalsA(F.combine(a, F.empty), a)),
  )(suffix, Semigroup(given))
}

/**
 * Type lambda for the `Monoid` type class.
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
