import {Semigroup as SG} from '@effect/typeclass'
import {getSemigroup as arraySemigroup} from '@effect/typeclass/data/Array'
import {Array as AR, Equivalence as EQ, Number as NU, Order as OD} from 'effect'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {LiftArbitrary, tinyInteger} from '../../../arbitrary.js'
import {LiftEquivalence, Overrides} from '../../../law.js'
import {testTypeclassLawsFor, TypeclassInstances} from './typeclass.js'

/**
 * The underlying type used for monomorphic typeclass law tests.
 * This means that, for example, if we are testing the `Option`
 * datatype, the actual type used in the tests will be
 * `Option<Mono> ≡ Option<readonly number[]>`.
 * @category monomorphic
 */
export type Mono = readonly number[]

/**
 * The equivalence used for {@link testTypeclassLaws}.
 * @category monomorphic
 */
export const monoEquivalence: EQ.Equivalence<Mono> = AR.getEquivalence(
  NU.Equivalence,
)

/**
 * The order used to {@link testTypeclassLaws}.
 * @category monomorphic
 */
export const monoOrder: OD.Order<Mono> = AR.getOrder(NU.Order)

/**
 * The semigroup used to {@link testTypeclassLaws}.
 * @category monomorphic
 */
export const monoSemigroup: SG.Semigroup<Mono> = arraySemigroup<number>()

/**
 * Options for the monomorphic typeclass test runner.
 * @category monomorphic
 */
export interface MonomorphicOptions<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {
  getArbitrary: LiftArbitrary<F, In1, Out2, Out1>
  getEquivalence: LiftEquivalence<F, In1, Out2, Out1>
}

/**
 * Test typeclass laws for the given instances of some datatype. This
 * is just like {@link testTypeclassLawsFor}, but with all functions
 * monomorphic on an underlying type of `readonly number[]`.
 * @example
 * ```ts
 * // Test Traversable typeclass laws on `Identity` datatype.
 * import { Applicative, IdentityTypeLambda, Monad, Traversable } from '@effect/typeclass/data/Identity'
 * import {identity as id} from 'effect'
 * import {testTypeclassLaws} from 'effect-ts-laws'
 * testTypeclassLaws<IdentityTypeLambda>({
 *   getEquivalence: identity,
 *   getArbitrary: identity,
 * })({
 *   Applicative,
 *   Monad,
 *   Traversable,
 * })
 * ```
 * @param options - Type-specific test options. An object with _two fields
 * which you must fill with the values specific to the datatype under test:
 * 1. `getEquivalence` - A function that will build an `Equivalence` for your
 * datatype from an `Equivalence` for the underlying type.
 * 2. `getArbitrary` - A function that will build an `Arbitrary` for your
 * datatype from an `Arbitrary` for the underlying type.
 * @category harness
 */
export const testTypeclassLaws =
  <F extends TypeLambda>(
    options: MonomorphicOptions<F, never, unknown, string>,
  ) =>
  <Ins extends TypeclassInstances<F, Mono, never, unknown, string>>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
    /**
     * Optional runtime `fc-check` parameters.
     */
    parameters?: Overrides,
  ) => {
    const {getEquivalence, getArbitrary} = options,
      a = fc.array(tinyInteger, {maxLength: 4}),
      equalsA = AR.getEquivalence(NU.Equivalence)

    testTypeclassLawsFor<F, Ins, Mono, Mono, Mono, never, unknown, string>(
      instances,
      {
        a,
        b: a,
        c: a,
        equalsA,
        equalsB: equalsA,
        equalsC: equalsA,
        getEquivalence,
        getArbitrary,
      },
      {verbose: true, ...parameters},
    )
  }
