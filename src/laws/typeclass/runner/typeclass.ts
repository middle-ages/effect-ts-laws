import {Overrides} from '#law'
import {Array as AR, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Concrete, ConcreteClass} from '../concrete/catalog.js'
import {
  isParameterizedTypeclassName,
  Parameterized,
  ParameterizedClass,
} from '../parameterized/catalog.js'
import {Options as ParameterizedOptions} from '../parameterized/options.js'
import {testConcreteTypeclassLaws} from './concrete.js'
import {testParameterizedTypeclassLaws} from './parameterized.js'

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
 * @param options - The union of all options required for testing the instances
 * given in the `instances` argument. The specific options depend on the list
 * of instances being tested, but they are all either equalities, arbitraries,
 * or functions on the underlying types, that are required for testing the laws.
 * @param parameters - Optional runtime `fc-check` parameters.
 * @category harness
 */
export const testTypeclassLawsFor = <
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
  options: Omit<ParameterizedOptions<TypeLambda, F, A, B, C, R, O, E>, 'F'>,
  parameters?: Overrides,
) => {
  type ConcreteA = Kind<F, R, O, E, A>

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

  const {getEquivalence, equalsA, getArbitrary, a} = options

  if (Object.keys(concrete).length !== 0)
    testConcreteTypeclassLaws(
      concrete,
      {a: getArbitrary(a), equalsA: getEquivalence(equalsA)},
      parameters,
    )

  if (Object.keys(parameterized).length !== 0)
    testParameterizedTypeclassLaws<F, A, B, C>()(
      parameterized,
      options,
      parameters,
    )
}

/**
 * Some subset of all typeclass instances implemented for a single data
 * type. Can include both typeclasses for _parameterized_ and _concrete_
 * types.
 *
 * @category harness
 */
export type TypeclassInstances<
  F extends TypeLambda,
  A,
  R = never,
  O = unknown,
  E = unknown,
> = Partial<Concrete<Kind<F, R, O, E, A>> & Parameterized<F, R, O, E>>
