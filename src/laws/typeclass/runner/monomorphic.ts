import {Semigroup as SG} from '@effect/typeclass'
import {getSemigroup as arraySemigroup} from '@effect/typeclass/data/Array'
import {Array as AR, Equivalence as EQ, Number as NU, Order as OD} from 'effect'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {tinyInteger} from '../../../arbitraries/data.js'
import {LiftArbitrary} from '../../../arbitraries/types.js'
import {LiftEquivalence} from '../../../law/equivalence.js'
import {ParameterOverrides} from '../../../law/lawList.js'
import {testTypeclassLawsFor, TypeclassInstances} from './typeclass.js'

/**
 * The underlying type used for monomorphic typeclass law tests.
 * This means that, for example, if we are testing the `Option`
 * data type, the actual type used in the tests will be
 * `Option<Mono> ≡ Option<readonly number[]>`.
 */
export type Mono = readonly number[]

/** The equivalence used for {@link testTypeclassLaws}. */
export const monoEquivalence: EQ.Equivalence<Mono> = AR.getEquivalence(
  NU.Equivalence,
)

/** The order used for {@link testTypeclassLaws}. */
export const monoOrder: OD.Order<Mono> = AR.getOrder(NU.Order)

/** The semigroup used for {@link testTypeclassLaws}. */
export const monoSemigroup: SG.Semigroup<Mono> = arraySemigroup<number>()

/** Options for the monomorphic typeclass test runner. */
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
 * Test typeclass laws for the given instances of some data type. This
 * is just like {@link testTypeclassLawsFor}, but with all functions
 * monomorphic on an underlying type of `readonly number[]`.
 * @param instances - Instances to test. Key is typeclass name and value is the
 * instance under test. For example, `{ Monad: Option.Monad }` will run
 * the monad typeclass laws on `Option`.
 * @param options - Type-specific test options. An object with _two fields
 * which you must fill with the values specific to the data type under test:
 * 1. `getEquivalence` - A function that will build an `Equivalence` for your
 * data type from an `Equivalence` for the underlying type.
 * 2. `getArbitrary` - A function that will build an `Arbitrary` for your
 * data type from an `Arbitrary` for the underlying type.
 * * @param parameters - Optional run-time `fc-check` parameters.
 */
export const testTypeclassLaws = <
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  instances: TypeclassInstances<F, Mono, In1, Out2, Out1>,
  options: MonomorphicOptions<F, In1, Out2, Out1>,
  parameters?: ParameterOverrides,
) => {
  const {getEquivalence, getArbitrary} = options
  const a: fc.Arbitrary<Mono> = fc.array(tinyInteger),
    equalsA: EQ.Equivalence<Mono> = AR.getEquivalence(NU.Equivalence),
    run = testTypeclassLawsFor<F, Mono>()<typeof instances, In1, Out2, Out1>(
      instances,
    )

  run(
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
    parameters,
  )
}
