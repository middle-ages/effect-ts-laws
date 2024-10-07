/** Typeclass law tests for the `Predicate` datatype. */
import {
  Contravariant,
  getMonoidEqv,
  getMonoidEvery,
  getMonoidSome,
  getMonoidXor,
} from '@effect/typeclass/data/Predicate'
import {Boolean as BO, pipe} from 'effect'
import {getMonoUnaryEquivalence, Mono, predicate} from 'effect-ts-laws'
import {testMonoids, testTypeclassLaws} from 'effect-ts-laws/vitest'
import {PredicateTypeLambda} from 'effect/Predicate'

const Arbitrary = predicate<Mono>()
const Equivalence = getMonoUnaryEquivalence(BO.Equivalence)

describe('@effect/typeclass/data/Predicate', () => {
  testTypeclassLaws.contravariant<PredicateTypeLambda>({
    Arbitrary,
    Equivalence,
  })({Contravariant}, {numRuns: 100})

  describe('Semigroup/monoid', () => {
    pipe(
      {
        eqv: getMonoidEqv<Mono>(),
        some: getMonoidSome<Mono>(),
        xor: getMonoidXor<Mono>(),
        every: getMonoidEvery<Mono>(),
      },
      testMonoids(Arbitrary, Equivalence, {numRuns: 100}),
    )
  })
})
