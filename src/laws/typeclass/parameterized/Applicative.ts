import {
  Applicative as AP,
  Monad as MD,
  Monoid as MO,
  SemiApplicative as SA,
} from '@effect/typeclass'
import {Applicative as optionApplicative} from '@effect/typeclass/data/Option'
import {Equivalence as EQ, identity, pipe} from 'effect'
import {apply, compose} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import {addLawSet, Law, lawTests} from '../../../law.js'
import {monoidLaws} from '../concrete/Monoid.js'
import {covariantLaws} from './Covariant.js'
import {withOuterOption} from './harness/compose.js'
import {ParameterizedGiven as Given, unfoldGiven} from './harness/given.js'

/**
 * Test typeclass laws for `Applicative`.
 * @category typeclass laws
 */
export const applicativeLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<ApplicativeTypeLambda, F, A, B, C, In1, Out2, Out1>,
) => {
  const {Monoid: monoid, F, fa, equalsA, getEquivalence} = unfoldGiven(given)

  // If A is a monoid we can test Monoid laws on the applicative getMonoid()
  const addMonoidLaws =
    monoid !== undefined
      ? pipe(
          {
            suffix: 'Applicative.getMonoid()',
            a: fa,
            F: AP.getMonoid(F)(monoid) as MO.Monoid<
              Kind<F, In1, Out2, Out1, A>
            >,
            equalsA: getEquivalence(equalsA) as EQ.Equivalence<
              Kind<F, In1, Out2, Out1, A>
            >,
          },
          monoidLaws,
          addLawSet,
        )
      : identity

  return pipe(
    buildLaws('Applicative', given),
    pipe(given, covariantLaws, addLawSet),
    addMonoidLaws,
    addLawSet(
      buildLaws(...withOuterOption('Applicative', given, optionApplicative)),
    ),
  )
}

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
  given: Given<ApplicativeTypeLambda, F, A, B, C, In1, Out2, Out1>,
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
 * Type lambda for the `Applicative` type class.
 * @category type lambda
 */
export interface ApplicativeTypeLambda extends TypeLambda {
  readonly type: AP.Applicative<this['Target'] & TypeLambda>
}

declare module './harness/given.js' {
  interface ParameterizedLambdas {
    Applicative: ApplicativeTypeLambda
  }
}
