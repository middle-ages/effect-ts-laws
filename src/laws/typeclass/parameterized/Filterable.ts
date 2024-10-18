import {Filterable as FI} from '@effect/typeclass'
import {Option as OP, pipe} from 'effect'
import {Law, lawTests} from '../../../law.js'
import {unfoldGiven} from './given.js'
import type {ParameterizedGiven as Given} from './given.js'
import type {Kind, TypeLambda} from 'effect/HKT'

/**
 * Typeclass laws for `Filterable`.
 * @category typeclass laws
 */
export const filterableLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<FilterableTypeLambda, F, A, B, C, R, O, E>,
) => pipe(buildLaws('Filterable', given))

const buildLaws = <F extends TypeLambda, A, B, C, R, O, E>(
  name: string,
  given: Given<FilterableTypeLambda, F, A, B, C, R, O, E>,
) => {
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
    )((fa, aob, boc) => {
      const lhs: Kind<F, R, O, E, C> = pipe(fa, filterMap(aob), filterMap(boc))
      const rhs: Kind<F, R, O, E, C> = pipe(
        fa,
        filterMap(a => pipe(a, aob, OP.flatMap(boc))),
      )

      return equalsFc(lhs, rhs)
    }),
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
