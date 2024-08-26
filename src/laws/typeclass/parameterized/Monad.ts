import {Monad as MD} from '@effect/typeclass'
import {Equivalence as EQ, flow, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {unaryFunction} from '../../../arbitraries.js'
import {lawTest, lawTests} from '../../../law.js'
import {CommonOptions} from './options.js'

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

  const [fa, equalsFa, equalsFb, equalsFc] = [
      getArbitrary(a),
      getEquivalence(equalsA),
      getEquivalence(equalsB),
      getEquivalence(equalsC),
    ],
    [faB, fbC]: [
      fc.Arbitrary<(a: A) => Data<B>>,
      fc.Arbitrary<(b: B) => Data<C>>,
    ] = [
      pipe(b, getArbitrary, unaryFunction)<A>(),
      pipe(c, getArbitrary, unaryFunction)<B>(),
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
