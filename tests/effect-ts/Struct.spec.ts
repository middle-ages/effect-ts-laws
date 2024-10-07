/** Typeclass law tests for the `Struct` datatype. */
import {Equivalence as EQ, Order as OD} from 'effect'
import {Mono, monoEquivalence, monoOrder} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {Kind, TypeLambda} from 'effect/HKT'
import {getOrder, getEquivalence as getStructEquivalence} from 'effect/Struct'
import fc from 'fast-check'

describe('effect/Struct', () => {
  interface StructTypeLambda extends TypeLambda {
    readonly type: Record<'first' | 'second', this['Target']>
  }

  type Struct<A> = Kind<StructTypeLambda, never, unknown, unknown, A>

  const getArbitrary = <A>(a: fc.Arbitrary<A>): fc.Arbitrary<Struct<A>> =>
    fc.record({first: a, second: a})

  const getEquivalence = <A>(
    equalsA: EQ.Equivalence<A>,
  ): EQ.Equivalence<Struct<A>> =>
    getStructEquivalence({
      first: equalsA,
      second: equalsA,
    })

  const Order: OD.Order<Struct<Mono>> = getOrder({
    first: monoOrder,
    second: monoOrder,
  })

  testTypeclassLaws<StructTypeLambda>({
    getEquivalence,
    getArbitrary,
  })({
    Equivalence: getEquivalence(monoEquivalence),
    Order,
  })
})
