import type {Schema} from 'effect'
import type {ParameterOverrides} from '../law.js'
import {schemaLaws} from '../laws.js'
import {testLaws} from './testLaws.js'

/**
 * Run the given schema through the schema law tests.
 * @category vitest
 */
export const testSchemaLaws =
  (parameters?: ParameterOverrides) =>
  <A, I>(schema: Schema.Schema<A, I>) => {
    testLaws(schemaLaws(schema), parameters)
  }
