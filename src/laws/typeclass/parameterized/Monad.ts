import {Monad as MD} from '@effect/typeclass'
import {Equivalence as EQ, flow, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {unaryFunction, unaryKleisli} from '../../../arbitraries/function.js'
import {liftEquivalences} from '../../../law/equivalence.js'
import {lawTests} from '../../../law/lawList.js'
import {lawTest} from '../../../law/lawTest.js'
import {CommonOptions} from './options.js'

/**
 * Test Monad laws.
 *
 * @category Test Typeclass Laws
 */
export const Monad = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>({
  a,
  b,
  c,
  F,
  equalsA,
  equalsB,
  equalsC,
  getEquivalence,
  getArbitrary,
}: MonadOptions<F, A, B, C, In1, Out2, Out1>) => {
  type Data<T> = Kind<F, In1, Out2, Out1, T>

  const fa = getArbitrary(a),
    [equalsFa, equalsFb, equalsFc] = liftEquivalences(getEquivalence)(
      equalsA,
      equalsB,
      equalsC,
    ),
    ab = unaryFunction<A>()(b),
    [faB, fbC] = [
      pipe(b, unaryKleisli<A>()(getArbitrary)),
      pipe(c, unaryKleisli<B>()(getArbitrary)),
    ]

  return lawTests(
    [
      lawTest(
        'leftIdentity',
        (a: A, faB: (a: A) => Data<B>) =>
          equalsFb(pipe(a, F.of, F.flatMap(faB)), faB(a)),
        'of ∘ flatMap(f) = f',
      )([a, faB]),

      lawTest(
        'rightIdentity',
        (fa: Data<A>) => equalsFa(pipe(fa, F.flatMap(F.of)), fa),
        'flatMap(of) = id',
      )([fa]),

      lawTest(
        'associativity',
        (fa: Data<A>, faB: (a: A) => Data<B>, fbC: (b: B) => Data<C>) =>
          equalsFc(
            pipe(fa, F.flatMap(faB), F.flatMap(fbC)),
            pipe(fa, F.flatMap(flow(faB, F.flatMap(fbC)))),
          ),
        'flatMap(f₁) ∘ flatMap(f₂) = flatMap(f₁ ∘ flatMap(f₂))',
      )([fa, faB, fbC]),

      lawTest(
        'map',
        (fa: Data<A>, ab: (a: A) => B) =>
          equalsFb(pipe(fa, F.map(ab)), pipe(fa, F.flatMap(flow(ab, F.of)))),
        'map(ab) = flatMap(ab ∘ of)',
      )([fa, ab]),
    ],
    'Monad',
  )
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, In1, Out2, Out1> {
    Monad: {
      lambda: MonadTypeLambda
      options: MonadOptions<F, A, B, C, In1, Out2, Out1>
      laws: ReturnType<typeof Monad<F, A, B, C, In1, Out2, Out1>>
    }
  }
}

export interface MonadTypeLambda extends TypeLambda {
  readonly type: MD.Monad<this['Target'] & TypeLambda>
}

export interface MonadOptions<F extends TypeLambda, A, B, C, In1, Out2, Out1>
  extends CommonOptions<MonadTypeLambda, F, A, B, C, In1, Out2, Out1> {
  equalsB: EQ.Equivalence<B>
}
