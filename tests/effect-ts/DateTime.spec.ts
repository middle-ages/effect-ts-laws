/** Typeclass law tests for `DateTime` datatype. */
import {DateTime as DT, Equivalence as EQ} from 'effect'
import {utc} from 'effect-ts-laws'
import {testConcreteTypeclassLaws} from 'effect-ts-laws/vitest'
import {Equivalence, Order} from 'effect/DateTime'

describe('effect/DateTime', () => {
  const a = utc(),
    // Careful not to use same equivalence as the implementation
    equalsA: EQ.Equivalence<DT.DateTime> = EQ.mapInput(
      (a: Date, b: Date) => a.getTime() === b.getTime(),
      DT.toDate,
    )

  testConcreteTypeclassLaws({Equivalence, Order}, {a, equalsA})
})
