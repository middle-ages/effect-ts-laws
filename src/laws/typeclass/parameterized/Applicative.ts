import {option, unary} from '#arbitrary'
import {addLawSet, Law, lawTests, liftEquivalences} from '#law'
import {Applicative as AP, SemiApplicative as SA} from '@effect/typeclass'
import {Applicative as optionApplicative} from '@effect/typeclass/data/Option'
import {identity, Option as OP, pipe} from 'effect'
import {apply, flow} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import {Covariant} from './Covariant.js'
import {liftOptions, Options} from './options.js'

/**
 * Test typeclass laws for `Applicative`.
 * @category typeclass laws
 */
export const Applicative = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  options: Options<ApplicativeTypeLambda, F, A, B, C, R, O, E>,
) => {
  const composition = buildLaws(
    ...liftOptions<ApplicativeTypeLambda, F, OptionTypeLambda>()(
      'Applicative',
      'Option<F>',
    )<typeof options, A, B, C, R, O, E>(
      options,
      optionApplicative,
      OP.getEquivalence,
      option,
    ),
  )

  return pipe(
    buildLaws('Applicative', options),
    addLawSet(Covariant(options)),
    addLawSet(composition),
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
  options: Options<ApplicativeTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {F, equalsA, equalsB, equalsC, getEquivalence, getArbitrary, a, b, c} =
    options
  const fa = getArbitrary(a),
    [equalsFa, equalsFb, equalsFc] = liftEquivalences(getEquivalence)(
      equalsA,
      equalsB,
      equalsC,
    ),
    [ab, bc] = [unary<A>()(b), unary<B>()(c)],
    [fab, fbc] = [ab.map(F.of), bc.map(F.of)],
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
      'fab ▹ of ▹ (a ▹ of ▹ ap) = a ▹ fab ▹ of',
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
      const compose = (bc: (b: B) => C) => (ab: (a: A) => B) => flow(ab, bc)

      const left = pipe(fbc, map(compose), ap(fab), ap(fa))
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
      'mapConsistency',
      'fa ▹ map(ab) = ab ▹ of ▹ ap(fa)',
      fa,
      ab,
    )((fa, ab) => equalsFb(pipe(fa, map(ab)), pipe(ab, F.of, ap(fa)))),

    Law(
      'productConsistency',
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
  )
}

/**
 * Type lambda for the applicative type class.
 * @category type lambda
 */
export interface ApplicativeTypeLambda extends TypeLambda {
  readonly type: AP.Applicative<this['Target'] & TypeLambda>
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, R, O, E> {
    Applicative: {
      lambda: ApplicativeTypeLambda
      options: Options<ApplicativeTypeLambda, F, A, B, C, R, O, E>
      laws: ReturnType<typeof Applicative<F, A, B, C, R, O, E>>
    }
  }
}
