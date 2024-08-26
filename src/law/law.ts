import {Array as AR, Option as OP} from 'effect'

/** The base law type is a predicate with a name and a note. */
export interface Law<Args extends UnknownArgs> {
  /**
   * Law name to be used as test name. You can include a description of the
   * unit under test or anything else you wish to appear in the test name,
   * for example: `MyList.map:associative`.
   */
  name: string

  /** An optional note to shown only on failure or in verbose mode. */
  note: OP.Option<string>

  /** Predicate to be tested */
  predicate: NAryPredicate<Args>
}

/** The type of predicate that takes `Args` as arguments. */
export interface NAryPredicate<Args extends UnknownArgs> {
  (...args: Args): boolean
}

/** The exact type of unknown args used in `fast-check` types. */
export type UnknownArgs = AR.NonEmptyArray<unknown>

/**
 * Build a law from a name, a predicate, and optional note. Useful when you want
 * to reuse a law where you have test data already available.
 *
 * @typeParam Args -  Argument type of predicate. For example, if the law
 * predicate signature is `(a: number, b: string) ⇒ boolean`, then `Args`
 * would be `[a: number, b: string]`.
 *
 * @param name - Law name, shown as test label.
 * @param predicate - Law predicate. Its argument type is encoded in the `Args`
 * type parameter.
 * @param note - Optional note. Will be shown only on failure or in verbose mode.
 *
 * @returns A new `Law` object.
 */
export const buildLaw = <Args extends UnknownArgs>(
  name: string,
  predicate: NAryPredicate<Args>,
  note?: string,
): Law<Args> => ({name, note: OP.fromNullable(note), predicate})
