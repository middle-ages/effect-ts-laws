import {SemiAlternative as SA} from '@effect/typeclass'
import {pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {Law, addLawSet, lawTests} from '../../../law.js'
import {covariantLaws} from './Covariant.js'
import {ParameterizedGiven as Given, unfoldGiven} from './harness/given.js'

/**
 * Test typeclass laws for `SemiAlternative`.
 * @category typeclass laws
 */
export const semiAlternativeLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<SemiAlternativeTypeLambda, F, A, B, C, In1, Out2, Out1>,
) =>
  pipe(
    buildLaws('SemiAlternative', given),
    pipe(given, covariantLaws, addLawSet),
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
  given: Given<SemiAlternativeTypeLambda, F, A, B, C, In1, Out2, Out1>,
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

declare module './harness/given.js' {
  interface ParameterizedLambdas {
    SemiAlternative: SemiAlternativeTypeLambda
  }
}
