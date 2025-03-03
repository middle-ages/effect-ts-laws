import {Law} from '#law'
import type {SemigroupTypeLambda} from '@effect/typeclass/Semigroup'
import type {BuildConcrete} from './given.js'
import {defineConcreteLaws} from './given.js'

/**
 * Build typeclass laws for `Semigroup`.
 * @category typeclass laws
 */
export const semigroupLaws: BuildConcrete<SemigroupTypeLambda> = ({
  F,
  equalsA,
  a,
  suffix,
}) =>
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
