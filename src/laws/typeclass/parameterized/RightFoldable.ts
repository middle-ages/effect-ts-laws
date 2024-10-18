import {Foldable as FO} from '@effect/typeclass'
import {pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {Law, LawSet} from '../../../law.js'
import {RightFoldable as RF} from '../../../typeclass.js'
import {foldableLaws} from './Foldable.js'
import type {ParameterizedGiven as Given} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `RightFoldable`.
 * @category typeclass laws
 */
export const rightFoldableLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<RF.RightFoldableTypeLambda, F, A, B, C, R, O, E>,
): LawSet => {
  const {Monoid: monoid, F, fa, endoA, equalsA} = unfoldGiven(given)

  const combineMap = pipe(monoid, FO.combineMap(F)),
    {reduceRight} = F,
    {combine} = monoid

  return pipe(
    given,
    foldableLaws,
    LawSet,
  )(
    'RightFoldable',

    Law(
      'reduceRight',
      'reduceRight(∅, (p,a) ⇒ aa(a) ⊕ p) = combineMap(Monoid)(aa)',
      fa,
      endoA,
    )((fa, endoA) =>
      equalsA(
        pipe(
          fa,
          reduceRight(monoid.empty, (p, a) => combine(endoA(a), p)),
        ),
        pipe(fa, combineMap(endoA)),
      ),
    ),
  )
}

declare module './given.js' {
  interface ParameterizedLambdas {
    RightFoldable: RF.RightFoldableTypeLambda
  }
}
