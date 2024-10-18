import {Contravariant as CN} from '@effect/typeclass'
import {flow, identity, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {addLawSets, Law, lawTests} from '../../../law.js'
import {invariantLaws} from './Invariant.js'
import type {ParameterizedGiven as Given} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `Contravariant` and its requirement: `Invariant`.
 * @category typeclass laws
 */
export const contravariantLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<ContravariantTypeLambda, F, A, B, C, R, O, E>,
) =>
  pipe(
    buildLaws('Contravariant', given),
    pipe(given, invariantLaws, addLawSets),
  )

const buildLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  name: string,
  given: Given<ContravariantTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {F, equalsFa, fa, ba, cb, equalsFc} = unfoldGiven(given)

  return lawTests(
    name,
    Law(
      'identity',
      'contramap(id) = id',
      fa,
    )(fa => equalsFa(F.contramap(fa, identity), fa)),

    Law(
      'composition',
      'fa ▹ contramap(ba) ▹ contramap(cb) = fa ▹ contramap(ba ∘ cb)',
      fa,
      ba,
      cb,
    )((fa, ba, cb) =>
      equalsFc(
        pipe(fa, F.contramap(ba), F.contramap(cb)),
        pipe(fa, F.contramap(flow(cb, ba))),
      ),
    ),
  )
}

/**
 * Type lambda for the `Contravariant` typeclass.
 * @category type lambda
 */
export interface ContravariantTypeLambda extends TypeLambda {
  readonly type: CN.Contravariant<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Contravariant: ContravariantTypeLambda
  }
}
