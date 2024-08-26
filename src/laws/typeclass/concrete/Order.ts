import {Boolean as BO} from 'effect'
import {OrderTypeLambda} from 'effect/Order'
import {lawTest, lawTests} from '../../../law.js'
import {ConcreteOptions} from './options.js'

declare module './options.js' {
  interface ConcreteMap<A> {
    Order: {
      lambda: OrderTypeLambda
      laws: ReturnType<typeof Order<A>>
    }
  }
}

export const Order = <A>({
  F,
  a,
  equalsA,
}: ConcreteOptions<OrderTypeLambda, A>) => {
  const lte = (a: A, b: A): boolean => F(a, b) <= 0

  return lawTests(
    [
      lawTest(
        'transitivity',
        (a: A, b: A, c: A) => BO.implies(lte(a, b) && lte(b, c), lte(a, c)),
        '∀a,b,c ∈ T: a≤b ∧ b≤c ⇒ a≤c',
      )([a, a, a]),

      lawTest(
        'antisymmetry',
        (a: A, b: A) => BO.implies(lte(a, b) && lte(b, a), equalsA(a, b)),
        '∀a,b ∈ T: a≤b ∧ b≤a ⇒ a=b',
      )([a, a]),

      lawTest('reflexivity', (a: A) => lte(a, a), '∀a ∈ T: a≤a')([a]),

      lawTest(
        'connectivity',
        (a: A, b: A) => lte(a, b) || lte(b, a),
        '∀a,b ∈ T: a≤b ∨ b≤a',
      )([a, a]),
    ],
    'Order',
  )
}
