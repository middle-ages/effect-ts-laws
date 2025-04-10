import {Law, lawTests} from '#law'
import {FlatMap} from '@effect/typeclass'
import {flow, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `FlatMap`.
 * @category typeclass laws
 */
export const flatMapLaws: BuildParameterized<FlatMapTypeLambda> = (
  given,
  suffix?,
) => {
  const {F, fa, equalsFc, afb, bfc} = unfoldGiven(given)

  return lawTests(
    `FlatMap${suffix ?? ''}`,
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
  )
}

/**
 * Type lambda for the `FlatMap` typeclass.
 * @category type lambda
 */
export interface FlatMapTypeLambda extends TypeLambda {
  readonly type: FlatMap.FlatMap<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    FlatMap: FlatMapTypeLambda
  }
}
