import {Array as AR, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {ParameterOverrides} from '../../../law/lawList.js'
import {ConcreteInstances, ConcreteTypeclass} from '../concrete/catalog.js'
import {
  isParameterizedTypeclassName,
  ParameterizedInstances,
  ParameterizedOptions,
  ParameterizedTypeclass,
} from '../parameterized/catalog.js'
import {testConcreteTypeclassLaws} from './concrete.js'
import {testParameterizedTypeclassLaws} from './parameterized.js'

/** Union of all typeclass names. */
export type Typeclass = ParameterizedTypeclass | ConcreteTypeclass

/**
 * Test typeclass laws for the given instances of some data type.
 *
 * Call with no parameters but with the type lambda of your data type, and the
 * type parameters for your underlying types. You will get back a function that
 * takes two required and one optional arguments:
 *
 * 1. `instances` - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Monad: Option.Monad }` will run
 * the monad typeclass laws on `Option`.
 * 2. `options` - The union of all options required for testing the instances
 * given in the `instances` argument. The specific options depend on the list
 * of instances being tested, but they are all either equalities, arbitraries,
 * or functions on the underlying types, that are required for testing the laws.
 * 3. `parameters` - Optional run-time `fc-check` parameters.
 */
export const testTypeclassLawsFor =
  <F extends TypeLambda, A, B = A, C = A>() =>
  <
    Ins extends TypeclassInstances<F, A, In1, Out2, Out1>,
    In1 = never,
    Out2 = unknown,
    Out1 = unknown,
  >(
    instances: Ins,
  ) =>
  (
    options: ParameterizedOptions<Ins, F, A, B, C, In1, Out2, Out1>,
    parameters?: ParameterOverrides,
  ) => {
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
          Object.fromEntries(entries) as Partial<ConcreteInstances<ConcreteA>>,
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

export type TypeclassInstances<
  F extends TypeLambda,
  A,
  In1,
  Out2,
  Out1,
> = Partial<
  ConcreteInstances<Kind<F, In1, Out2, Out1, A>> &
    ParameterizedInstances<F, In1, Out2, Out1>
>
