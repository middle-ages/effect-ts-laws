import {ContravariantTypeLambda, unfoldMonoGiven} from '#laws'
import {testTypeclassLaws} from '#test'
import {Contravariant, FunctionInTypeLambda} from '#typeclass/data/Function'

const numRuns = 100

const given = unfoldMonoGiven.contravariant<
  ContravariantTypeLambda,
  FunctionInTypeLambda
>(Contravariant)

testTypeclassLaws(given)({Contravariant}, {numRuns})
