// Demonstrates checking of typeclass laws outside vitest, in this case from a Node.js script
// written in Typescript. Run with `tsx dev/demo.ts`.

import {
  Applicative,
  Filterable,
  getMonoid,
  Monad,
  Traversable,
} from '@effect/typeclass/data/Array'
import type {LawSet, Mono} from 'effect-ts-laws'
import {
  buildTypeclassLaws,
  checkLawSets,
  monoEquivalence,
  monoOrder,
  tinyArray,
  unfoldMonoGiven,
} from 'effect-ts-laws'
import {RightFoldable} from 'effect-ts-laws/typeclass/data/Array'
//import {} from 'effect-ts-laws/typeclass'
//import {} from 'effect-ts-laws/vitest'
import type {ReadonlyArrayTypeLambda} from 'effect/Array'
import {getEquivalence, getOrder, isNonEmptyArray} from 'effect/Array'

const given = unfoldMonoGiven<ReadonlyArrayTypeLambda>(
  getEquivalence,
  tinyArray,
)

const laws: LawSet[] = buildTypeclassLaws(given)({
  Equivalence: getEquivalence(monoEquivalence),
  Order: getOrder(monoOrder),
  Monoid: getMonoid<Mono>(),
  Applicative,
  Filterable,
  Monad,
  RightFoldable,
  Traversable,
})

console.log('Checking readonly array data type...')

const failures = checkLawSets()(...laws)

if (isNonEmptyArray(failures)) {
  console.error(failures)
} else {
  console.log('Pass')
}

console.log('Done.')
