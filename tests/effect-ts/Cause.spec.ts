/** Typeclass law tests for the `Cause` datatype. */
import {Covariant as CO, Monad as MD} from '@effect/typeclass'
import {Cause as CA, Equal} from 'effect'
import {cause, LiftEquivalence} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {constant} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'

interface CauseTypeLambda extends TypeLambda {
  readonly type: CA.Cause<this['Target']>
}

const Monad: MD.Monad<CauseTypeLambda> = {
  map: CA.map,
  imap: CO.imap<CauseTypeLambda>(CA.map),
  flatMap: CA.flatMap,
  of: CA.fail,
}

export const getEquivalence: LiftEquivalence<CauseTypeLambda> = constant(
  Equal.equals,
)

describe('effect/Cause', () => {
  testTypeclassLaws<CauseTypeLambda>({getEquivalence, getArbitrary: cause})({
    Monad,
  })
})
