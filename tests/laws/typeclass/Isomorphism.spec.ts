import {tinyNonNegative, tinyPositive} from '#arbitrary'
import {
  BaseIsomorphismGiven,
  buildIsomorphismLaws,
  IsomorphismGiven,
} from '#laws'
import {testLawSets} from '#test'
import {Isomorphism} from '#typeclass'
import {Array, Number, String} from 'effect'

const stringIso: Isomorphism.Isomorphism<number, string> = {
  to: n => n.toString(),
  from: s => parseInt(s),
}

const arrayIso: Isomorphism.Isomorphism<number, null[]> = {
  // eslint-disable-next-line unicorn/no-null
  to: n => (n === 0 ? [] : Array.replicate(n)(null)),
  from: array => array.length,
}

const common: BaseIsomorphismGiven<number> = {
  a: tinyNonNegative,
  equalsA: Number.Equivalence,
}

const string: IsomorphismGiven<number, string> = {
  ...common,
  F: stringIso,
  b: tinyNonNegative.map(n => n.toString()),
  equalsB: String.Equivalence,
}

const array: IsomorphismGiven<number, null[]> = {
  ...common,
  F: arrayIso,
  // eslint-disable-next-line unicorn/no-null
  b: tinyPositive.map(n => Array.replicate(n)(null)),
  equalsB: (self, that) => self.length === that.length,
}

describe('Isomorphism laws self-test', () => {
  testLawSets()(
    ...buildIsomorphismLaws<number>({
      a: tinyPositive,
      equalsA: Number.Equivalence,
    })({string, array}),
  )
})
