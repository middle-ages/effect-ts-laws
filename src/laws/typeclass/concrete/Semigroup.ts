import {SemigroupTypeLambda} from '@effect/typeclass/Semigroup'
import {Law} from '../../../law.js'
import {ConcreteGiven, defineConcreteLaws} from './given.js'

/**
 * Test typeclass laws for `Semigroup`.
 * @category typeclass laws
 */
export const semigroupLaws = <A>({
  F,
  equalsA,
  a,
  suffix,
}: ConcreteGiven<SemigroupTypeLambda, A>) =>
  defineConcreteLaws(
    'Semigroup',
    Law(
      'associativity',
      '(a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)',
      a,
      a,
      a,
    )((a, b, c) =>
      equalsA(F.combine(F.combine(a, b), c), F.combine(a, F.combine(b, c))),
    ),

    Law(
      'combineMany associativity',
      'combineMany(a, [b, c]) = combine(a, combine(b, c))',
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
