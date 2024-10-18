import {Monoid as MO} from '@effect/typeclass'
import {TypeLambda} from 'effect/HKT'
import {Law} from '../../../law.js'
import {ConcreteGiven, defineConcreteLaws} from './given.js'
import {semigroupLaws} from './Semigroup.js'

/**
 * Test typeclass laws for `Monoid` and its requirement `Semigroup` laws.
 * @category typeclass laws
 */
export const monoidLaws = <A>(given: ConcreteGiven<MonoidTypeLambda, A>) => {
  const {F, equalsA, a, suffix} = given

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
