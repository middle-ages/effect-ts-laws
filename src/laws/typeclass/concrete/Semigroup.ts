import {SemigroupTypeLambda} from '@effect/typeclass/Semigroup'
import {lawTests} from '../../../law/lawList.js'
import {lawTest} from '../../../law/lawTest.js'
import {ConcreteOptions} from './options.js'

declare module './options.js' {
  interface ConcreteMap<A> {
    Semigroup: {
      lambda: SemigroupTypeLambda
      laws: ReturnType<typeof Semigroup<A>>
    }
  }
}

/** Test Semigroup laws. */
export const Semigroup = <A>({
  F,
  equalsA,
  a,
}: ConcreteOptions<SemigroupTypeLambda, A>) =>
  lawTests(
    [
      lawTest(
        'associativity',
        (a: A, b: A, c: A) =>
          equalsA(F.combine(F.combine(a, b), c), F.combine(a, F.combine(b, c))),
        '(a ⊹ b) ⊹ c = a ⊹ (b ⊹ c)',
      )([a, a, a]),

      lawTest(
        'combineMany.associativity',
        (a: A, b: A, c: A) =>
          equalsA(F.combineMany(a, [b, c]), F.combine(a, F.combine(b, c))),
        'combineMany(a, [b, c]) = combine(a, combine(b, c))',
      )([a, a, a]),
    ],
    'Semigroup',
  )
