import {Monoid as MO} from '@effect/typeclass'
import {TypeLambda} from 'effect/HKT'
import {lawTest, lawTests} from '../../../law.js'
import {ConcreteOptions} from './options.js'

declare module './options.js' {
  interface ConcreteMap<A> {
    Monoid: {
      lambda: MonoidTypeLambda
      laws: ReturnType<typeof Monoid<A>>
    }
  }
}

export const Monoid = <A>({
  F,
  equalsA,
  a,
}: ConcreteOptions<MonoidTypeLambda, A>) =>
  lawTests(
    [
      lawTest(
        'leftIdentity',
        (a: A) => equalsA(F.combine(F.empty, a), a),
        '∅ ⊹ a = a',
      )([a]),

      lawTest(
        'rightIdentity',
        (a: A) => equalsA(F.combine(a, F.empty), a),
        'a = a ⊹ ∅',
      )([a]),
    ],
    'Monoid',
  )

export interface MonoidTypeLambda extends TypeLambda {
  readonly type: MO.Monoid<this['Target']>
}
