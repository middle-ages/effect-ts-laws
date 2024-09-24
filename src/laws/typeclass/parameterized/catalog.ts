import {Kind, TypeLambda} from 'effect/HKT'
import {LawSet} from '#law'
import {Applicative} from './Applicative.js'
import {Bicovariant} from './Bicovariant.js'
import {Contravariant} from './Contravariant.js'
import {Covariant} from './Covariant.js'
import {ParameterizedGiven, ParameterizedLambdas} from './given.js'
import {Invariant} from './Invariant.js'
import {Monad} from './Monad.js'
import {Traversable} from './Traversable.js'

/**
 * Map of typeclass name to their laws, for typeclasses of parameterized
 * types.
 * @category model
 */
export const parameterizedLaws = {
  Invariant,
  Contravariant,
  Covariant,
  Monad,
  Applicative,
  Traversable,
  Bicovariant,
} as const

/**
 * Union of all names of typeclasses for parameterized types.
 * @category model
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
 * @category model
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
 * @category model
 */
export const isParameterizedTypeclassName = (
  o: string,
): o is ParameterizedClass => o in parameterizedLaws

/**
 * Get the typeclass laws for the given typeclass name. Returns a function that
 * when given the required options, will run the typeclass law tests.
 * @category model
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
