import type {SuiteAPI, TestAPI} from 'vitest'
import {describe, test} from 'vitest'
import type {LawSet, ParameterOverrides} from '../law.js'
import {lawSetTests} from '../law.js'
import {testLawWith} from './testLaw.js'

export const testLawsWith =
  (
    suiteApi: SuiteAPI | (typeof describe)['only'],
    testApi: TestAPI | (typeof test)['only'],
  ) =>
  ({name = '', sets, laws}: LawSet, parameters?: ParameterOverrides): void => {
    if (laws.length === 0 && sets.length === 0) return

    const run = () => {
      for (const lawSet of sets) testLaws(lawSet, parameters)

      for (const law of laws)
        testLawWith(testApi)({
          ...law,
          parameters: {...law.parameters, ...parameters},
        })
    }

    if (name === '') run()
    else suiteApi(name, run)
  }

/**
 * Attempts to find a counterexample for a {@link law.LawSet | LawSet}.
 *
 * Meant to be called from inside a `vitest` test suite, perhaps inside some
 * `describe()` block, but _not_ inside a `test()` or `it()` block.
 *
 * Test results for the child law tests will be shown grouped per _named_
 * LawSet, with the results of required _LawSets_, if they exist, shown in their
 * own named groups.
 *
 * LawSets that are anonymous, I.e.: the optional `name` property is
 * `undefined` or equal to the empty string, will _not_ appear grouped, and
 * instead will be merged with their siblings. You can add any number of
 * anonymous LawSets to a named LawSet and at any depth, yet the results will
 * appear as if all the law tests are group in a single set of laws.
 *
 * Entries in the optional configuration will override any `fast-check`
 * [parameters](https://fast-check.dev/api-reference/interfaces/Parameters.html)
 * found in the laws.
 *
 * You can use the global configuration feature of fast-check by adding a
 * `vitest.setup.ts` file as described
 * [here](https://fast-check.dev/docs/configuration/global-settings/#vitest).
 *
 * [testLaws.skip](https://vitest.dev/api/#describe-skip),
 * [testLaws.only](https://vitest.dev/api/#describe-only),
 * [testLaws.skipIf](https://vitest.dev/api/#describe-skipif),
 * and [testLaws.runIf](https://vitest.dev/api/#describe-runif)
 * all behave just like their `vitest` counterparts.
 *
 * See also {@link law.checkLaws | checkLaws}.
 * @param lawSet - The set of laws under test.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @property only - Test _only_ this set of laws and no other.
 * @property skip - Skip this set of laws.
 * @property runIf - Test this set of laws only if the condition holds.
 * @property skipIf - Skip this set of laws only if the condition holds.
 * @category vitest
 */
export const testLaws = (() => {
  return Object.assign(
    (lawSet: LawSet, parameters?: ParameterOverrides): void => {
      testLawsWith(describe, test)(lawSet, parameters)
    },
    {
      skip: testLawsWith(describe.skip, test.skip),
      only: testLawsWith(describe.only, test.only),

      skipIf: (condition: unknown) =>
        testLawsWith(describe.skipIf(condition), test.skipIf(condition)),
      runIf: (condition: unknown) =>
        testLawsWith(describe.runIf(condition), test.runIf(condition)),
    },
  )
})()

/**
 * Test a list of `LawSet`s. This is exactly like `testLaws` but accepts
 * a list of `LawSet`s rather than a single one.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const testLawSets =
  (parameters?: ParameterOverrides) =>
  (
    /**
     * The law sets to test.
     */
    ...sets: LawSet[]
  ): void => {
    testLaws(lawSetTests(...sets), parameters)
  }

/**
 * Just like {@link testLaws} except the `fast-check` verbosity flag is turned
 * on so that law _notes_ will be shown with test results.
 * @param lawSet - Laws to test.
 * @param parameters - Optional runtime `fast-check` parameters.
 * @category vitest
 */
export const verboseLaws = (
  lawSet: LawSet,
  parameters?: ParameterOverrides,
): void => {
  testLaws(lawSet, {...parameters, verbose: true})
}
