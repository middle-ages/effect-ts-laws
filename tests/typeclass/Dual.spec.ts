import {getMonoid as getArrayMonoid} from '@effect/typeclass/data/Array'
import {Array as AR, Number as NU} from 'effect'
import {tinyIntegerArray} from 'effect-ts-laws'
import {fromMonoid} from 'effect-ts-laws/typeclass/Dual'
import {testMonoid} from 'effect-ts-laws/vitest'

testMonoid(tinyIntegerArray, AR.getEquivalence(NU.Equivalence))(
  fromMonoid(getArrayMonoid<number>()),
  'Dual<Monoid<A>>',
)
