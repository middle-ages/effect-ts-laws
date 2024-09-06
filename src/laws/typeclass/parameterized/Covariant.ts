import {Covariant as CO} from '@effect/typeclass'
import {Covariant as optionCovariant} from '@effect/typeclass/data/Option'
import {flow, identity, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {addLawSet, Law, lawTests} from '../../../law.js'
import {Invariant} from './Invariant.js'
import {
  ParameterizedGiven as Given,
  unfoldGiven,
  withOuterOption,
} from './given.js'

/**
 * Test typeclass laws for `Covariant` and its requirements: `Invariant`.
 * @category typeclass laws
 */
export const Covariant = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<CovariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
) =>
  pipe(
    buildLaws('Covariant', given),
    pipe(given, Invariant, addLawSet),
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
    Law('identity', 'map(id) = id', fa)(a => equalsFa(F.map(a, identity), a)),
    Law(
      'composition',
      'map(ab ∘ bc) = map(ab) ∘ map(bc)',
      fa,
      ab,
      bc,
    )((a, ab, bc) =>
      equalsFc(F.map(a, flow(ab, bc)), pipe(a, F.map(ab), F.map(bc))),
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
