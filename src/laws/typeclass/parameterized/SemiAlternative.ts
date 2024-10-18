import {SemiAlternative as SA} from '@effect/typeclass'
import {pipe} from 'effect'
import {Law, addLawSets, lawTests} from '../../../law.js'
import {covariantLaws} from './Covariant.js'
import {unfoldGiven} from './given.js'
import type {ParameterizedGiven as Given} from './given.js'
import type {TypeLambda} from 'effect/HKT'

/**
 * Typeclass laws for `SemiAlternative`.
 * @category typeclass laws
 */
export const semiAlternativeLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<SemiAlternativeTypeLambda, F, A, B, C, R, O, E>,
) =>
  pipe(
    buildLaws('SemiAlternative', given),
    pipe(given, covariantLaws, addLawSets),
  )

const buildLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  name: string,
  given: Given<SemiAlternativeTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {F, equalsFa, fa} = unfoldGiven(given),
    {coproduct, coproductMany} = F

  return lawTests(
    name,

    Law(
      'associativity',
      '(fa₁ ⊕ fa₂) ⊕ fa₃ = fa₁ ⊕ (fa₂ ⊕ fa₃)',
      fa,
      fa,
      fa,
    )((fa1, fa2, fa3) =>
      equalsFa(
        coproduct(coproduct(fa1, fa2), fa3),
        coproduct(fa1, coproduct(fa2, fa3)),
      ),
    ),

    Law(
      'coproductMany associativity',
      'coproductMany(fa₁ ⊕ [fa₂, fa₃]) = coproduct(fa₁, coproduct(fa₂, fa₃))',
      fa,
      fa,
      fa,
    )((fa1, fa2, fa3) =>
      equalsFa(
        coproductMany(fa1, [fa2, fa3]),
        coproduct(fa1, coproduct(fa2, fa3)),
      ),
    ),
  )
}

/**
 * Type lambda for the `SemiAlternative` typeclass.
 * @category type lambda
 */
export interface SemiAlternativeTypeLambda extends TypeLambda {
  readonly type: SA.SemiAlternative<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    SemiAlternative: SemiAlternativeTypeLambda
  }
}
