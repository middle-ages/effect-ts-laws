import {Invariant as IN} from '@effect/typeclass'
import {flow, identity, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {unaryFunction} from '../../../arbitraries.js'
import {lawTest, lawTests} from '../../../law.js'
import {CommonOptions} from './options.js'

export const Invariant = <F extends TypeLambda, A, B, C, In1, Out2, Out1>({
  a,
  b,
  c,
  F,
  equalsA,
  equalsC,
  getEquivalence,
  getArbitrary,
}: CommonOptions<InvariantTypeLambda, F, A, B, C, In1, Out2, Out1>) => {
  type Data = Kind<F, In1, Out2, Out1, A>
  const fa = getArbitrary(a),
    [equalsFa, equalsFc] = [getEquivalence(equalsA), getEquivalence(equalsC)],
    [fab, fbc, fba, fcb] = [
      unaryFunction(b)<A>(),
      unaryFunction(c)<B>(),
      unaryFunction(a)<B>(),
      unaryFunction(b)<C>(),
    ]

  return lawTests(
    [
      lawTest(
        'identity',
        (a: Data) => equalsFa(F.imap(a, identity, identity), a),
        'imap(id, id) = id',
      )([fa]),

      lawTest(
        'composition',
        (
          a: Data,
          fab: (a: A) => B,
          fbc: (b: B) => C,
          fba: (b: B) => A,
          fcb: (c: C) => B,
        ) =>
          equalsFc(
            pipe(a, F.imap(fab, fba), F.imap(fbc, fcb)),
            pipe(a, F.imap(flow(fab, fbc), flow(fcb, fba))),
          ),
        'a ▹ imap(f₁, f₂) ▹ imap(g₁, g₂) = a ▹ imap(f₁ ∘ g₁, g₂ ∘  f₂)',
      )([fa, fab, fbc, fba, fcb]),
    ],
    'Invariant',
  )
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, In1, Out2, Out1> {
    Invariant: {
      lambda: InvariantTypeLambda
      options: CommonOptions<InvariantTypeLambda, F, A, B, C, In1, Out2, Out1>
      laws: ReturnType<typeof Invariant<F, A, B, C, In1, Out2, Out1>>
    }
  }
}

export interface InvariantTypeLambda extends TypeLambda {
  readonly type: IN.Invariant<this['Target'] & TypeLambda>
}
