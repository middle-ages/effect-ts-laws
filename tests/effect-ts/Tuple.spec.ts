/** Typeclass law tests for the tuple datatype. */
import {Bicovariant} from '@effect/typeclass/data/Tuple'
import {Equivalence as EQ, pipe, String as STR, Tuple as TU} from 'effect'
import {monoEquivalence, monoOrder, testTypeclassLaws} from 'effect-ts-laws'
import {TupleTypeLambda} from 'effect/Tuple'
import fc from 'fast-check'

describe('@effect/typeclass/data/Tuple', () => {
  const getEquivalence = <A>(
    a: EQ.Equivalence<A>,
  ): EQ.Equivalence<[string, A]> => TU.getEquivalence(STR.Equivalence, a)

  const getArbitrary = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<[string, A]> =>
    fc.tuple(fc.string({maxLength: 5}), a)

  const [Equivalence, Order] = [
    getEquivalence(monoEquivalence),
    TU.getOrder(STR.Order, monoOrder),
  ]

  pipe(
    {Bicovariant, Equivalence, Order},
    testTypeclassLaws<TupleTypeLambda>({getEquivalence, getArbitrary}),
  )
})
