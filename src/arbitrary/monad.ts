import {Covariant as CO, FlatMap as FL, Monad as MD} from '@effect/typeclass'
import {dual} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

/**
 * Type lambda for the `fc.Arbitrary` datatype.
 * @category type lambda
 */
export interface ArbitraryTypeLambda extends TypeLambda {
  readonly type: fc.Arbitrary<this['Target']>
}

const map: CO.Covariant<ArbitraryTypeLambda>['map'] = dual(
  2,
  <A, B>(self: fc.Arbitrary<A>, f: (a: A) => B): fc.Arbitrary<B> =>
    self.map(a => f(a)),
)

const flatMap: FL.FlatMap<ArbitraryTypeLambda>['flatMap'] = dual(
  2,

  <A, B>(
    self: fc.Arbitrary<A>,
    f: (a: A) => fc.Arbitrary<B>,
  ): fc.Arbitrary<B> => self.chain(a => f(a)),
)

/**
 * Monad instance for `fc.Arbitrary`.
 * @category fast-check
 */
export const Monad: MD.Monad<ArbitraryTypeLambda> = {
  map,
  imap: CO.imap<ArbitraryTypeLambda>(map),
  flatMap,
  of: fc.constant,
}
