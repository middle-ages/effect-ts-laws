import {pipe} from 'effect'
import {
  addLaws,
  addLawSet,
  checkLaws,
  Law,
  LawSet,
  lawSetTests,
  lawTests,
  negateLaw,
  testLaws,
} from 'effect-ts-laws'
import fc from 'fast-check'

const tinyPositive = fc.integer({min: 1, max: 100})

describe('lawSet', () => {
  const setA: LawSet = lawTests(
    'some unit under test',
    Law('law₁', '∀n ∈ ℕ: n = n', tinyPositive)(x => x === x),
    Law('law₂', '∀n ∈ ℕ: n ≤ n', tinyPositive)(x => x <= x),
  )

  const lawA: Law<[string]> = Law(
    'law₀',
    'string length is never negative',
    fc.string(),
  )(s => s.length >= 0)

  const lawB: Law<[number, number]> = Law(
    'law₃',
    '∀n₁,n₂ ∈ tinyPositive: n₁ + n₂ > 0',
    tinyPositive,
    tinyPositive,
  )((a, b) => a + b > 0)

  const setB: LawSet = lawTests('parent', lawA)

  const failLaw = negateLaw(lawA)

  const failSet = lawTests('fail', lawB, failLaw)

  describe('testLaws', () => {
    testLaws(setA)
  })

  describe('LawSet', () => {
    testLaws(LawSet(setA, setB)('my LawSet', lawA, lawB))
  })

  describe('addRequirement', () => {
    pipe(setB, addLawSet(setA), testLaws)
  })

  describe('addLaws', () => {
    pipe(setA, addLaws(lawB), testLaws)
  })

  describe('checkLaws', () => {
    test('pass', () => {
      expect(checkLaws(setA)).toEqual([])
    })

    test('fail', () => {
      expect(checkLaws(failSet)[0]).toMatch(/law₀/)
    })
  })

  test('failed law fails law set', () => {
    expect(checkLaws(addLaws(failLaw)(setA)).length).toBe(1)
  })

  test('failed requirement fails law set', () => {
    expect(checkLaws(addLawSet(failSet)(setB)).length).toBe(1)
  })

  test('empty LawSet passes, but no tests run', () => {
    testLaws(LawSet()('foo'))
  })

  describe('lawSetTests', () => {
    describe('pass', () => {
      testLaws(lawSetTests(setA, setA, lawSetTests(setA, setA)))
    })
  })
})
