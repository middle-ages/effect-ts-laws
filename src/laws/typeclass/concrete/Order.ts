import {Boolean as BO} from 'effect'
import {OrderTypeLambda} from 'effect/Order'
import {Law, lawTests} from '../../../law.js'
import {ConcreteOptions} from './options.js'

declare module './options.js' {
  interface ConcreteMap<A> {
    Order: {
      lambda: OrderTypeLambda
      laws: ReturnType<typeof Order<A>>
    }
  }
}

/**
 * Test typeclass laws for `Order`.
 * @category typeclass laws
 */
export const Order = <A>({
  F,
  a,
  equalsA,
}: ConcreteOptions<OrderTypeLambda, A>) => {
  const lte = (a: A, b: A): boolean => F(a, b) <= 0

  return lawTests(
    'Order',
    Law(
      'transitivity',
      '∀a,b,c ∈ T: a≤b ∧ b≤c ⇒ a≤c',
      a,
      a,
      a,
    )((a, b, c) => BO.implies(lte(a, b) && lte(b, c), lte(a, c))),

    Law(
      'antisymmetry',
      '∀a,b ∈ T: a≤b ∧ b≤a ⇒ a=b',
      a,
      a,
    )((a, b) => BO.implies(lte(a, b) && lte(b, a), equalsA(a, b))),

    Law('reflexivity', '∀a ∈ T: a≤a', a)((a: A) => lte(a, a)),

    Law(
      'connectivity',
      '∀a,b ∈ T: a≤b ∨ b≤a',
      a,
      a,
    )((a, b) => lte(a, b) || lte(b, a)),
  )
}
