import {Law} from '#law'
import {BoundedTypeLambda} from '@effect/typeclass/Bounded'
import {Order as OD} from 'effect'
import {ConcreteGiven, concreteLaws} from './given.js'

/**
 * Test typeclass laws for `Bounded`.
 * @category typeclass laws
 */
export const Bounded = <A>(given: ConcreteGiven<BoundedTypeLambda, A>) => {
  const {F, a, suffix} = given
  const order: OD.Order<A> = F.compare
  const [lte, gte] = [
    OD.greaterThanOrEqualTo(order),
    OD.lessThanOrEqualTo(order),
  ]

  return concreteLaws(
    'Bounded',
    Law('lower bounded', '∀a ∈ T: a ≥ minBound ', a)(a => gte(a, F.minBound)),
    Law('upper bounded', '∀a ∈ T: a ≤ maxBound ', a)(a => lte(a, F.maxBound)),
  )(suffix)
}

declare module './given.js' {
  interface ConcreteLambdas {
    Bounded: BoundedTypeLambda
  }
}
