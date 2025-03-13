import {Law} from '#law'
import {Boolean as BO, Equivalence as EQ} from 'effect'
import type {OrderTypeLambda} from 'effect/Order'
import {
  greaterThan,
  greaterThanOrEqualTo,
  lessThan,
  lessThanOrEqualTo,
} from 'effect/Order'
import fc from 'fast-check'
import type {BuildConcrete} from './given.js'
import {defineConcreteLaws} from './given.js'

/**
 * Build typeclass laws for `Order`.
 * @category typeclass laws
 */
export const orderLaws: BuildConcrete<OrderTypeLambda> = ({
  F,
  a,
  equalsA,
  suffix,
}) => {
  const build = buildLaws(a, equalsA),
    [lt, gt, lte, gte] = [
      lessThan(F),
      greaterThan(F),
      lessThanOrEqualTo(F),
      greaterThanOrEqualTo(F),
    ]

  const consistencyLaw = Law(
    'order equals consistency',
    `∀a,b ∈ T: a≤b ∧ b≥a ⇒ a=c`,
    a,
    a,
  )((a, b) => BO.implies(lte(a, b) && gte(a, b), equalsA(a, b)))

  return defineConcreteLaws('Order', consistencyLaw)(
    suffix,
    build('≤', lte, gt),
    build('≥', gte, lt),
  )
}

const buildLaws =
  <A>(a: fc.Arbitrary<A>, equalsA: EQ.Equivalence<A>) =>
  (
    sym: string,
    op: (a: A, b: A) => boolean,
    complement: (a: A, b: A) => boolean,
  ) =>
    defineConcreteLaws(
      'Order',
      Law(
        'transitivity',
        `a${sym}b ∧ b${sym}c ⇒ a${sym}c`,
        a,
        a,
        a,
      )((a, b, c) => BO.implies(op(a, b) && op(b, c), op(a, c))),

      Law(
        'antisymmetry',
        `a${sym}b ∧ b${sym}a ⇒ a=b`,
        a,
        a,
      )((a, b) => BO.implies(op(a, b) && op(b, a), equalsA(a, b))),

      Law('reflexivity', `a${sym}a`, a)((a: A) => op(a, a)),

      Law(
        'connectivity',
        `a${sym}b ∨ b${sym}a`,
        a,
        a,
      )((a, b) => op(a, b) || op(b, a)),

      Law(
        'complement consistency',
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
