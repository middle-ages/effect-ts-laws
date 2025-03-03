import {Law, addLawSets, lawTests} from '#law'
import {SemiAlternative as SA} from '@effect/typeclass'
import {pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {covariantLaws} from './Covariant.js'
import type {BuildParameterized} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `SemiAlternative`.
 * @category typeclass laws
 */
export const semiAlternativeLaws: BuildParameterized<
  SemiAlternativeTypeLambda
> = (given, suffix?) => {
  const {F, equalsFa, fa} = unfoldGiven(given),
    {coproduct, coproductMany} = F

  return pipe(
    lawTests(
      `SemiAlternative${suffix ?? ''}`,

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
    ),
    pipe(given, covariantLaws, addLawSets),
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
