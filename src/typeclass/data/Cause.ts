/** Typeclass law tests for the `Cause` datatype. */
import {Covariant as CO, Monad as MD} from '@effect/typeclass'
import {Cause as CA, Equal} from 'effect'
import type {LiftEquivalence} from '../../law.js'
import {constant} from 'effect/Function'
import type {TypeLambda} from 'effect/HKT'

export interface CauseTypeLambda extends TypeLambda {
  readonly type: CA.Cause<this['Target']>
}

/**
 * @category instances
 */
export const Monad: MD.Monad<CauseTypeLambda> = {
  map: CA.map,
  imap: CO.imap<CauseTypeLambda>(CA.map),
  flatMap: CA.flatMap,
  of: CA.fail,
}

/**
 * @category instances
 */
export const getEquivalence: LiftEquivalence<CauseTypeLambda> = constant(
  Equal.equals,
)
