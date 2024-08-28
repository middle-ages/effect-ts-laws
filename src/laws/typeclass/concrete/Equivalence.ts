import {Law, lawTests} from '#law'
import {Boolean as BO} from 'effect'
import {EquivalenceTypeLambda} from 'effect/Equivalence'
import {ConcreteOptions} from './options.js'

declare module './options.js' {
  interface ConcreteMap<A> {
    Equivalence: {
      lambda: EquivalenceTypeLambda
      laws: ReturnType<typeof Equivalence<A>>
    }
  }
}

/**
 * Test typeclass laws for `Equivalence`.
 * @category typeclass laws
 */
export const Equivalence = <A>({
  F,
  a,
}: ConcreteOptions<EquivalenceTypeLambda, A>) =>
  lawTests(
    'Equivalence',
    Law(
      'transitivity',
      '∀a,b,c ∈ T: a=b ∧ b=c ⇒ a=c',
      a,
      a,
      a,
    )((a: A, b: A, c: A) => BO.implies(F(a, b) && F(b, c), F(a, c))),

    Law(
      'symmetry',
      '∀a,b ∈ T: a=b ⇔ b=a',
      a,
      a,
    )((a: A, b: A) => F(a, b) === F(b, a)),

    Law('reflexivity', '∀a ∈ T: a=a', a)((a: A) => F(a, a)),
  )
