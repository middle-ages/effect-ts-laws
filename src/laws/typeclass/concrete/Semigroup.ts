import {Law} from '#law'
import type {SemigroupTypeLambda} from '@effect/typeclass/Semigroup'
import type {BuildConcrete} from './given.js'
import {defineConcreteLaws} from './given.js'
import {associativity} from '#algebra'
import {UnderlyingArbitrary} from '#arbitrary'

/**
 * Build typeclass laws for `Semigroup`.
 * @category typeclass laws
 */
export const semigroupLaws: BuildConcrete<SemigroupTypeLambda> = ({
  F,
  equalsA,
  a,
  suffix,
}) => {
  type A = UnderlyingArbitrary<typeof a>

  return defineConcreteLaws(
    'Semigroup',
    associativity<A>({a, f: F.combine, equals: equalsA}),

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
}

declare module './given.js' {
  interface ConcreteLambdas {
    Semigroup: SemigroupTypeLambda
  }
}
