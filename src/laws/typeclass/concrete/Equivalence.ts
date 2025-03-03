import {Law, lawTests} from '#law'
import {Boolean as BO} from 'effect'
import type {EquivalenceTypeLambda} from 'effect/Equivalence'
import {UnderlyingArbitrary} from '../../../arbitrary.js'
import type {BuildConcrete} from './given.js'

/**
 * Build laws for `Equivalence`.
 * @category typeclass laws
 */
export const equivalenceLaws: BuildConcrete<EquivalenceTypeLambda> = ({
  F,
  a,
}) => {
  type A = UnderlyingArbitrary<typeof a>

  return lawTests(
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
}

declare module './given.js' {
  interface ConcreteLambdas {
    Equivalence: EquivalenceTypeLambda
  }
}
