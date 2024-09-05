import {Monad as MD} from '@effect/typeclass'
import {flow, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {Law, LawSet} from '../../../law.js'
import {Covariant} from './Covariant.js'
import {ParameterizedGiven as Given, unfoldGiven} from './given.js'

/**
 * Test typeclass laws for `Monad`.
 * @category typeclass laws
 */
export const Monad = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<MonadTypeLambda, F, A, B, C, In1, Out2, Out1>,
) => {
  const {a, F, fa, equalsFa, equalsFb, equalsFc, ab, afb, bfc} =
    unfoldGiven(given)

  return LawSet(Covariant(given))(
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
      bfc,
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

//ap(fa)(fab) == bind(fab)(map(fa)(_))

/**
 * Type lambda for the `Monad` typeclass.
 * @category type lambda
 */
export interface MonadTypeLambda extends TypeLambda {
  readonly type: MD.Monad<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, In1, Out2, Out1> {
    Monad: {
      lambda: MonadTypeLambda
      options: Given<MonadTypeLambda, F, A, B, C, In1, Out2, Out1>
      laws: ReturnType<typeof Monad<F, A, B, C, In1, Out2, Out1>>
    }
  }
}
