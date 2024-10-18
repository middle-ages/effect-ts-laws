import {Contravariant as CN} from '@effect/typeclass'
import {dual, pipe} from 'effect/Function'
import type {Kind, TypeLambda} from 'effect/HKT'

/**
 * A unary function from `A` to `E`. The underlying type is the argument type `A`.
 * @category datatype
 */
export interface FunctionIn<A, E> {
  (a: A): E
}

/**
 * Type lambda for a unary function with its argument as the underlying type.
 * @category type lambda
 */
export interface FunctionInTypeLambda extends TypeLambda {
  readonly type: FunctionIn<this['Target'], this['Out1']>
}

/**
 * Map over the argument of a unary function converting a function of
 * type `(a: A) ⇒ E` to `(b: B) ⇒ E`.
 * @category combinators
 */
export const mapInput: CN.Contravariant<FunctionInTypeLambda>['contramap'] =
  dual(
    2,
    <R, O, E, A, B>(
      self: Kind<FunctionInTypeLambda, R, O, E, A>,
      f: (b: B) => A,
    ): Kind<FunctionInTypeLambda, R, O, E, B> =>
      b =>
        pipe(b, f, self),
  )

/** @category instances */
export const Contravariant: CN.Contravariant<FunctionInTypeLambda> = {
  imap: CN.imap<FunctionInTypeLambda>(mapInput),
  contramap: mapInput,
}
