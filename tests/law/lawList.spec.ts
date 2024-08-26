import {lawTest, lawTests, testLaws} from 'effect-ts-laws'
import fc from 'fast-check'

const int = fc.integer({min: 1, max: 100})

describe('lawList', () => {
  testLaws(
    lawTests(
      [
        lawTest(
          'law₁',
          (x: number) => x === x,
          '∀n ∈ ℕ: n=n',
        )([int], {verbose: true}),

        lawTest('law₂', (x: number) => x <= x, '∀n ∈ ℕ: n≤n')([int]),
      ],
      'some unit under test',
    ),
  )
})
