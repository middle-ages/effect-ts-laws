import {Kind} from 'effect/HKT'
import {Equivalence} from './Equivalence.js'
import {ConcreteGiven, ConcreteMap} from './given.js'
import {Monoid} from './Monoid.js'
import {Order} from './Order.js'
import {Semigroup} from './Semigroup.js'

/**
 * Map of typeclass name to their laws, for typeclasses of concrete types.
 * @category model
 */
export const concreteLaws = {
  Equivalence,
  Monoid,
  Order,
  Semigroup,
} as const

/**
 * Union of all names of typeclasses for concrete types.
 * @category model
 */
export type ConcreteClass = keyof typeof concreteLaws

/**
 * Maps typeclass name to its instance type. For example to get
 * the type of `Monoid` instance for `readonly number[]`:
 * @example
 * ```ts
 * type MyMonoidInstance = Instances<readonly number[]>['Monoid']
 * // MyMonoidInstance ≡ Monoid<readonly number[]>
 * ```
 * @category model
 */
export type Concrete<A> = {
  [Key in ConcreteClass]: Kind<
    ConcreteMap<A>[Key]['lambda'],
    never,
    unknown,
    unknown,
    A
  >
}

/**
 * Maps typeclass name to its law options type.
 * @category model
 */
export type ConcreteOptionsFor<
  Typeclass extends ConcreteClass,
  A,
> = ConcreteGiven<ConcreteMap<A>[Typeclass]['lambda'], A>

/**
 * Get the typeclass laws for the given typeclass name.
 * @category model
 */
export const concreteLawsFor = <const Typeclass extends ConcreteClass>(
  name: Typeclass,
) =>
  concreteLaws[name] as <A>(
    options: ConcreteOptionsFor<Typeclass, A>,
  ) => ConcreteMap<A>[Typeclass]['laws']
