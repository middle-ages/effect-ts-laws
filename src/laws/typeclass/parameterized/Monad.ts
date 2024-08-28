import {unary, unaryToKind} from '#arbitrary'
import {Law, LawSet, liftEquivalences} from '#law'
import {Monad as MD} from '@effect/typeclass'
import {flow, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {Covariant} from './Covariant.js'
import {Options} from './options.js'

/**
 * Test typeclass laws for `Monad`.
 * @category typeclass laws
 */
export const Monad = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  options: Options<MonadTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {a, b, c, F, equalsA, equalsB, equalsC, getEquivalence, getArbitrary} =
    options

  const fa = getArbitrary(a),
    [equalsFa, equalsFb, equalsFc] = liftEquivalences(getEquivalence)(
      equalsA,
      equalsB,
      equalsC,
    ),
    ab = unary<A>()(b),
    [faB, fbC] = [
      pipe(b, unaryToKind<A>()(getArbitrary)),
      pipe(c, unaryToKind<B>()(getArbitrary)),
    ]

  return LawSet(Covariant(options))(
    'Monad',
    Law(
      'leftIdentity',
      'of ∘ flatMap(f) = f',
      a,
      faB,
    )((a, faB) => equalsFb(pipe(a, F.of, F.flatMap(faB)), faB(a))),

    Law(
      'rightIdentity',
      'flatMap(of) = id',
      fa,
    )(fa => equalsFa(pipe(fa, F.flatMap(F.of)), fa)),

    Law(
      'associativity',
      'flatMap(f₁) ∘ flatMap(f₂) = flatMap(f₁ ∘ flatMap(f₂))',
      fa,
      faB,
      fbC,
    )((fa, faB, fbC) =>
      equalsFc(
        pipe(fa, F.flatMap(faB), F.flatMap(fbC)),
        pipe(fa, F.flatMap(flow(faB, F.flatMap(fbC)))),
      ),
    ),

    Law(
      'mapConsistency',
      'map(ab) = flatMap(ab ∘ of)',
      fa,
      ab,
    )((fa, ab) =>
      equalsFb(pipe(fa, F.map(ab)), pipe(fa, F.flatMap(flow(ab, F.of)))),
    ),
  )
}

/**
 * Type lambda for the `Monad` typeclass.
 * @category type lambda
 */
export interface MonadTypeLambda extends TypeLambda {
  readonly type: MD.Monad<this['Target'] & TypeLambda>
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, R, O, E> {
    Monad: {
      lambda: MonadTypeLambda
      options: Options<MonadTypeLambda, F, A, B, C, R, O, E>
      laws: ReturnType<typeof Monad<F, A, B, C, R, O, E>>
    }
  }
}
