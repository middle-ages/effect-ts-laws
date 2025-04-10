import {tinyIntegerArray} from '#effect-ts-laws'
import {testMonoid} from '#test'
import {getMonoid as getArrayMonoid} from '@effect/typeclass/data/Array'
import {reverse} from '@effect/typeclass/Monoid'
import {Array as AR, Number as NU} from 'effect'

testMonoid(tinyIntegerArray, AR.getEquivalence(NU.Equivalence))(
  reverse(getArrayMonoid<number>()),
  'Dual<Monoid<A>>',
)
