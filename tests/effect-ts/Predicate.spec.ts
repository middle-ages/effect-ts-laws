/** Typeclass law tests for the `Predicate` datatype. */
import {predicate} from '#arbitrary'
import {
  ContravariantTypeLambda,
  getMonoUnaryEquivalence,
  Mono,
  unfoldMonoGiven,
} from '#laws'
import {testMonoids, testTypeclassLaws} from '#test'
import {
  Contravariant,
  getMonoidEqv,
  getMonoidEvery,
  getMonoidSome,
  getMonoidXor,
} from '@effect/typeclass/data/Predicate'
import {Boolean as BO, pipe, Predicate as PR} from 'effect'
import {PredicateTypeLambda} from 'effect/Predicate'

const Arbitrary = predicate<Mono>()
const Equivalence = getMonoUnaryEquivalence(BO.Equivalence)

const numRuns = 10

describe('@effect/typeclass/data/Predicate', () => {
  const given = unfoldMonoGiven.contravariant<
    ContravariantTypeLambda,
    PR.PredicateTypeLambda
  >(Contravariant)

  testTypeclassLaws<PredicateTypeLambda>(given)({Contravariant}, {numRuns})

  describe('Semigroup/monoid', () => {
    pipe(
      {
        eqv: getMonoidEqv<Mono>(),
        some: getMonoidSome<Mono>(),
        xor: getMonoidXor<Mono>(),
        every: getMonoidEvery<Mono>(),
      },
      testMonoids(Arbitrary, Equivalence, {numRuns}),
    )
  })
})
