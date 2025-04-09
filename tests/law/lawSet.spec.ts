import {Number as NU, pipe} from 'effect'
import {
  addLaws,
  addLawSets,
  checkLaws,
  checkLawSets,
  equivalenceLaws,
  filterLaws,
  filterLawsDeep,
  Law,
  LawSet,
  lawSetTests,
  lawTests,
  negateLaw,
  tinyInteger,
} from '#effect-ts-laws'
import {testLaws} from '#test'
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

  describe('All child tests will be skipped', () => {
    testLaws.skip(setA)
    testLaws.skipIf(true)(setA)
  })

  describe('No child tests will be skipped', () => {
    testLaws.skipIf(false)(setA)
    testLaws.runIf(true)(setA)
  })

  describe('LawSet', () => {
    testLaws(LawSet(setA, setB)('my LawSet', lawA, lawB))
  })

  describe('addRequirement', () => {
    pipe(setB, addLawSets(setA), testLaws)
  })

  describe('addLaws', () => {
    pipe(setA, addLaws(lawB), testLaws)
  })

  describe('checkLaws', () => {
    test('pass', () => {
      expect(checkLaws(setA)).toEqual([])
    })

    test('fail', () => {
      expect(checkLaws(failSet)[0]).toMatch(/Property failed/)
    })
  })

  describe('checkLaws', () => {
    test('pass', () => {
      expect(checkLawSets()(setA)).toEqual([])
    })

    test('fail', () => {
      expect(checkLawSets()(failSet)[0]).toMatch(/Property failed/)
    })
  })

  test('failed law fails law set', () => {
    expect(checkLaws(addLaws(failLaw)(setA)).length).toBe(1)
  })

  test('failed requirement fails law set', () => {
    expect(checkLaws(addLawSets(failSet)(setB)).length).toBe(1)
  })

  test('empty LawSet passes, but no tests run', () => {
    testLaws(LawSet()('foo'))
  })

  describe('lawSetTests', () => {
    describe('pass', () => {
      testLaws(lawSetTests(setA, setA, lawSetTests(setA, setA)))
    })
  })

  describe('filterLaws', () => {
    const unfiltered = pipe(
      {a: tinyInteger, equalsA: NU.Equivalence, F: NU.Equivalence},
      equivalenceLaws<number>,
    )
    const filtered = pipe(unfiltered, filterLaws(/reflexivity/)),
      {laws} = filtered,
      [law] = laws

    test('single', () => {
      expect(laws.length).toBe(1)
    })

    test('correct law', () => {
      expect(law?.name).toBe('reflexivity')
    })

    testLaws(filtered)

    describe('deep', () => {
      const filtered = pipe(
          unfiltered,
          filterLawsDeep(/reflexivity/),
          LawSet,
        )('parent'),
        laws = filtered.sets[0]?.laws,
        [law] = laws ?? []

      test('single', () => {
        expect(laws?.length).toBe(1)
      })

      test('correct law', () => {
        expect(law?.name).toBe('reflexivity')
      })

      testLaws(filtered)
    })
  })
})
