import {Equivalence as EQ, FastCheck, pipe, Schema} from 'effect'
import {checkLaws, schemaLaws} from 'effect-ts-laws'
import {testSchemaLaws} from 'effect-ts-laws/vitest'

describe('schema laws self-tests', () => {
  // String equality that understand integer equivalences such as
  // ('+01' === ' 1.0 '), ('NaN' === 'NaN'.), and ('1e1' === '0xA').
  const equivalence = (): EQ.Equivalence<string> => (self, that) =>
    self === that ||
    parseInt(self) === parseInt(that) ||
    parseFloat(self) === parseFloat(that) ||
    (isNaN(parseInt(self)) && isNaN(parseInt(that)))

  describe('Person example', () => {
    // A random string OR a natural number encoded as a string.
    const arbitrary = () => (fc: typeof FastCheck) =>
      fc.oneof(
        fc.string(),
        fc.nat().map(n => n.toString()),
      )

    const Age: Schema.Schema<number, string> = pipe(
      Schema.String.annotations({equivalence, arbitrary}),
      Schema.parseNumber,
      Schema.int(),
      Schema.positive(),
    )

    // Here “age” is of type number.
    interface Person extends Schema.Schema.Type<typeof _Person> {}

    // But here “age” is of type string.
    interface PersonEncoded extends Schema.Schema.Encoded<typeof _Person> {}

    const _Person = Schema.Struct({name: Schema.String, age: Age})

    const Person: Schema.Schema<Person, PersonEncoded> = _Person

    testSchemaLaws()(Person)
  })

  test('Bad decoder', () => {
    // This schema passes `decode encoded identity` but fails `encode decoded
    // identity`.
    //
    // This law is tested by decoding an arbitrary string and then encoding it,
    // expecting this to result in either a parse fail or an identity.
    //
    // Counterexample (note space after the four digit):
    //
    // (arbitrary string=“4 ”) --decode-→ 4 --encode-→ "4"
    //
    // But this is a string inequality: “4 ”≠“4”, so the law fails.
    //
    // This fault model is not tested by the `decode encoded identity` law,
    // so it passes oblivious to the problem.

    const Age = Schema.transform(
      Schema.String,
      Schema.Int.pipe(Schema.positive()),
      {
        strict: true,
        decode: s => parseInt(s),
        encode: n => n.toString(),
      },
    )

    interface Person extends Schema.Schema.Type<typeof _Person> {}
    interface PersonEncoded extends Schema.Schema.Encoded<typeof _Person> {}
    const _Person = Schema.Struct({name: Schema.String, age: Age})
    const Person: Schema.Schema<Person, PersonEncoded> = _Person

    // We expect the counterexample to fail
    const errors = checkLaws(schemaLaws(Person), {
      numRuns: 1,
      seed: -1512491049,
      path: '38',
    })

    expect(errors, 'correct error count').toHaveLength(1)
    expect(errors[0], 'broken law name is mentioned').toMatch(
      /encode decoded identity/,
    )
  })
})
