import {Covariant as CO} from '@effect/typeclass'
import {Covariant as optionCovariant} from '@effect/typeclass/data/Option'
import {flow, identity, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {addLawSet, Law, lawTests} from '../../../law.js'
import {invariantLaws} from './Invariant.js'
import {withOuterOption} from './harness/compose.js'
import {ParameterizedGiven as Given, unfoldGiven} from './harness/given.js'

/**
 * Test typeclass laws for `Covariant`.
 * @category typeclass laws
 */
export const covariantLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<CovariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
  suffix?: string,
) =>
  pipe(
    buildLaws(`Covariant${suffix ?? ''}`, given),
    pipe(given, invariantLaws, addLawSet),
    addLawSet(
      buildLaws(...withOuterOption('Covariant', given, optionCovariant)),
    ),
  )

const buildLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  name: string,
  given: Given<CovariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
) => {
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

declare module './harness/given.js' {
  interface ParameterizedLambdas {
    Covariant: CovariantTypeLambda
  }
}
