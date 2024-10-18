import {Array as AR, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {LawSet} from '../../law.js'
import {
  buildConcreteTypeclassLaws,
  Concrete,
  ConcreteClass,
} from './concrete/catalog.js'
import {GivenConcerns} from './parameterized/given.js'
import {
  buildParameterizedTypeclassLaws,
  isParameterizedTypeclassName,
  Parameterized,
  ParameterizedClass,
} from './parameterized/harness/catalog.js'

/**
 * Union of all typeclass names.
 *
 * @category model
 */
export type Typeclass = ParameterizedClass | ConcreteClass

/**
 * Some subset of all typeclass instances implemented for a single data
 * type. Can include both typeclasses for _parameterized_ and _concrete_
 * types.
 * @category harness
 */
export type TypeclassInstances<
  F extends TypeLambda,
  A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> = Partial<Concrete<Kind<F, In1, Out2, Out1, A>> & Parameterized<F>>

/**
 * Build typeclass laws for the given instances of some datatype.
 * @category harness
 */
export const buildTypeclassLawsFor = <
  F extends TypeLambda,
  Ins extends TypeclassInstances<F, A, In1, Out2, Out1>,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  instances: Ins,
  given: GivenConcerns<F, A, B, C, In1, Out2, Out1>,
): LawSet[] => {
  type ConcreteA = Kind<F, In1, Out2, Out1, A>

  type Entry = {
    [K in keyof Ins]: [K & Typeclass, Ins[K]]
  }[keyof Ins]

  const [concrete, parameterized] = pipe(
    Object.entries(instances) as Entry[],
    AR.partition(([typeclass]: Entry) =>
      isParameterizedTypeclassName(typeclass),
    ),
    TU.mapBoth({
      onFirst: entries =>
        Object.fromEntries(entries) as Partial<Concrete<ConcreteA>>,
      onSecond: entries => Object.fromEntries(entries),
    }),
  )

  const {getEquivalence, equalsA, getArbitrary, a} = given

  return [
    ...(Object.keys(concrete).length !== 0
      ? buildConcreteTypeclassLaws(concrete, {
          a: getArbitrary(a),
          equalsA: getEquivalence(equalsA),
        })
      : []),
    ...(Object.keys(parameterized).length !== 0
      ? buildParameterizedTypeclassLaws<F, A, B, C>()(parameterized, given)
      : []),
  ]
}
