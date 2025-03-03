import {addLawSets, Law, lawTests} from '#law'
import {Invariant as IN} from '@effect/typeclass'
import {Covariant as optionInvariant} from '@effect/typeclass/data/Option'
import {flow, identity, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {withOuterOption} from './compose.js'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'
import {BuildInternal} from './internal.js'

/**
 * Typeclass laws for `Invariant`.
 * @category typeclass laws
 */
export const invariantLaws: BuildParameterized<InvariantTypeLambda> = (
  given,
  suffix?,
) =>
  pipe(
    buildLaws(`Invariant${suffix ?? ''}`, given),
    addLawSets(
      buildLaws(...withOuterOption('Invariant', given, optionInvariant)),
    ),
  )

const buildLaws: BuildInternal<InvariantTypeLambda> = (name, given) => {
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
