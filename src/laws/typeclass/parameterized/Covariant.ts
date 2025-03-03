import {addLawSets, Law, lawTests} from '#law'
import {Covariant as CO} from '@effect/typeclass'
import {Covariant as optionCovariant} from '@effect/typeclass/data/Option'
import {flow, identity, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {invariantLaws} from './Invariant.js'
import {withOuterOption} from './compose.js'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'
import {BuildInternal} from './internal.js'

/**
 * Typeclass laws for `Covariant` and its requirement `Invariant`.
 * @category typeclass laws
 */
export const covariantLaws: BuildParameterized<CovariantTypeLambda> = (
  given,
  suffix?,
) =>
  pipe(
    buildLaws(`Covariant${suffix ?? ''}`, given),
    pipe(given, invariantLaws, addLawSets),
    addLawSets(
      buildLaws(...withOuterOption('Covariant', given, optionCovariant)),
    ),
  )

const buildLaws: BuildInternal<CovariantTypeLambda> = (name, given) => {
  const {F, ab, bc, equalsFa, equalsFc, fa} = unfoldGiven(given)

  return lawTests(
    name,

    Law(
      'identity',
      'map(id) = id',
      fa,
    )(fa => equalsFa(F.map(fa, identity), fa)),

    Law(
      'composition',
      'map(bc ∘ ab) = map(bc) ∘ map(ab)',
      fa,
      ab,
      bc,
    )((fa, ab, bc) =>
      equalsFc(F.map(fa, flow(ab, bc)), pipe(fa, F.map(ab), F.map(bc))),
    ),
  )
}

/**
 * Type lambda for the `Covariant` typeclass.
 * @category type lambda
 */
export interface CovariantTypeLambda extends TypeLambda {
  readonly type: CO.Covariant<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Covariant: CovariantTypeLambda
  }
}
