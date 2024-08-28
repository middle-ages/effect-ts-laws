import {Applicative as AP, SemiApplicative as SA} from '@effect/typeclass'
import {Equivalence as EQ, flow, identity, pipe} from 'effect'
import {apply} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import {unaryFunction} from '../../../arbitraries/function.js'
import {liftEquivalences} from '../../../law/equivalence.js'
import {lawTests} from '../../../law/lawList.js'
import {lawTest} from '../../../law/lawTest.js'
import {CommonOptions} from './options.js'

/**
 * Test Applicative laws.
 *
 * @category Test Typeclass Laws
 */
export const Applicative = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>({
  F,
  equalsA,
  equalsB,
  equalsC,
  getEquivalence,
  getArbitrary,
  a,
  b,
  c,
}: ApplicativeOptions<F, A, B, C, In1, Out2, Out1>) => {
  type Data<T> = Kind<F, In1, Out2, Out1, T>
  const fa = getArbitrary(a),
    [equalsFa, equalsFb, equalsFc] = liftEquivalences(getEquivalence)(
      equalsA,
      equalsB,
      equalsC,
    ),
    [ab, bc] = [unaryFunction<A>()(b), unaryFunction<B>()(c)],
    [fab, fbc] = [ab.map(F.of), bc.map(F.of)],
    [ap, of, map] = [SA.ap(F), F.of, F.map]

  return lawTests(
    [
      lawTest(
        'identity',
        (a: Data<A>) => equalsFa(pipe(identity<A>, of, ap(a)), a),
        'id ▹ of ▹ ap(a) = a',
      )([fa]),

      lawTest(
        'homomorphism',
        (a: A, fab: (a: A) => B) =>
          equalsFb(pipe(fab, of, ap(of(a))), pipe(a, fab, of)),
        'fap ▹ of ▹ (a ▹ of ▹ ap) = a ▹ fab ▹ of',
      )([a, ab]),

      lawTest(
        'associative composition',
        (fa: Data<A>, Fab: Data<(a: A) => B>, Fbc: Data<(a: B) => C>) => {
          const compose: (
            bc: (b: B) => C,
          ) => (ab: (a: A) => B) => (a: A) => C = bc => ab => flow(ab, bc)

          return equalsFc(
            pipe(Fbc, map(compose), ap(Fab), ap(fa)),
            pipe(Fbc, ap(pipe(Fab, ap(fa)))),
          )
        },
        'Fbc ▹ map(compose) ▹ ap(Fab) ▹ ap(fa) = Fbc ▹ ap(Fab ▹ ap(Fa))',
      )([fa, fab, fbc]),

      lawTest(
        'interchange',
        (a: A, fab: Data<(a: A) => B>) => {
          type AB = (ab: (a: A) => B) => B
          return equalsFb(pipe(fab, ap(of(a))), pipe(a, apply, of<AB>, ap(fab)))
        },
        'Fab ▹ ap(of(a)) = a ▹ apply ▹ of ▹ ap(Fab)',
      )([a, fab]),

      lawTest(
        'map',
        (fa: Data<A>, ab: (a: A) => B) =>
          equalsFb(pipe(fa, map(ab)), pipe(ab, F.of, ap(fa))),
        'fa ▹ map(ab) = ab ▹ of ▹ ap(fa)',
      )([fa, ab]),
    ],
    'Applicative',
  )
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, In1, Out2, Out1> {
    Applicative: {
      lambda: ApplicativeTypeLambda
      options: CommonOptions<ApplicativeTypeLambda, F, A, B, C, In1, Out2, Out1>
      laws: ReturnType<typeof Applicative<F, A, B, C, In1, Out2, Out1>>
    }
  }
}
export interface ApplicativeTypeLambda extends TypeLambda {
  readonly type: AP.Applicative<this['Target'] & TypeLambda>
}

export interface ApplicativeOptions<
  F extends TypeLambda,
  A,
  B,
  C,
  In1,
  Out2,
  Out1,
> extends CommonOptions<ApplicativeTypeLambda, F, A, B, C, In1, Out2, Out1> {
  equalsB: EQ.Equivalence<B>
}
