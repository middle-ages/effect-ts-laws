import {Option as OP, pipe} from 'effect'
import {checkLaw, Law, negateLaw} from 'effect-ts-laws'
import {testLaw} from 'effect-ts-laws/vitest'
import fc from 'fast-check'

const tinyPositive = fc.integer({min: 1, max: 100})

describe('law', () => {
  const law: Law<[number, number]> = Law(
    'sum of positives is greater or equal to both',
    '∀n₁,n₂ ∈ ℕ, sum=n₁+n₂: sum ≥ n₁ ∧ sum ≥ n₂',
    tinyPositive,
    tinyPositive,
  )((x, y) => x + y >= x && x + y >= y)

  describe('doc example', () => {
    const myLaw = Law(
      'law name',
      'law note',
      fc.integer(),
    )((a: number) => a === a)

    describe('testLaw', () => {
      testLaw(myLaw)
    })
  })

  describe('testLaw', () => {
    describe('basic', () => {
      testLaw(law)
    })

    describe('verbose', () => {
      testLaw({...law, parameters: {...law.parameters, verbose: true}})
    })

    describe('negated twice', () => {
      pipe(law, negateLaw, negateLaw, testLaw)
    })
  })

  describe('checkLaw', () => {
    test('pass', () => {
      expect(checkLaw(law)).toEqual(OP.none())
    })

    test('fail', () => {
      expect(
        pipe(
          law,
          negateLaw,
          checkLaw,
          OP.map(s => s.match(/∀n₁,n₂/) !== null),
        ),
      ).toEqual(OP.some(true))
    })
  })
})
