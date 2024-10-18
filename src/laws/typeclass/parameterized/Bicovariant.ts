import {Bicovariant as BI, Covariant as CO} from '@effect/typeclass'
import {identity, pipe} from 'effect'
import {dual} from 'effect/Function'
import {LawSet} from '../../../law.js'
import {covariantLaws} from './Covariant.js'
import type {ParameterizedGiven as Given} from './given.js'
import type {Kind, TypeLambda} from 'effect/HKT'

/**
 * Typeclass laws for `Bicovariant`.
 * @category typeclass laws
 */
export const bicovariantLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<BicovariantTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {F} = given
  const [mapFirst, mapSecond]: Pair<CO.Covariant<F>['map']> = [
    dual(2, <A, B>(fa: Kind<F, R, O, E, A>, ab: (a: A) => B) =>
      pipe(fa, F.bimap(identity, ab)),
    ),
    dual(2, <D, E>(fa: Kind<F, R, O, D, A>, od: (a: D) => E) =>
      pipe(fa, F.bimap(od, identity)),
    ),
  ]

  const [first, second]: Pair<CO.Covariant<F>> = [
    {map: mapFirst, imap: CO.imap<F>(mapFirst)},
    {map: mapSecond, imap: CO.imap<F>(mapSecond)},
  ]

  return pipe(
    'Bicovariant',
    LawSet(
      covariantLaws({...given, F: first}, '₁'),
      covariantLaws({...given, F: second}, '₂'),
    ),
  )
}

/**
 * Type lambda for the `Bicovariant` typeclass.
 * @category type lambda
 */
export interface BicovariantTypeLambda extends TypeLambda {
  readonly type: BI.Bicovariant<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Bicovariant: BicovariantTypeLambda
  }
}

type Pair<A> = [A, A]
