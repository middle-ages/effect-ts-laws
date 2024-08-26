import {Kind} from 'effect/HKT'
import {Equivalence} from './Equivalence.js'
import {Monoid} from './Monoid.js'
import {ConcreteMap, ConcreteOptions} from './options.js'
import {Order} from './Order.js'
import {Semigroup} from './Semigroup.js'

/** Map of typeclass name to their laws, for typeclasses of concrete types. */
const concreteLaws = {
  Equivalence,
  Monoid,
  Order,
  Semigroup,
} as const

/** A name of a typeclasses for concrete types. */
export type ConcreteTypeclass = keyof typeof concreteLaws

/**
 * Maps typeclass name to its instance type. For example to get
 * the type of `Monoid` instance for `readonly number[]`:
 *
 * ```ts
 * type MyMonoidInstance = Instances<readonly number[]>['Monoid']
 * // MyMonoidInstance ≡ Monoid<readonly number[]>
 * ```
 */
export type ConcreteInstances<A> = {
  [Key in ConcreteTypeclass]: Kind<
    ConcreteMap<A>[Key]['lambda'],
    never,
    unknown,
    unknown,
    A
  >
}

/** Maps typeclass name to its law options type. */
export type ConcreteOptionsFor<
  Typeclass extends ConcreteTypeclass,
  A,
> = ConcreteOptions<ConcreteMap<A>[Typeclass]['lambda'], A>

/** Get the typeclass laws for the given typeclass name. */
export const concreteLawsFor = <const Typeclass extends ConcreteTypeclass>(
  name: Typeclass,
) =>
  concreteLaws[name] as <A>(
    options: ConcreteOptionsFor<Typeclass, A>,
  ) => ConcreteMap<A>[Typeclass]['laws']
