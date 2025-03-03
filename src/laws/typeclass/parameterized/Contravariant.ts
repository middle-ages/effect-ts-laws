import {addLawSets, Law, lawTests} from '#law'
import {Contravariant as CN} from '@effect/typeclass'
import {flow, identity, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {invariantLaws} from './Invariant.js'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `Contravariant` and its requirement: `Invariant`.
 * @category typeclass laws
 */
export const contravariantLaws: BuildParameterized<ContravariantTypeLambda> = (
  given,
  suffix?,
) => {
  const {F, equalsFa, fa, ba, cb, equalsFc} = unfoldGiven(given)
  return pipe(
    lawTests(
      `Contravariant${suffix ?? ''}`,

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
    ),
    pipe(given, invariantLaws, addLawSets),
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
