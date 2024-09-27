import {Law, lawTests} from '#law'
import {Boolean as BO} from 'effect'
import {EquivalenceTypeLambda} from 'effect/Equivalence'
import {ConcreteGiven} from './given.js'

/**
 * Test typeclass laws for `Equivalence`.
 * @category typeclass laws
 */
export const Equivalence = <A>({
  F,
  a,
}: ConcreteGiven<EquivalenceTypeLambda, A>) =>
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

declare module './given.js' {
  interface ConcreteLambdas {
    Equivalence: EquivalenceTypeLambda
  }
}
