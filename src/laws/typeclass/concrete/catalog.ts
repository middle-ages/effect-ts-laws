import {LawSet} from '#law'
import {Equivalence} from './Equivalence.js'
import {ConcreteGiven, ConcreteLambdas} from './given.js'
import {Monoid} from './Monoid.js'
import {Order} from './Order.js'
import {Semigroup} from './Semigroup.js'
import {Bounded} from './Bounded.js'

/**
 * Map of typeclass name to their laws, for typeclasses of concrete types.
 * @category model
 */
export const concreteLaws = {
  Bounded,
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
 * Get the typeclass laws for the given typeclass name.
 * @category model
 */
export const concreteLawsFor = <const Typeclass extends ConcreteClass>(
  name: Typeclass,
) =>
  concreteLaws[name] as <A>(
    options: ConcreteGiven<ConcreteLambdas[Typeclass], A>,
  ) => LawSet
