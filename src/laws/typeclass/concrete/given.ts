import {Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Law, LawSet, UnknownArgs} from '#law'

/**
 * Common options for testing _concrete type_ typeclass laws. These are
 * the typeclasses that do not expect a higher-kinded type as their
 * parameter. All the concrete typeclass laws expect these options to be
 * provided.
 * @typeParam F - The type lambda of the typeclass under test. If we are
 * testing `Monoid` laws, for example, then it would be set to
 * `MonoidTypeLambda`.
 * @typeParam A - The datatype under test. For example, when testing
 * `Monoid` laws on `Option<number>`, this would be set to
 * `Option<number>`.
 * @category options
 */
export interface ConcreteGiven<F extends TypeLambda, A> {
  /**
   * An arbitrary for the values used to test the typeclass. For example when
   * testing `Monoid` on `Option<number>`, this should return an equivalence
   * for an `Option<number>`.
   */
  equalsA: EQ.Equivalence<A>

  /**
   * An arbitrary for the values used to test the typeclass. For example when
   * testing `Monoid` on `Option<number>`, this should return an arbitrary
   * for an `Option<number>`.
   */
  a: fc.Arbitrary<A>

  /**
   * Instance under test. For example when testing the `Monoid` typeclass laws
   * on an instance of the `Option` Monoid, with the underlying type set at
   * `number`, then the type parameter `A` would be set at `Option<number>` and
   * this field at `Monoid<Option<number>>`.
   */
  F: Kind<F, never, unknown, unknown, A>

  /**
   * Optional suffix to attach to `LawTest` label.
   */
  suffix?: string
}

/**
 * Build a set of laws for some typeclass on a concrete type.
 * @param typeclassName - Used as label for vitest `description()` block.
 * @param laws - list of `Law` to test.
 * @returns A set of laws ready to be tested.
 */
export const concreteLaws =
  <Ts extends UnknownArgs[]>(
    typeclassName: string,
    ...laws: {[K in keyof Ts]: Law<Ts[K]>}
  ) =>
  (
    /**
     * Optional suffix to attach to `LawTest` label. Used, for example,
     * to differentiate between the different `Monoid` instances of
     * `Boolean`.
     */
    suffix = '',
    /**
     * Optional list of `LawSet`s that are required for the
     * typeclass under test. For example, the `Monoid` laws
     * require the instance under test pass the `Semigroup`
     * laws besides the `Monoid` laws themselves. They do
     * this by adding the `Semigroup` laws in this field.
     */
    ...sets: LawSet[]
  ): LawSet =>
    LawSet(...sets)(
      typeclassName + (suffix === '' ? '' : `.${suffix}`),
      ...laws,
    )

/**
 * Type-level map of _typeclass name_ to _type class lambda_ typeclasses on
 * concrete types. Use
 * [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * to add entries here for a new typeclasses.
 * @category model
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConcreteLambdas {}
