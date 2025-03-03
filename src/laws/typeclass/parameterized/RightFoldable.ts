import {Law, LawSet} from '#law'
import * as RF from '#typeclass/RightFoldable'
import {Foldable as FO} from '@effect/typeclass'
import {pipe} from 'effect'
import {foldableLaws} from './Foldable.js'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `RightFoldable`.
 * @category typeclass laws
 */
export const rightFoldableLaws: BuildParameterized<
  RF.RightFoldableTypeLambda
> = (given, suffix?): LawSet => {
  const {Monoid: monoid, F, fa, endoA, equalsA} = unfoldGiven(given)

  const combineMap = pipe(monoid, FO.combineMap(F)),
    {reduceRight} = F,
    {combine} = monoid

  return pipe(
    given,
    foldableLaws,
    LawSet,
  )(
    `RightFoldable${suffix ?? ''}`,

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
