import {Boolean as BO} from 'effect'
import {EquivalenceTypeLambda} from 'effect/Equivalence'
import {lawTests} from '../../../law/lawList.js'
import {lawTest} from '../../../law/lawTest.js'
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
 * Test Typeclass laws.
 *
 * @category Test Typeclass Laws
 */
export const Equivalence = <A>({
  F,
  a,
}: ConcreteOptions<EquivalenceTypeLambda, A>) =>
  lawTests(
    [
      lawTest(
        'transitivity',
        (a: A, b: A, c: A) => BO.implies(F(a, b) && F(b, c), F(a, c)),
        '∀a,b,c ∈ T: a=b ∧ b=c ⇒ a=c',
      )([a, a, a]),

      lawTest(
        'symmetry',
        (a: A, b: A) => F(a, b) === F(b, a),
        '∀a,b ∈ T: a=b ⇔ b=a',
      )([a, a]),

      lawTest('reflexivity', (a: A) => F(a, a), '∀a ∈ T: a=a')([a]),
    ],
    'Equivalence',
  )
