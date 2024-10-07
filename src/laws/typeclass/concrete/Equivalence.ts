import {Boolean as BO} from 'effect'
import {EquivalenceTypeLambda} from 'effect/Equivalence'
import {Law, LawSet, lawTests} from '../../../law.js'
import {ConcreteGiven} from './harness/given.js'

/**
 * Test typeclass laws for `Equivalence`.
 * @category typeclass laws
 */
export const equivalenceLaws = <A>({
  F,
  a,
}: ConcreteGiven<EquivalenceTypeLambda, A>): LawSet =>
  lawTests(
    'Equivalence',
    Law(
      'transitivity',
      'a=b ∧ b=c ⇒ a=c',
      a,
      a,
      a,
    )((a: A, b: A, c: A) => BO.implies(F(a, b) && F(b, c), F(a, c))),

    Law('symmetry', 'a=b ⇔ b=a', a, a)((a: A, b: A) => F(a, b) === F(b, a)),

    Law('reflexivity', 'a=a', a)((a: A) => F(a, a)),
  )

declare module './harness/given.js' {
  interface ConcreteLambdas {
    Equivalence: EquivalenceTypeLambda
  }
}
