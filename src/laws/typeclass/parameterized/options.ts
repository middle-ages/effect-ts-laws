/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {LiftArbitrary} from '#arbitrary'
import {ComposeKey, composeMap, ComposeTypeLambda} from '#compose'
import {LiftEquivalence} from '#law'
import {Equivalence as EQ, flow} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

/**
 * Options for testing
 * [parameterized-type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclasses. All the typeclass laws here expect their arguments to be of
 * this type.
 * @typeParam Class - The type lambda of the typeclass under tests.
 * @typeParam F - The type lambda of the datatype under test.
 * @category options
 */
export interface Options<
  Class extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
> {
  /**
   * The higher-kinded type `Class<F>` is the typeclass instance under
   * test. For example when testing the `Monad` laws on an
   * `Either<number, string>`, this would be `Monad<Either>`.
   */
  F: Kind<Class, R, O, E, F>

  /** An equivalence for the underlying type `A`. */
  equalsA: EQ.Equivalence<A>

  /** An equivalence for the underlying type `B`. */
  equalsB: EQ.Equivalence<B>

  /** An equivalence for the underlying type `C`. */
  equalsC: EQ.Equivalence<C>

  /**
   * A function that will get an equivalence for the type under test from an
   * equivalence for the underlying type.
   */
  getEquivalence: LiftEquivalence<F, R, O, E>

  /**
   * A function that will build an arbitrary for the datatype under test
   * from an  arbitrary for the underlying type. For example, when testing
   * the `Either` datatype for `Either<A, string>`, this would be a
   * function of the type
   * `<A>(a: fc.Arbitrary<A>) ⇒ fc.Arbitrary<Either<A, string>>`.
   */
  getArbitrary: LiftArbitrary<F, R, O, E>

  /**
   * An arbitrary for the underlying type. For example, when testing `Option`
   * instances, and the type parameter `A` is `number`, this type would be
   * set at `fc.Arbitrary<number>`. The monomorphic runner set this type,
   * and the other two underlying type arbitraries, to `readonly number[]`.
   */
  a: fc.Arbitrary<A>

  /**
   * An arbitrary for the second underlying type `B`. Used for generating
   * functions in composition tests.
   */
  b: fc.Arbitrary<B>

  /**
   * An arbitrary for the third underlying type `C`. Used for generating
   * functions in composition tests.
   */
  c: fc.Arbitrary<C>
}

/**
 * Use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * to add entries here for a new typeclasses. Used to map from typeclass name to
 * its various test types.
 * @internal
 * @category model
 */
export interface ParameterizedMap<
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
> {}

/**
 * Convert the `LawSet` options of a typeclass test into the options of a
 * composed typeclass test.
 * @category composition
 */
export const liftOptions =
  <Class extends TypeLambda, F extends TypeLambda, G extends TypeLambda>() =>
  <K extends ComposeKey>(key: K, suffix: string) =>
  <
    Os extends Options<Class, F, A, B, C, R, O, E>,
    A,
    B = A,
    C = A,
    R = never,
    O = unknown,
    E = unknown,
  >(
    {F, getEquivalence, getArbitrary, ...options}: Os,
    G: Kind<Class, R, O, E, G>,
    getEquivalenceG: LiftEquivalence<G, R, O, E>,
    getArbitraryG: LiftArbitrary<G, R, O, E>,
  ) => {
    type FG = ComposeTypeLambda<G, F, R, O, E>
    const FG = composeMap[key](G as never, F as never) as Kind<
      Class,
      R,
      O,
      E,
      FG
    >

    return [
      `${key}Composition.${suffix}`,
      {
        ...options,
        F: FG,
        getEquivalence: flow(getEquivalence, getEquivalenceG),
        getArbitrary: flow(getArbitrary, getArbitraryG),
      },
    ] as [string, typeof options & Options<Class, FG, A, B, C, R, O, E>]
  }
