import {Array as AR, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {UnionToIntersection} from 'effect/Types'
import {LawSet} from '../../../../law.js'
import {alternativeLaws} from '../Alternative.js'
import {applicativeLaws} from '../Applicative.js'
import {bicovariantLaws} from '../Bicovariant.js'
import {contravariantLaws} from '../Contravariant.js'
import {covariantLaws} from '../Covariant.js'
import {invariantLaws} from '../Invariant.js'
import {monadLaws} from '../Monad.js'
import {semiAlternativeLaws} from '../SemiAlternative.js'
import {traversableLaws} from '../Traversable.js'
import {
  GivenConcerns,
  ParameterizedGiven,
  ParameterizedLambdas,
} from '../given.js'

/**
 * Map of typeclass name to their laws, for typeclasses of parameterized
 * types.
 * @category harness
 */
export const parameterizedLaws = {
  Alternative: alternativeLaws,
  Applicative: applicativeLaws,
  Bicovariant: bicovariantLaws,
  Contravariant: contravariantLaws,
  Covariant: covariantLaws,
  Invariant: invariantLaws,
  Monad: monadLaws,
  SemiAlternative: semiAlternativeLaws,
  Traversable: traversableLaws,
} as const

/**
 * Union of all names of typeclasses for parameterized types.
 * @category harness
 */
export type ParameterizedClass = keyof typeof parameterizedLaws

/**
 * Maps typeclass name to its instance type. For example to get the type of the
 * `Monad` instance for `ReadonlyArray`:
 * @example
 * ```ts
 * type MyMonad = ParameterizedInstances<ReadonlyArrayTypeLambda>['Monad']
 * // MyMonad ≡ Monad<ReadonlyArrayTypeLambda>
 * ```
 * @category harness
 */
export type Parameterized<F extends TypeLambda> = {
  [Key in ParameterizedClass]: Kind<
    ParameterizedLambdas[Key],
    never,
    unknown,
    unknown,
    F
  >
}

/**
 * Type guard for parameterized type typeclass names.
 * @category harness
 */
export const isParameterizedTypeclassName = (
  o: string,
): o is ParameterizedClass => o in parameterizedLaws

/**
 * Get the typeclass laws for the given typeclass name. Returns a function that
 * when given the required options, will run the typeclass law tests.
 * @category harness
 */
export const parameterizedLawsFor = <
  const Typeclass extends ParameterizedClass,
>(
  name: Typeclass,
) =>
  parameterizedLaws[name] as <
    F extends TypeLambda,
    A,
    B = A,
    C = A,
    In1 = never,
    Out2 = unknown,
    Out1 = unknown,
  >(
    given: ParameterizedGiven<
      ParameterizedLambdas[Typeclass],
      F,
      A,
      B,
      C,
      In1,
      Out2,
      Out1
    >,
  ) => LawSet

/**
 * Build [parameterized type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclass laws for the given instances of some datatype.
 *
 * @typeParam F - Type lambda of the datatype under test.
 * @typeParam A - Type lambda of first underlying type.
 * @typeParam B - Type lambda of second underlying type.
 * @typeParam C - Type lambda of third underlying type.
 * @category harness
 */
export const buildParameterizedTypeclassLaws =
  <F extends TypeLambda, A, B = A, C = A>() =>
  <
    Ins extends Partial<Parameterized<F>>,
    In1 = never,
    Out2 = unknown,
    Out1 = unknown,
  >(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
    /**
     * Parameterized typeclass test options.
     */
    given: GivenConcerns<F, A, B, C, In1, Out2, Out1>,
  ): LawSet[] => {
    const mergedInstances = Object.assign(
      {},
      ...Object.values(instances),
    ) as UnionToIntersection<Ins[keyof Ins]>

    return pipe(
      Object.keys(instances) as ParameterizedClass[],
      AR.map(<K extends ParameterizedClass>(key: K) =>
        parameterizedLawsFor(key)(
          Object.assign({F: mergedInstances}, given) as never,
        ),
      ),
    )
  }
