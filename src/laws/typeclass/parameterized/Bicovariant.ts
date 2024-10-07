import {Bicovariant as BI, Covariant as CO} from '@effect/typeclass'
import {identity, pipe} from 'effect'
import {dual} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import {LawSet} from '../../../law.js'
import {covariantLaws} from './Covariant.js'
import {ParameterizedGiven as Given} from './harness/given.js'

/**
 * Test typeclass laws for `Bicovariant`.
 * @category typeclass laws
 */
export const bicovariantLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<BicovariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
) => {
  const {F} = given
  const [mapFirst, mapSecond]: Pair<CO.Covariant<F>['map']> = [
    dual(2, <A, B>(fa: Kind<F, In1, Out2, Out1, A>, ab: (a: A) => B) =>
      pipe(fa, F.bimap(identity, ab)),
    ),
    dual(2, <D, E>(fa: Kind<F, In1, Out2, D, A>, od: (a: D) => E) =>
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

declare module './harness/given.js' {
  interface ParameterizedLambdas {
    Bicovariant: BicovariantTypeLambda
  }
}

type Pair<A> = [A, A]
