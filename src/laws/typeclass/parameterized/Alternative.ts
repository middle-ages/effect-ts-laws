import {addLawSets, Law, lawTests} from '#law'
import {
  Alternative as AL,
  Applicative as AP,
  SemiApplicative as SE,
} from '@effect/typeclass'
import {pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {UnderlyingArbitrary} from '../../../arbitrary.js'
import type {BuildParameterized, ParameterizedGiven as Given} from './given.js'
import {unfoldGiven} from './given.js'
import {BuildInternal} from './internal.js'
import {semiAlternativeLaws} from './SemiAlternative.js'

/**
 * Typeclass laws for `Alternative`.
 * @category typeclass laws
 */
export const alternativeLaws: BuildParameterized<AlternativeTypeLambda> = (
  given,
  suffix?,
) =>
  pipe(
    buildLaws(`Alternative${suffix ?? ''}`, given),
    pipe(given, semiAlternativeLaws, addLawSets),
  )

const buildLaws: BuildInternal<AlternativeTypeLambda> = (name, given) => {
  const unfolded = unfoldGiven(given),
    {F, equalsFa, fa} = unfolded,
    {coproduct, coproductAll} = F,
    isApplicative = 'productAll' in F && 'of' in F

  type A = UnderlyingArbitrary<(typeof unfolded)['a']>

  return lawTests(
    name,

    Law(
      'left identity',
      '∅ ⊕ fa = fa',
      fa,
    )(fa => equalsFa(coproduct(fa, F.zero<A>()), fa)),

    Law(
      'right identity',
      'fa ⊕ ∅ = fa',
      fa,
    )(fa => equalsFa(coproduct(F.zero<A>(), fa), fa)),

    Law(
      'coproductAll zero',
      'coproductAll([]) = ∅',
      fa,
    )(() => equalsFa(coproductAll([]), F.zero<A>())),

    ...(isApplicative ? buildApplicativeLaws(given) : []),
  )
}

// Extra laws for alternatives that have an applicative instance.
const buildApplicativeLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<AlternativeTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {F, equalsFb, fa, ab, fabOf} = unfoldGiven(given),
    {coproduct, map} = F

  const Ap = F as unknown as AP.Applicative<F>,
    ap = SE.ap(Ap),
    of = Ap.of,
    fab = fabOf(of)

  return [
    Law(
      'right absorption',
      'ap(fab, ∅) = ∅',
      fab,
    )(fab => equalsFb(ap(fab, F.zero<A>()), F.zero<B>())),

    Law(
      'left distributivity',
      'coproduct(fa₁, fa₂) ▹ map(ab) =' +
        ' coproduct(map(fa₁, ab), map(fa₂, ab))',
      fa,
      fa,
      ab,
    )((fa1, fa2, ab) =>
      equalsFb(
        pipe(coproduct(fa1, fa2), map(ab)),
        coproduct(map(fa1, ab), map(fa2, ab)),
      ),
    ),

    Law(
      'right distributivity',
      'coproduct(fab₁, fab₂) ▹ ap(fa) =' +
        ' coproduct(ap(fab₁, fa), ap(fab₂, fa))',
      fa,
      fab,
      fab,
    )((fa, fab1, fab2) =>
      equalsFb(
        pipe(coproduct(fab1, fab2), ap(fa)),
        coproduct(ap(fab1, fa), ap(fab2, fa)),
      ),
    ),
  ]
}

/**
 * Type lambda for the `Alternative` typeclass.
 * @category type lambda
 */
export interface AlternativeTypeLambda extends TypeLambda {
  readonly type: AL.Alternative<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Alternative: AlternativeTypeLambda
  }
}
