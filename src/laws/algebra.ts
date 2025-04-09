import {Law} from '#law'
import type {Equivalence} from 'effect/Equivalence'
import fc from 'fast-check'

/**
 * Test that a binary operation is associative.
 * @category algebraic laws
 */
export const associativity = <A>(
  {
    f,
    a,
    equals,
  }: {
    f: (a: A, b: A) => A
    a: fc.Arbitrary<A>
    equals: Equivalence<A>
  },
  note = '(a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)',
  name = 'associativity',
) => Law(name, note, a, a, a)((a, b, c) => equals(f(f(a, b), c), f(a, f(b, c))))

/**
 * Test the composition of two operations cancels each other.
 * @category algebraic laws
 */
export const inverse = <A, B>(
  {
    f,
    g,
    a,
    equals,
  }: {
    f: (a: A) => B
    g: (b: B) => A
    a: fc.Arbitrary<A>
    equals: Equivalence<A>
  },
  name = 'inverse',
  note = 'g ⚬ f = id',
) => Law(name, note, a)(a => equals(g(f(a)), a))

/**
 * Test that a binary operation is symmetric.
 * @category algebraic laws
 */
export const symmetry = <A, B>(
  {
    f,
    a,
    equals,
  }: {
    f: (left: A, right: A) => B
    a: fc.Arbitrary<A>
    equals: Equivalence<B>
  },
  name = 'symmetry',
  note = 'f(a, b) = f(b, a)',
) =>
  Law(name, note, a, a)((left, right) => equals(f(left, right), f(right, left)))
