import {option, unary} from '#arbitrary'
import {addLawSet, Law, lawTests, liftEquivalences} from '#law'
import {Covariant as CO} from '@effect/typeclass'
import {Covariant as optionCovariant} from '@effect/typeclass/data/Option'
import {flow, identity, Option as OP, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import {Invariant} from './Invariant.js'
import {liftOptions, Options} from './options.js'

/**
 * Test typeclass laws for `Covariant` and its requirements: `Invariant`.
 * @category typeclass laws
 */
export const Covariant = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  options: Options<CovariantTypeLambda, F, A, B, C, R, O, E>,
) => {
  const composition = buildLaws(
    ...liftOptions<CovariantTypeLambda, F, OptionTypeLambda>()(
      'Covariant',
      'Option<F>',
    )<typeof options, A, B, C, R, O, E>(
      options,
      optionCovariant,
      OP.getEquivalence,
      option,
    ),
  )

  return pipe(
    buildLaws('Covariant', options),
    pipe(options, Invariant, addLawSet),
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
  options: Options<CovariantTypeLambda, F, A, B, C, R, O, E>,
) => {
  const {F, equalsA, equalsC, getEquivalence, getArbitrary, a, b, c} = options
  const fa = getArbitrary(a),
    [equalsFa, equalsFc] = liftEquivalences(getEquivalence)(equalsA, equalsC),
    [ab, bc] = [unary<A>()(b), unary<B>()(c)]

  return lawTests(
    name,
    Law('identity', 'map(id) = id', fa)(a => equalsFa(F.map(a, identity), a)),
    Law(
      'composition',
      'map(f₁ ∘ f₂) = map(f₁) ∘ map(f₂)',
      fa,
      ab,
      bc,
    )((a, ab, bc) =>
      equalsFc(F.map(a, flow(ab, bc)), pipe(a, F.map(ab), F.map(bc))),
    ),
  )
}

/**
 * Type lambda for the `Covariant` typeclass.
 * @category type lambda
 */
export interface CovariantTypeLambda extends TypeLambda {
  readonly type: CO.Covariant<this['Target'] & TypeLambda>
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, R, O, E> {
    Covariant: {
      lambda: CovariantTypeLambda
      options: Options<CovariantTypeLambda, F, A, B, C, R, O, E>
      laws: ReturnType<typeof Covariant<F, A, B, C, R, O, E>>
    }
  }
}
