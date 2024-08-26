import {Boolean as BO, flow, pipe} from 'effect'
import {asProperty, LawTest, lawTest, testLaw} from 'effect-ts-laws'
import fc from 'fast-check'

const int = fc.integer({min: 0, max: 100})

describe('lawTest', () => {
  // “iut” stands for “Implementation Under Test”
  const iut: LawTest<[number, number]> = lawTest(
    'sum of positives is greater or equal to both',
    (x: number, y: number) => x + y >= x && x + y >= y,
    '∀n₁,n₂ ∈ ℕ, sum=n₁+n₂: sum ≥ n₁ ∧ sum ≥ n₂',
  )([int, int])

  describe('testLaw', () => {
    describe('basic', () => {
      testLaw(iut)
    })

    describe('verbose', () => {
      testLaw({...iut, parameters: {...iut.parameters, verbose: true}})
    })
  })

  describe('asProperty', () => {
    test('pass', () => pipe(iut, asProperty, fc.assert))

    test('fail shows note', () => {
      const property = asProperty({
        ...iut,
        predicate: flow(iut.predicate, BO.not),
      })

      assert.throws(() => {
        fc.assert(property)
      }, /∀n₁,n₂/)
    })
  })
})
