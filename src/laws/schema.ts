import {Law, LawSet} from '#law'
import {Arbitrary, Equivalence as EQ, Option as OP, pipe, Schema} from 'effect'
import {constFalse, constTrue} from 'effect/Function'
import fc from 'fast-check'
import {equivalenceLaws} from './typeclass/concrete/Equivalence.js'

/**
 * Build the [@effect/schema](https://effect.website/docs/guides/schema) laws from
 * a schema.
 * @example
 * // Test schema laws are respected in the “Person” schema.
 * import {checkLaws, schemaLaws} from 'effect-ts-laws'
 * import {Schema, Equivalence as EQ, pipe} from 'effect'
 *
 * // String equality that understand integer equivalences such as
 * // ('+01' === ' 1.0 '), ('NaN' === 'NaN'.), and ('1e1' === '0xA').
 * const equivalence: EQ.Equivalence<string> = (self, that) =>
 *   self === that ||
 *   parseInt(self) === parseInt(that) ||
 *   parseFloat(self) === parseFloat(that)
 *
 * const Age: Schema.Schema<number, string> = pipe(
 *   Schema.String.annotations({equivalence: () => equivalence}),
 *   Schema.parseNumber,
 *   Schema.int(),
 *   Schema.positive(),
 * )
 *
 * // Here “age” is of type number.
 * interface Person extends Schema.Schema.Type<typeof _Person> {}
 *
 * // But here “age” is of type string.
 * interface PersonEncoded extends Schema.Schema.Encoded<typeof _Person> {}
 *
 * const _Person = Schema.Struct({name: Schema.String, age: Age})
 *
 * const Person: Schema.Schema<Person, PersonEncoded> = _Person
 *
 * const laws = schemaLaws(Person)
 *
 * console.table(checkLaws(laws))
 * @typeParam A - Decoded type.
 * @typeParam I - Encoded type.
 * @param schema - The schema under test.
 * @returns The schema laws for the given schema.
 * @category schema laws
 */
export const schemaLaws = <A, I>(schema: Schema.Schema<A, I>): LawSet => {
  const [a, equalsA] = [Arbitrary.make(schema), Schema.equivalence(schema)]

  return pipe(
    {a, equalsA, F: equalsA},
    equivalenceLaws,
    LawSet,
  )('Schema', ...encodeDecodeLaws(schema))
}

/**
 * **The Rule of Schemas** from
 * [@effect/schema docs](https://effect.website/docs/guides/schema/introduction#the-rule-of-schemas-keeping-encode-and-decode-in-sync):
 * “…_when you perform both encoding and decoding operations_,
 * _you should end up with the original value_.”
 *
 * The reason we test both ways, I.e.: `encode ∘ decode = identity`
 * _and_`decode ∘ encode = identity` is there are fault models that would be
 * entirely ignored if we only tested one direction. Check the
 * [schema laws self-test](https://github.com/middle-ages/effect-ts-laws/tree/main/tests/laws/schema.spec.ts)
 * for one such example.
 * @typeParam A - Decoded type.
 * @typeParam I - Encoded type.
 * @param schema - The schema under test.
 * @returns The encode and decode laws for the given schema.
 * @category schema laws
 */
export const encodeDecodeLaws = <A, I>(
  schema: Schema.Schema<A, I>,
): [Law<[I]>, Law<[A]>] => {
  const encoded: Schema.Schema<I> = Schema.encodedBoundSchema(schema)

  const [
    [arbitraryEncoded, encodedEquivalence],
    [arbitraryDecoded, decodedEquivalence],
  ] = [project(encoded), project(schema)]

  const [encode, decode]: [
    (decodedElement: A) => OP.Option<I>,
    (encodedElement: I) => OP.Option<A>,
  ] = [Schema.encodeOption(schema), Schema.decodeOption(schema)]

  return [
    Law(
      'encode decoded identity',
      'encode ∘ decode = id',
      arbitraryEncoded,
    )((self: I) =>
      pipe(
        self,
        decode,
        OP.match({
          onNone: constTrue,
          onSome: that =>
            pipe(
              that,
              encode,
              OP.match({
                onNone: constFalse,
                onSome: that => encodedEquivalence(self, that),
              }),
            ),
        }),
      ),
    ),

    Law(
      'decode encoded identity',
      'decode ∘ encode = id',
      arbitraryDecoded,
    )((self: A) =>
      pipe(
        self,
        encode,
        OP.match({
          onNone: constTrue,
          onSome: that =>
            pipe(
              that,
              decode,
              OP.match({
                onNone: constFalse,
                onSome: that => decodedEquivalence(self, that),
              }),
            ),
        }),
      ),
    ),
  ]
}

const project = <A, I>(
  schema: Schema.Schema<A, I>,
): [fc.Arbitrary<A>, EQ.Equivalence<A>] => [
  Arbitrary.make(schema),
  Schema.equivalence(schema),
]
