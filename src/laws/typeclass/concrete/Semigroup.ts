import {SemigroupTypeLambda} from '@effect/typeclass/Semigroup'
import {Law, lawTests} from '../../../law.js'
import {ConcreteOptions} from './options.js'

declare module './options.js' {
  interface ConcreteMap<A> {
    Semigroup: {
      lambda: SemigroupTypeLambda
      laws: ReturnType<typeof Semigroup<A>>
    }
  }
}

/**
 * Test typeclass laws for `Semigroup`.
 * @category typeclass laws
 */
export const Semigroup = <A>({
  F,
  equalsA,
  a,
}: ConcreteOptions<SemigroupTypeLambda, A>) =>
  lawTests(
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
  )
