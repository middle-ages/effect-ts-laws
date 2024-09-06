import {SemigroupTypeLambda} from '@effect/typeclass/Semigroup'
import {Law} from '../../../law.js'
import {ConcreteGiven, concreteLaws} from './given.js'

/**
 * Test typeclass laws for `Semigroup`.
 * @category typeclass laws
 */
export const Semigroup = <A>({
  F,
  equalsA,
  a,
  suffix,
}: ConcreteGiven<SemigroupTypeLambda, A>) =>
  concreteLaws(
    'Semigroup',
    Law(
      'associativity',
      '∀a,b,a ∈ T: (a ⊹ b) ⊹ c = a ⊹ (b ⊹ c)',
      a,
      a,
      a,
    )((a, b, c) =>
      equalsA(F.combine(F.combine(a, b), c), F.combine(a, F.combine(b, c))),
    ),

    Law(
      'combineMany.associativity',
      '∀a,b,a ∈ T: combineMany(a, [b, c]) = combine(a, combine(b, c))',
      a,
      a,
      a,
    )((a, b, c) =>
      equalsA(F.combineMany(a, [b, c]), F.combine(a, F.combine(b, c))),
    ),
  )(suffix)

declare module './given.js' {
  interface ConcreteLambdas {
    Semigroup: SemigroupTypeLambda
  }
}
