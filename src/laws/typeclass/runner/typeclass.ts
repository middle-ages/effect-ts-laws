import {LawSet, Overrides, testLaws} from '#law'
import {Array as AR, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {ConcreteClass} from '../concrete/catalog.js'
import {
  isParameterizedTypeclassName,
  Parameterized,
  ParameterizedClass,
} from '../parameterized/catalog.js'
import {GivenConcerns} from '../parameterized/given.js'
import {buildConcreteTypeclassLaws, Concrete} from './concrete.js'
import {buildParameterizedTypeclassLaws} from './parameterized.js'

/**
 * Union of all typeclass names.
 *
 * @category model
 */
export type Typeclass = ParameterizedClass | ConcreteClass

/**
 * Test typeclass laws for the given instances of some datatype.
 *
 * Call with no parameters but with the type lambda of your datatype, and the
 * type parameters for your underlying types. You will get back a function that
 * takes two required and one optional arguments:
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Monad: Option.Monad }` will run
 * the monad typeclass laws on `Option`.
 * @param given - The union of all options required for testing the instances
 * given in the `instances` argument. The specific options depend on the list
 * of instances being tested, but they are all either equalities, arbitraries,
 * or functions on the underlying types, that are required for testing the laws.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category harness
 */
export const testTypeclassLawsFor = <
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
  parameters?: Overrides,
) => {
  for (const lawSet of buildTypeclassLawsFor<F, Ins, A, B, C, In1, Out2, Out1>(
    instances,
    given,
  )) {
    testLaws(lawSet, parameters)
  }
}

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
