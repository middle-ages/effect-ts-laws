import {Array as AR, pipe, Tuple as TU} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import {LawSet} from '../../law.js'
import type {Concrete, ConcreteClass} from './concrete/catalog.js'
import {buildConcreteTypeclassLaws} from './concrete/catalog.js'
import type {
  Parameterized,
  ParameterizedClass,
} from './parameterized/catalog.js'
import {
  buildParameterizedTypeclassLaws,
  isParameterizedTypeclassName,
} from './parameterized/catalog.js'
import type {GivenConcerns} from './parameterized/given.js'

/**
 * Union of all typeclass names.
 * @category model
 */
export type Typeclass = ParameterizedClass | ConcreteClass

/**
 * Some subset of all typeclass instances implemented for a single data
 * type. Can include both typeclasses for _parameterized_ and _concrete_
 * types.
 *
 * The keys in this object are the typeclass names, and the values are
 * the instances under test, where each value is the instance of the
 * typeclass for the corresponding key, and all are instances of their
 * typeclasses for the single data type under test.
 * @category harness
 */
export type TypeclassInstances<
  F extends TypeLambda,
  A,
  R = never,
  O = unknown,
  E = unknown,
> = Partial<Concrete<Kind<F, R, O, E, A>> & Parameterized<F>>

/**
 * Build typeclass laws for the given instances of some datatype.
 * Any instances of typeclasses with laws can be tested, concrete or
 * parameterized.
 * @category harness
 */
export const buildTypeclassLawsFor = <
  F extends TypeLambda,
  Ins extends TypeclassInstances<F, A, R, O, E>,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  instances: Ins,
  given: GivenConcerns<F, A, B, C, R, O, E>,
): LawSet[] => {
  type ConcreteA = Kind<F, R, O, E, A>

  type Entry = {
    [K in keyof Ins]: [K & Typeclass, Ins[K]]
  }[keyof Ins]

  const [concrete, parameterized] = pipe(
    Object.entries(instances) as Entry[],
    AR.partition(([typeclass]) => isParameterizedTypeclassName(typeclass)),
    TU.mapBoth({
      onFirst: entries =>
        Object.fromEntries(entries) as Partial<Concrete<ConcreteA>>,
      onSecond: entries => Object.fromEntries(entries),
    }),
  )

  const {getEquivalence, equalsA, getArbitrary, a} = given

  return [
    ...(Object.keys(concrete).length > 0
      ? buildConcreteTypeclassLaws(concrete, {
          a: getArbitrary(a),
          equalsA: getEquivalence(equalsA),
        })
      : []),
    ...(Object.keys(parameterized).length > 0
      ? buildParameterizedTypeclassLaws<F, A, B, C>()(parameterized, given)
      : []),
  ]
}
