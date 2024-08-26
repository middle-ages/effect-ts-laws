import {Covariant as CO} from '@effect/typeclass'
import {flow, identity, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {unaryFunction} from '../../../arbitraries.js'
import {lawTest, lawTests} from '../../../law.js'
import {CommonOptions} from './options.js'

export const Covariant = <
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
  equalsC,
  getEquivalence,
  getArbitrary,
  a,
  b,
  c,
}: CommonOptions<CovariantTypeLambda, F, A, B, C, In1, Out2, Out1>) => {
  type Data = Kind<F, In1, Out2, Out1, A>
  const fa = getArbitrary(a),
    [equalsFa, equalsFc] = [getEquivalence(equalsA), getEquivalence(equalsC)],
    [arbitraryFab, arbitraryFbc] = [
      unaryFunction(b)<A>(),
      unaryFunction(c)<B>(),
    ]

  return lawTests(
    [
      lawTest(
        'identity',
        (a: Data) => equalsFa(F.map(a, identity), a),
        'map(id) = id',
      )([fa]),

      lawTest(
        'composition',
        (a: Data, fab: (a: A) => B, fbc: (a: B) => C) =>
          equalsFc(F.map(a, flow(fab, fbc)), pipe(a, F.map(fab), F.map(fbc))),
        'map(f₁ ∘ f₂) = map(f₁) ∘ map(f₂)',
      )([fa, arbitraryFab, arbitraryFbc]),
    ],
    'Covariant',
  )
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, In1, Out2, Out1> {
    Covariant: {
      lambda: CovariantTypeLambda
      options: CommonOptions<CovariantTypeLambda, F, A, B, C, In1, Out2, Out1>
      laws: ReturnType<typeof Covariant<F, A, B, C, In1, Out2, Out1>>
    }
  }
}

export interface CovariantTypeLambda extends TypeLambda {
  readonly type: CO.Covariant<this['Target'] & TypeLambda>
}
