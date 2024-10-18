import {Equivalence as EQ, pipe, String as STR} from 'effect'
import {
  ContravariantGiven,
  getMonoUnaryEquivalence,
  Mono,
  unary,
} from 'effect-ts-laws'
import {
  Contravariant,
  FunctionInTypeLambda,
} from 'effect-ts-laws/typeclass/data/Function'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import fc from 'fast-check'

const numRuns = 100

const Arbitrary: fc.Arbitrary<(a: Mono) => string> = pipe(
  fc.string(),
  unary<Mono>(),
)

const Equivalence: EQ.Equivalence<(a: Mono) => string> =
  getMonoUnaryEquivalence(STR.Equivalence)

const given: ContravariantGiven<FunctionInTypeLambda, Mono, unknown, string> = {
  Arbitrary,
  Equivalence,
}

testTypeclassLaws.contravariant(given)({Contravariant}, {numRuns})
