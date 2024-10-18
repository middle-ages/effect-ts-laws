import {Number as NU} from 'effect'
import {endo, testEndoEquivalence, tinyInteger} from 'effect-ts-laws'
import {getMonoid} from 'effect-ts-laws/typeclass/data/Endo'
import {testMonoid} from 'effect-ts-laws/vitest'

testMonoid(
  endo(tinyInteger),
  testEndoEquivalence<number>(tinyInteger, NU.Equivalence),
)(getMonoid<number>(), 'Endo<A>')
