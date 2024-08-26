import {Either as EI} from 'effect'
import fc from 'fast-check'

/**
 * Returns an `Either` arbitrary given a pair of arbitraries for the underlying
 * left and right values.
 */
export const either = <A, E>(
  arbitraryE: fc.Arbitrary<E>,
  arbitraryA: fc.Arbitrary<A>,
): fc.Arbitrary<EI.Either<A, E>> =>
  fc.oneof(
    arbitraryA.map<EI.Either<A, E>>(EI.right),
    arbitraryE.map<EI.Either<A, E>>(EI.left),
  )
