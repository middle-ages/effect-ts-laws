import {Kind, TypeLambda} from 'effect/HKT'
import {Applicative} from './Applicative.js'
import {Covariant} from './Covariant.js'
import {Invariant} from './Invariant.js'
import {Monad} from './Monad.js'
import {ParameterizedMap} from './options.js'
import {Traversable} from './Traversable.js'

/**
 * Map of typeclass name to their laws, for typeclasses of parameterized
 * types.
 * @category model
 */
export const parameterizedLaws = {
  Invariant,
  Covariant,
  Monad,
  Applicative,
  Traversable,
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
export type Parameterized<
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
> = {
  [Key in ParameterizedClass]: Kind<
    ParameterizedMap<F, unknown>[Key]['lambda'],
    R,
    O,
    E,
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
    B,
    C,
    R = never,
    O = unknown,
    E = unknown,
  >(
    options: ParameterizedMap<F, A, B, C, R, O, E>[Typeclass]['options'],
  ) => ParameterizedMap<F, number, string, boolean, R, O, E>[Typeclass]['laws']
