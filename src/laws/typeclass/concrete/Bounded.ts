import {Law} from '#law'
import type {BoundedTypeLambda} from '@effect/typeclass/Bounded'
import {Order as OD} from 'effect'
import type {BuildConcrete} from './given.js'
import {defineConcreteLaws} from './given.js'

/**
 * Build typeclass laws for `Bounded`.
 * @category typeclass laws
 */
export const boundedLaws: BuildConcrete<BoundedTypeLambda> = given => {
  const {F, a, suffix} = given
  const [lte, gte] = [
    OD.greaterThanOrEqualTo(F.compare),
    OD.lessThanOrEqualTo(F.compare),
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
