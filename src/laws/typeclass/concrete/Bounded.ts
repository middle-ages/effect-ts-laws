import {BoundedTypeLambda} from '@effect/typeclass/Bounded'
import {Order as OD} from 'effect'
import {Law} from '../../../law.js'
import {ConcreteGiven, defineConcreteLaws} from './given.js'

/**
 * Test typeclass laws for `Bounded`.
 * @category typeclass laws
 */
export const boundedLaws = <A>(given: ConcreteGiven<BoundedTypeLambda, A>) => {
  const {F, a, suffix} = given
  const order: OD.Order<A> = F.compare
  const [lte, gte] = [
    OD.greaterThanOrEqualTo(order),
    OD.lessThanOrEqualTo(order),
  ]

  return defineConcreteLaws(
    'Bounded',
    Law('lower bounded', 'a ≥ minBound ', a)(a => gte(a, F.minBound)),
    Law('upper bounded', 'a ≤ maxBound ', a)(a => lte(a, F.maxBound)),
  )(suffix)
}

declare module './given.js' {
  interface ConcreteLambdas {
    Bounded: BoundedTypeLambda
  }
}
