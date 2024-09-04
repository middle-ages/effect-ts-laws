import {Monad as MD} from '@effect/typeclass'
import {flow, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {unary, unaryToKind} from '../../../arbitrary.js'
import {Law, LawSet, liftEquivalences} from '../../../law.js'
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
    [afb, afc] = [
      pipe(b, unaryToKind<A>()(getArbitrary)),
      pipe(c, unaryToKind<B>()(getArbitrary)),
    ]

  return LawSet(Covariant(options))(
    'Monad',
    Law(
      'leftIdentity',
      'of ∘ flatMap(afb) = afb',
      a,
      afb,
    )((a, afb) => equalsFb(pipe(a, F.of, F.flatMap(afb)), afb(a))),

    Law(
      'rightIdentity',
      'flatMap(of) = id',
      fa,
    )(fa => equalsFa(pipe(fa, F.flatMap(F.of)), fa)),

    Law(
      'associativity',
      'flatMap(afb) ∘ flatMap(bfc) = flatMap(afb ∘ flatMap(bfc))',
      fa,
      afb,
      afc,
    )((fa, afb, bfc) =>
      equalsFc(
        pipe(fa, F.flatMap(afb), F.flatMap(bfc)),
        pipe(fa, F.flatMap(flow(afb, F.flatMap(bfc)))),
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
