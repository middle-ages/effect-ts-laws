import {
  Applicative as AP,
  Monad as MD,
  Monoid as MO,
  SemiApplicative as SA,
} from '@effect/typeclass'
import {Applicative as optionApplicative} from '@effect/typeclass/data/Option'
import {Equivalence as EQ, identity, pipe} from 'effect'
import {apply, compose} from 'effect/Function'
import {addLawSets, Law, lawTests} from '../../../law.js'
import {monoidLaws} from '../concrete/Monoid.js'
import {withOuterOption} from './compose.js'
import {covariantLaws} from './Covariant.js'
import {unfoldGiven} from './given.js'
import type {ParameterizedGiven as Given} from './given.js'
import type {Kind, TypeLambda} from 'effect/HKT'

/**
 * Typeclass laws for `Applicative`.
 * @category typeclass laws
 */
export const applicativeLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<ApplicativeTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {Monoid: monoid, F, fa, equalsA, getEquivalence} = unfoldGiven(given)

  return pipe(
    buildLaws('Applicative', given),
    pipe(given, covariantLaws, addLawSets),
    addLawSets(
      buildLaws(...withOuterOption('Applicative', given, optionApplicative)),
    ),
    pipe(
      {
        suffix: 'Applicative.getMonoid()',
        a: fa,
        F: AP.getMonoid(F)(monoid) as MO.Monoid<Kind<F, R, O, E, A>>,
        equalsA: getEquivalence(equalsA) as EQ.Equivalence<Kind<F, R, O, E, A>>,
      },
      monoidLaws,
      addLawSets,
    ),
  )
}

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
    )((a, ab) => {
      const left = pipe(ab, of, ap(of(a)))
      const right = pipe(a, ab, of)
      return equalsFb(left, right)
    }),

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

    // Some applicative do not have monads, for example when the
    // applicative is composed we have no monad for this slot.
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
