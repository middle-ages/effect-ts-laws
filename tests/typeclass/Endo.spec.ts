import {endo, testEndoEquivalence, tinyInteger} from '#effect-ts-laws'
import {testMonoid} from '#test'
import {getMonoid} from '#typeclass/data/Endo'
import {Number as NU} from 'effect'

testMonoid(
  endo(tinyInteger),
  testEndoEquivalence<number>(tinyInteger, NU.Equivalence),
)(getMonoid<number>(), 'Endo<A>')
