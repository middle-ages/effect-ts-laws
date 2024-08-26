import {Option as OP} from 'effect'
import fc from 'fast-check'

/**
 * Returns an `Option` arbitrary given an arbitrary for the underlying value.
 */
export const option = <A>(
  arbitraryA: fc.Arbitrary<A>,
): fc.Arbitrary<OP.Option<A>> =>
  fc.oneof(arbitraryA.map(OP.some), fc.constant(OP.none<A>()))
