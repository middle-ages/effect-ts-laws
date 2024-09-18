/** Typeclass law tests for the `effect-ts` liked-list type. */
import {Covariant as CO, Monad as MD} from '@effect/typeclass'
import {
  list as getArbitrary,
  monoEquivalence,
  testTypeclassLaws,
} from 'effect-ts-laws'
import {TypeLambda} from 'effect/HKT'
import {List, flatMap, getEquivalence, map, of} from 'effect/List'

interface ListTypeLambda extends TypeLambda {
  readonly type: List<this['Target']>
}

const Monad: MD.Monad<ListTypeLambda> = {
  of,
  flatMap,
  map,
  imap: CO.imap<ListTypeLambda>(map),
}

describe('effect/List', () => {
  testTypeclassLaws<ListTypeLambda>({getEquivalence, getArbitrary})({
    Equivalence: getEquivalence(monoEquivalence),
    Monad,
  })
})
