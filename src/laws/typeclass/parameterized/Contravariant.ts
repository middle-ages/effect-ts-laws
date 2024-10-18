import {Contravariant as CN} from '@effect/typeclass'
import {flow, identity, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {addLawSet, Law, lawTests} from '../../../law.js'
import {invariantLaws} from './Invariant.js'
import {ParameterizedGiven as Given, unfoldGiven} from './given.js'

/**
 * Test typeclass laws for `Contravariant` and its requirement: `Invariant`.
 * @category typeclass laws
 */
export const contravariantLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<ContravariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
) =>
  pipe(buildLaws('Contravariant', given), pipe(given, invariantLaws, addLawSet))

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
  given: Given<ContravariantTypeLambda, F, A, B, C, In1, Out2, Out1>,
) => {
  const {F, equalsFa, fa, ba, cb, equalsFc} = unfoldGiven(given)

  return lawTests(
    name,
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
