import {Monad as MD} from '@effect/typeclass'
import {flow, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {Law, LawSet} from '../../../law.js'
import {covariantLaws} from './Covariant.js'
import type {ParameterizedGiven as Given} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `Monad`.
 * @category typeclass laws
 */
export const monadLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<MonadTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {a, F, fa, equalsFa, equalsFb, equalsFc, ab, afb, bfc} =
    unfoldGiven(given)

  return pipe(given, covariantLaws, LawSet)(
    'Monad',
    Law(
      'left identity',
      'of ∘ flatMap(afb) = afb',
      a,
      afb,
    )((a, afb) => equalsFb(pipe(a, F.of, F.flatMap(afb)), afb(a))),

    Law(
      'right identity',
      'flatMap(of) = id',
      fa,
    )(fa => equalsFa(pipe(fa, F.flatMap(F.of)), fa)),

    Law(
      'associativity',
      'fa ▹ flatMap(afb) ▹ flatMap(bfc) = fa ▹ flatMap(flatMap(bfc) ∘ afb)',
      fa,
      afb,
      bfc,
    )((fa, afb, bfc) =>
      equalsFc(
        pipe(fa, F.flatMap(afb), F.flatMap(bfc)),
        pipe(fa, F.flatMap(flow(afb, F.flatMap(bfc)))),
      ),
    ),

    Law(
      'map consistency',
      'map(ab) = flatMap(of ∘ ab)',
      fa,
      ab,
    )((fa, ab) =>
      equalsFb(pipe(fa, F.map(ab)), pipe(fa, F.flatMap(flow(ab, F.of)))),
    ),
  )
}

/**
 * Type lambda for the `Monad` typeclass.
 * @category type lambda
 */
export interface MonadTypeLambda extends TypeLambda {
  readonly type: MD.Monad<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Monad: MonadTypeLambda
  }
}
