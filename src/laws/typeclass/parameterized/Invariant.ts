import {Invariant as IN} from '@effect/typeclass'
import {Covariant as optionInvariant} from '@effect/typeclass/data/Option'
import {flow, identity, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {addLawSet, Law, lawTests} from '../../../law.js'
import {
  ParameterizedGiven as Given,
  unfoldGiven,
  withOuterOption,
} from './given.js'

/**
 * Test typeclass laws for `Invariant`.
 * @category typeclass laws
 */
export const Invariant = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<InvariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
) =>
  pipe(
    buildLaws('Invariant', given),
    addLawSet(
      buildLaws(...withOuterOption('Invariant', given, optionInvariant)),
    ),
  )

const buildLaws = <F extends TypeLambda, A, B, C, In1, Out2, Out1>(
  name: string,
  given: Given<InvariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
) => {
  const {
    F: {imap},
    fa,
    equalsFa,
    equalsFc,
    ab,
    bc,
    ba,
    cb,
  } = unfoldGiven(given)

  return lawTests(
    name,
    Law(
      'identity',
      'imap(id, id) = id',
      fa,
    )(a => equalsFa(imap(a, identity, identity), a)),

    Law(
      'composition',
      'a ▹ imap(ab, ba) ▹ imap(bc, cb) = a ▹ imap(bc ∘ ab, ba ∘ cb)',
      fa,
      ab,
      bc,
      ba,
      cb,
    )((a, ab, bc, ba, cb) =>
      equalsFc(
        pipe(a, imap(ab, ba), imap(bc, cb)),
        pipe(a, imap(flow(ab, bc), flow(cb, ba))),
      ),
    ),
  )
}

/**
 * Type lambda for the `Invariant` typeclass.
 * @category type lambda
 */
export interface InvariantTypeLambda extends TypeLambda {
  readonly type: IN.Invariant<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Invariant: InvariantTypeLambda
  }
}
