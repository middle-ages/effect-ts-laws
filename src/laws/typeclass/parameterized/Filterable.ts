import {Law, lawTests} from '#law'
import {Filterable as FI} from '@effect/typeclass'
import {flow, Option as OP, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `Filterable`.
 * @category typeclass laws
 */
export const filterableLaws: BuildParameterized<FilterableTypeLambda> = (
  given,
  suffix?,
) => {
  const name = `Filterable${suffix ?? ''}`
  const {
    F: {filterMap},
    fa,
    equalsFa,
    equalsFc,
    aob,
    boc,
  } = unfoldGiven(given)

  return lawTests(
    name,
    Law(
      'identity',
      'filterMap(Option.some) = id',
      fa,
    )(fa => equalsFa(filterMap(fa, OP.some), fa)),

    Law(
      'composition',
      'filterMap(boc) ∘ filterMap(aob) = filterMap(Option.flatMap(boc) ∘ aob)',
      fa,
      aob,
      boc,
    )((fa, aob, boc) =>
      equalsFc(
        pipe(fa, filterMap(aob), filterMap(boc)),
        pipe(fa, filterMap(flow(aob, OP.flatMap(boc)))),
      ),
    ),
  )
}

/**
 * Type lambda for the `Filterable` typeclass.
 * @category type lambda
 */
export interface FilterableTypeLambda extends TypeLambda {
  readonly type: FI.Filterable<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Filterable: FilterableTypeLambda
  }
}
