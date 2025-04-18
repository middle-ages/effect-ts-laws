import {Law, LawSet} from '#law'
import {Monad as MD} from '@effect/typeclass'
import {flow, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {covariantLaws} from './Covariant.js'
import {flatMapLaws} from './FlatMap.js'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `Monad`.
 * @category typeclass laws
 */
export const monadLaws: BuildParameterized<MonadTypeLambda> = (
  given,
  suffix?,
) => {
  const {a, F, fa, equalsFa, equalsFb, ab, afb} = unfoldGiven(given)

  return LawSet(covariantLaws(given), flatMapLaws(given))(
    `Monad${suffix ?? ''}`,
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
