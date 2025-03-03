import {
  Applicative as AP,
  Monad as MD,
  SemiApplicative as SA,
} from '@effect/typeclass'
import {Applicative as optionApplicative} from '@effect/typeclass/data/Option'
import {identity, pipe} from 'effect'
import {apply, compose} from 'effect/Function'
import type {TypeLambda} from 'effect/HKT'
import {addLawSets, Law, lawTests} from '../../../law.js'
import {monoidLaws} from '../concrete/Monoid.js'
import {withOuterOption} from './compose.js'
import {covariantLaws} from './Covariant.js'
import type {BuildParameterized, ParameterizedGiven as Given} from './given.js'
import {unfoldGiven} from './given.js'
import {BuildInternal} from './internal.js'

/**
 * Typeclass laws for `Applicative`.
 * @category typeclass laws
 */
export const applicativeLaws: BuildParameterized<ApplicativeTypeLambda> = <
  F1 extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<ApplicativeTypeLambda, F1, A, B, C, R, O, E>,
  suffix?: string,
) => {
  const {Monoid: monoid, F, fa, equalsA, getEquivalence} = unfoldGiven(given)

  return pipe(
    buildLaws(`Alternative${suffix ?? ''}`, given),
    pipe(given, covariantLaws, addLawSets),
    addLawSets(
      buildLaws(...withOuterOption('Applicative', given, optionApplicative)),
    ),
    pipe(
      {
        suffix: 'Applicative.getMonoid()',
        a: fa,
        F: pipe(monoid, AP.getMonoid(F)<A, R, O, E>),
        equalsA: getEquivalence(equalsA),
      },
      monoidLaws,
      addLawSets,
    ),
  )
}

const buildLaws: BuildInternal<ApplicativeTypeLambda> = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  name: string,
  given: Given<ApplicativeTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {F, a, fa, equalsFa, equalsFb, equalsFc, ab, fabOf, fbcOf} =
    unfoldGiven(given)

  const [fab, fbc] = [fabOf(F.of), fbcOf(F.of)],
    [ap, of, map] = [SA.ap(F), F.of, F.map]

  return lawTests(
    name,
    Law(
      'identity',
      'id ▹ of ▹ ap(a) = a',
      fa,
    )(a => equalsFa(pipe(identity<A>, of, ap(a)), a)),

    Law(
      'homomorphism',
      'ab ▹ of ▹ (a ▹ of ▹ ap) = a ▹ ab ▹ of',
      a,
      ab,
    )((a, ab) => equalsFb(pipe(ab, of, ap(of(a))), pipe(a, ab, of))),

    Law(
      'associative composition',
      'fbc ▹ map(compose) ▹ ap(fab) ▹ ap(fa) = fbc ▹ ap(fab ▹ ap(fa))',
      fa,
      fab,
      fbc,
    )((fa, fab, fbc) => {
      const left = pipe(
        fbc,
        map(bc => compose(bc)<A>),
        ap(fab),
        ap(fa),
      )
      const right = pipe(fbc, ap(pipe(fab, ap(fa))))

      return equalsFc(left, right)
    }),

    Law(
      'interchange',
      'fab ▹ ap(of(a)) = a ▹ apply ▹ of ▹ ap(Fab)',
      a,
      fab,
    )((a, fab) => {
      type AB = (ab: (a: A) => B) => B
      return equalsFb(pipe(fab, ap(of(a))), pipe(a, apply, of<AB>, ap(fab)))
    }),

    Law(
      'map consistency',
      'fa ▹ map(ab) = ab ▹ of ▹ ap(fa)',
      fa,
      ab,
    )((fa, ab) => equalsFb(pipe(fa, map(ab)), pipe(ab, F.of, ap(fa)))),

    Law(
      'product consistency',
      'fab ▹ ap(fa) = product(fab, fa) ▹ map(([ab, a]) ⇒ ab(a))',
      fa,
      fab,
    )((fa, fab) =>
      equalsFb(
        pipe(fab, ap(fa)),
        pipe(
          F.product(fab, fa),
          map(([f, a]) => f(a)),
        ),
      ),
    ),

    // Some applicatives do not have monads. For example: when the applicative is
    // composed we have no monad for this law.
    ...('flatMap' in F
      ? [
          Law(
            'flatMap consistency',
            'fab ▹ ap(fa) = fab ▹ flatMap(ab ⇒ map(fa, ab))',
            fa,
            fab,
          )((fa, fab) => {
            const flatMap = F.flatMap as MD.Monad<F>['flatMap']
            return equalsFb(
              ap(fab, fa),
              pipe(
                fab,
                flatMap(ab => map(fa, ab)),
              ),
            )
          }),
        ]
      : []),
  )
}

/**
 * Type lambda for the `Applicative` typeclass.
 * @category type lambda
 */
export interface ApplicativeTypeLambda extends TypeLambda {
  readonly type: AP.Applicative<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Applicative: ApplicativeTypeLambda
  }
}
