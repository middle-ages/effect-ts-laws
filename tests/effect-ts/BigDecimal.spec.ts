/** Typeclass law tests for `BigDecimal` datatype. */
import {testConcreteTypeclassLaws, tinyInteger} from 'effect-ts-laws'
import {Equivalence, fromNumber, Order} from 'effect/BigDecimal'

describe('effect/BigDecimal', () => {
  testConcreteTypeclassLaws(
    {Equivalence, Order},
    {a: tinyInteger.map(fromNumber), equalsA: Equivalence},
  )
})
