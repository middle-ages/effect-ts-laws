/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import {Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {GetArbitrary, GetEquivalence} from '../../../law/law.js'

/**
 * Options for testing
 * [parameterized-type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclasses. This is the intersection of all the option types required
 * for all laws. Every typeclass laws test requires these options, besides
 * any custom requirements.
 *
 * The type lambda `Class` is for the typeclass under test and
 * `F` is for the parameterized data type under test.
 */
export interface CommonOptions<
  Class extends TypeLambda,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {
  /**
   * The instance under test, the higher-kinded type `F<A>`. For
   * example when testing the `Monad` laws on an `Either<number, string>`,
   * this would be `Monad<Either>`.
   */
  F: Kind<Class, In1, Out2, Out1, F>

  /** An equivalence for the underlying type `A`. */
  equalsA: EQ.Equivalence<A>

  /** An equivalence for the underlying type `C`. */
  equalsC: EQ.Equivalence<C>

  /**
   * A function that will get an equivalence for the type under test from an
   * equivalence for the underlying type.
   */
  getEquivalence: GetEquivalence<F, In1, Out2, Out1>

  /**
   * A function that will build an arbitrary for the data type under test
   * from an  arbitrary for the underlying type. For example, when testing
   * the `Either` data type for `Either<A, string>`, this would be a
   * function of the type
   * `<A>(a: fc.Arbitrary<A>) ⇒ fc.Arbitrary<Either<A, string>>`.
   */
  getArbitrary: GetArbitrary<F, In1, Out2, Out1>

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
 * its various test type. For example to get the types related to the `Monad`
 * when testing the `Option` datatype with underlying values
 * `number/string/boolean`:
 *
 * ```ts
 * type MyTypes = ParameterizedMap<OptionTypeLambda, number, string, boolean>['Monad']
 * // MyTypes ≡{
 * //   lambda: MonadTypeLambda
 * //   options: MonadOptions<OptionTypeLambda, number, string, boolean>
 * //   laws: LawList<[[a: number], [fa: Option<number>], [fa: Option<number>]]>
 * // }
 * ```
 */
export interface ParameterizedMap<
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {}
