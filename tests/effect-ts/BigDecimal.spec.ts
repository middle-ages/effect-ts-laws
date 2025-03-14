/** Typeclass law tests for the `BigDecimal` datatype. */
import {tinyInteger} from '#effect-ts-laws'
import {testConcreteTypeclassLaws} from '#test'
import {Equivalence, Order, unsafeFromNumber} from 'effect/BigDecimal'

describe('effect/BigDecimal', () => {
  testConcreteTypeclassLaws(
    {Equivalence, Order},
    {a: tinyInteger.map(unsafeFromNumber), equalsA: Equivalence},
  )
})
