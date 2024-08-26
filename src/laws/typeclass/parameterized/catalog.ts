import {Kind, TypeLambda} from 'effect/HKT'
import {Applicative} from './Applicative.js'
import {Covariant} from './Covariant.js'
import {Invariant} from './Invariant.js'
import {Monad} from './Monad.js'
import {ParameterizedMap} from './options.js'

/**
 * Map of typeclass name to their laws, for typeclasses of parameterized
 * types.
 */
export const parameterizedLaws = {
  Invariant,
  Covariant,
  Monad,
  Applicative,
} as const

/** A name of a typeclasses for parameterized types. */
export type ParameterizedTypeclass = keyof typeof parameterizedLaws

/**
 * Maps typeclass name to its instance type. For example to get the type of the
 * `Monad` instance for `ReadonlyArray`:
 *
 * ```ts
 * type MyMonad = ParameterizedInstances<ReadonlyArrayTypeLambda>['Monad']
 * // MyMonad ≡ Monad<ReadonlyArrayTypeLambda>
 * ```
 */
export type ParameterizedInstances<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> = {
  [Key in ParameterizedTypeclass]: Kind<
    ParameterizedMap<F, unknown>[Key]['lambda'],
    In1,
    Out2,
    Out1,
    F
  >
}

/** Type guard for parameterized type typeclass names. */
export const isParameterizedTypeclassName = (
  o: string,
): o is ParameterizedTypeclass => o in parameterizedLaws

/**
 * Get the typeclass laws for the given typeclass name. Returns a function that
 * when given the required options, will run the typeclass law tests.
 */
export const parameterizedLawsFor = <
  const Typeclass extends ParameterizedTypeclass,
>(
  name: Typeclass,
) =>
  parameterizedLaws[name] as <
    F extends TypeLambda,
    A,
    B,
    C,
    In1 = never,
    Out2 = unknown,
    Out1 = unknown,
  >(
    options: ParameterizedMap<
      F,
      A,
      B,
      C,
      In1,
      Out2,
      Out1
    >[Typeclass]['options'],
  ) => ParameterizedMap<
    F,
    number,
    string,
    boolean,
    In1,
    Out2,
    Out1
  >[Typeclass]['laws']

/**
 * The type of options required for testing the typeclass laws for the given
 * instances.
 */
export type ParameterizedOptions<
  Classes extends Partial<ParameterizedInstances<F, In1, Out2, Out1>>,
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> = {
  [Key in keyof Classes]: Omit<
    ParameterizedMap<F, A, B, C, In1, Out2, Out1>[Key &
      ParameterizedTypeclass]['options'],
    'F'
  >
}[keyof Classes]
