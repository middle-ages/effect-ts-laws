import {Law, lawTests} from '#law'
import {implies, Equivalence as BooleanEquivalence} from 'effect/Boolean'
import type {EquivalenceTypeLambda} from 'effect/Equivalence'
import {UnderlyingArbitrary} from '#arbitrary'
import type {BuildConcrete} from './given.js'
import {symmetry} from '#algebra'

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
    )((a: A, b: A, c: A) => implies(F(a, b) && F(b, c), F(a, c))),

    symmetry<A, boolean>(
      {
        f: F,
        a,
        equals: BooleanEquivalence,
      },
      'a=b ⇔ b=a',
    ),

    Law('reflexivity', 'a=a', a)((a: A) => F(a, a)),
  )
}

declare module './given.js' {
  interface ConcreteLambdas {
    Equivalence: EquivalenceTypeLambda
  }
}
