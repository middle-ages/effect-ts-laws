import type {ParameterOverrides} from '#law'
import type {
  Mono,
  MonomorphicGiven,
  MonomorphicGivenOf,
  TypeclassInstances,
} from '#laws'
import {
  buildMonomorphicLaws,
  monoArbitrary,
  monoEquivalence,
  monoMonoid,
} from '#laws'
import {pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {
  MonoProps,
  propsArbitrary,
  propsEquivalence,
  propsMonoid,
} from '../laws/typeclass/monomorphic/props.js'
import {verboseLawSets} from './testLaws.js'

/**
 * Test typeclass laws on the given instances of some datatype `F`.  All laws are
 * monomorphic on an underlying type `A`.
 * @param given - Test options for the datatype under test.
 * @category vitest
 */
export const testTypeclassLawsFor =
  <F extends TypeLambda, A, R = never, O = unknown, E = unknown>(
    given: MonomorphicGivenOf<F, A, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, A, R, O, E>>(
    /**
     * Instances to test. Key is typeclass name and value is the instance under
     * test. For example, `{ Monad: Option.Monad }` will run the monad typeclass
     * laws on `Option`.
     */
    instances: Ins,
    /** Optional runtime `fast-check` parameters. */
    parameters?: ParameterOverrides,
  ): void => {
    pipe(
      instances,
      buildMonomorphicLaws(given),
      verboseLawSets.withParameters(parameters),
    )
  }

/**
 * Test typeclass laws on the given instances of some datatype `F`. All laws are
 * monomorphic on an underlying type of `Option<number@.`.
 * At the property `testTypeclassLaws.underlyingProps` you will find the same
 * function, except it uses the underlying type `{x: number; y: string}, useful
 * when testing laws on React components, as they can only accept a single
 * object argument.
 * @param given - Test options for the datatype under test.
 * @category vitest
 */
export const testTypeclassLaws =
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    given: MonomorphicGiven<F, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, Mono, R, O, E>>(
    /**
     * Instances to test. Key is typeclass name and value is the instance under
     * test. For example, `{ Monad: Option.Monad }` will run the monad typeclass
     * laws on `Option`.
     */
    instances: Ins,
    /** Optional runtime `fast-check` parameters. */
    parameters?: ParameterOverrides,
  ) => {
    testTypeclassLawsFor({
      ...given,
      a: monoArbitrary,
      equalsA: monoEquivalence,
      Monoid: monoMonoid,
    })(instances, parameters)
  }

const underlyingProps =
  <F extends TypeLambda, R = never, O = unknown, E = unknown>(
    given: MonomorphicGiven<F, R, O, E>,
  ) =>
  <Ins extends TypeclassInstances<F, MonoProps, R, O, E>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run the
     * monad typeclass laws on `Option`.
     */
    instances: Ins,
    /** Optional runtime `fast-check` parameters. */
    parameters?: ParameterOverrides,
  ) => {
    testTypeclassLawsFor({
      ...given,
      a: propsArbitrary,
      equalsA: propsEquivalence,
      Monoid: propsMonoid,
    })(instances, parameters)
  }

/**
 * Test typeclass laws on the given instances of some datatype `F`. All laws are
 * monomorphic on an underlying type of `{x: number; y: string}`.
 * @param given - Test options for the datatype under test.
 * @category vitest
 */
testTypeclassLaws.underlyingProps = underlyingProps
