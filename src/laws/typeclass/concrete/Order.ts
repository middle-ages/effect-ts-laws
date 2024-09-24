import {Law} from '#law'
import {Boolean as BO, Equivalence as EQ} from 'effect'
import {
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
  OrderTypeLambda,
} from 'effect/Order'
import fc from 'fast-check'
import {ConcreteGiven, concreteLaws} from './given.js'

/**
 * Test typeclass laws for `Order`.
 * @category typeclass laws
 */
export const Order = <A>({
  F,
  a,
  equalsA,
  suffix,
}: ConcreteGiven<OrderTypeLambda, A>) => {
  const build = buildLaws(a, equalsA),
    [lt, gt, lte, gte] = [
      lessThan(F),
      greaterThan(F),
      lessThanOrEqualTo(F),
      greaterThanOrEqualTo(F),
    ]

  const consistencyLaw = Law(
    'orderEqualsConsistency',
    `∀a,b ∈ T: a≤b ∧ b≥a ⇒ a=c`,
    a,
    a,
  )((a, b) => BO.implies(lte(a, b) && gte(a, b), equalsA(a, b)))

  return concreteLaws('Order', consistencyLaw)(
    suffix,
    build('≤', lte, gt),
    build('≥', gte, lt),
  )
}

export const buildLaws =
  <A>(a: fc.Arbitrary<A>, equalsA: EQ.Equivalence<A>) =>
  (
    sym: string,
    op: (a: A, b: A) => boolean,
    complement: (a: A, b: A) => boolean,
  ) =>
    concreteLaws(
      'Order',
      Law(
        'transitivity',
        `∀a,b,c ∈ T: a${sym}b ∧ b${sym}c ⇒ a${sym}c`,
        a,
        a,
        a,
      )((a, b, c) => BO.implies(op(a, b) && op(b, c), op(a, c))),

      Law(
        'antisymmetry',
        `∀a,b ∈ T: a${sym}b ∧ b${sym}a ⇒ a=b`,
        a,
        a,
      )((a, b) => BO.implies(op(a, b) && op(b, a), equalsA(a, b))),

      Law('reflexivity', '∀a ∈ T: a${sym}a', a)((a: A) => op(a, a)),

      Law(
        'connectivity',
        `∀a,b ∈ T: a${sym}b ∨ b${sym}a`,
        a,
        a,
      )((a, b) => op(a, b) || op(b, a)),

      Law(
        'complementConsistency',
        `∀a,b ∈ T: a${sym}b ⇒ a${sym === '≤' ? '≯' : '≮'}b`,
        a,
        a,
      )((a, b) => BO.implies(op(a, b), !complement(a, b))),
    )(sym)

declare module './given.js' {
  interface ConcreteLambdas {
    Order: OrderTypeLambda
  }
}
