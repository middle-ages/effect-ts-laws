import type {TestAPI} from 'vitest'
import {test} from 'vitest'
import type {Law, UnknownArgs} from '../law.js'
import {asAssert} from '../law.js'

/**
 * @internal
 */
export const testLawWith =
  (testApi: TestAPI | (typeof test)['only']) =>
  <Ts extends UnknownArgs>(law: Law<Ts>): void => {
    const {note, parameters} = law

    const suffix =
      (parameters?.verbose ?? false) && note !== '' ? `: ${note}` : ''

    testApi(law.name + suffix, () => {
      asAssert(law)
    })
  }

/**
 * Attempts to find a counterexample for the single given {@link law.Law | Law}.
 *
 * Meant to be called from inside a `Vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()`/`it()` block.
 *
 * [testLaw.skip](https://vitest.dev/api/#test-skip),
 * [testLaw.only](https://vitest.dev/api/#test-only),
 * [testLaw.skipIf](https://vitest.dev/api/#test-skipif),
 * and [testLaw.runIf](https://vitest.dev/api/#test-runif)
 * all behave just like their `vitest` counterparts.
 *
 * See also {@link law.checkLaw | checkLaw}.
 * @typeParam Ts - Tuple of types for law predicate arguments.
 * @param law - Law under test.
 * @property only - Run _only_ this law test and no other.
 * @property skip - Skip this law test.
 * @property runIf - Run this law test only if the condition holds.
 * @property skipIf - Skip this law test only if the condition holds.
 * @category vitest
 */
export const testLaw = (() => {
  return Object.assign(
    <Ts extends UnknownArgs>(law: Law<Ts>): void => {
      testLawWith(test)(law)
    },
    {
      skip: testLawWith(test.skip),
      only: testLawWith(test.only),

      skipIf: (condition: unknown) => testLawWith(test.skipIf(condition)),
      runIf: (condition: unknown) => testLawWith(test.runIf(condition)),
    },
  )
})()
