/** Typeclass law tests for the `BigDecimal` datatype. */
import {tinyInteger} from 'effect-ts-laws'
import {testConcreteTypeclassLaws} from 'effect-ts-laws/vitest'
import {Equivalence, fromNumber, Order} from 'effect/BigDecimal'

describe('effect/BigDecimal', () => {
  testConcreteTypeclassLaws(
    {Equivalence, Order},
    {a: tinyInteger.map(fromNumber), equalsA: Equivalence},
  )
})
