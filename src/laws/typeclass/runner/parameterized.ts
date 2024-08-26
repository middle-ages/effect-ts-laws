import {pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {LawList, ParameterOverrides, verboseLaws} from '../../../law.js'
import {
  ParameterizedInstances,
  parameterizedLawsFor,
  ParameterizedOptions,
  ParameterizedTypeclass,
} from '../parameterized/catalog.js'
import {ParameterizedMap} from '../parameterized/options.js'

/** Run a single instance through the given typeclass laws. */
export const testParameterizedTypeclassLaw =
  <Typeclass extends ParameterizedTypeclass>(typeclass: Typeclass) =>
  <
    F extends TypeLambda,
    A,
    B = A,
    C = A,
    In1 = never,
    Out2 = unknown,
    Out1 = unknown,
  >(
    options: ParameterizedMap<
      F,
      A,
      B,
      C,
      In1,
      Out2,
      Out1
    >[Typeclass]['options'],
    parameters?: ParameterOverrides,
  ) => {
    type ArgLists =
      ParameterizedMap<
        F,
        number,
        string,
        boolean
      >[Typeclass]['laws'] extends LawList<infer Args>
        ? Args
        : never

    verboseLaws(
      pipe(options, parameterizedLawsFor(typeclass)) as LawList<ArgLists>,
      parameters,
    )
  }

/**
 * Test [parameterized type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclass laws for the given instances of some data type.
 *
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Monad: Option.Monad }` will run
 * the monad typeclass laws on `Option`.
 * @param options - The union of all options required for testing the instances
 * given in the `instances` argument. The specific options depend on the list
 * of instances being tested, but they are all either equalities, arbitraries,
 * or functions on the underlying types, that are required for testing the laws.
 * @param parameters - Optional run-time `fc-check` parameters.
 */
export const testParameterizedTypeclassLaws =
  <F extends TypeLambda, A, B = A, C = A>() =>
  <
    Ins extends Partial<ParameterizedInstances<F, In1, Out2, Out1>>,
    In1 = never,
    Out2 = unknown,
    Out1 = unknown,
  >(
    instances: Ins,
    options: ParameterizedOptions<Ins, F, A, B, C, In1, Out2, Out1>,
    parameters?: ParameterOverrides,
  ) => {
    for (const typeclass of Object.keys(
      instances,
    ) as ParameterizedTypeclass[]) {
      type Typeclass = typeof typeclass
      const instance: ParameterizedInstances<F>[Typeclass] | undefined =
        instances[typeclass]

      /* v8 ignore next 1 */
      if (instance === undefined) return

      testParameterizedTypeclassLaw(typeclass)(
        {...options, F: instance} as never,
        parameters,
      )
    }
  }
