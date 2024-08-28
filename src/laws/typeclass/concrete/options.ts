import {Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

/**
 * Common options for testing _concrete type_ typeclass laws. These are the
 * typeclasses that do not expect a higher-kinded type as their parameter.
 *
 * All the concrete typeclass laws expect these options to be provided.
 * @category options
 */
export interface ConcreteOptions<
  F extends TypeLambda,
  A,
  R = never,
  O = unknown,
  E = unknown,
> {
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
  F: Kind<F, R, O, E, A>
}

/**
 * Type-level map of _typeclass name_ to _type lambda_ and _law list
 * type_ for typeclasses on concrete types on the underlying type `A`.
 * Used to map from typeclass name to its various test type. For example,
 * to get the types related to the `Monoid` laws for the `Option` instance
 * on `number`:
 * @example
 * ```ts
 * type MyMonoidTypes = ConcreteMap<number>['Monoid]
 * // MyMonoidTypes ≡ {
 * //   lambda: MonoidTypeLambda
 * //   laws: LawSet<[[a: number], [a: number]]>
 * // }
 * ```
 *
 * Use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
 * to add entries here for a new typeclasses.
 * @category model
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface ConcreteMap<A> {}
