import {Covariant as CO, FlatMap as FL, Monad as MD} from '@effect/typeclass'
import {Equivalence as EQ} from 'effect'
import {dual} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {testUnaryEquivalence} from './function.js'

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

/**
 * Get an equivalence for `fc.Arbitrary<A>` from an equivalence of `A`.
 * Arbitraries are equal if they produce the same values for the same seeds.
 * Note this only means we were unable to find a counter-example to the
 * equivalence.
 * @category fast-check
 */
export const getEquivalence = <A>(
  equalsA: EQ.Equivalence<A>,
  parameters?: fc.Parameters<number>,
): EQ.Equivalence<fc.Arbitrary<A>> => {
  const sample =
    (arbitrary: fc.Arbitrary<A>) =>
    (seed: number): A => {
      const [result] = fc.sample(arbitrary, {seed, numRuns: 1})
      if (result === undefined) throw new Error('Could not sample.')
      return result
    }

  return (self, that) =>
    testUnaryEquivalence(
      fc.integer(),
      equalsA,
      parameters,
    )(sample(self), sample(that))
}
