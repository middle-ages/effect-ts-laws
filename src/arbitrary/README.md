<h1 style='text-align:center'>Arbitrary</h1>

`fast-check` arbitraries and combinators for `effect-ts` datatypes.

## [Data](./data.ts)

| Name             | Signature                                           |                                           |                           |
| ---------------- | --------------------------------------------------- | ----------------------------------------- | ------------------------- |
| tinyInteger      |                                                     |                                           | `Arbitrary<number>`       |
| tinyArray        | `<A>(a: Arbitrary<A>)`                              | <span style='font-family: serif'>⇒</span> | `Arbitrary<A[]>`          |
| tinyIntegerArray |                                                     |                                           | `Arbitrary<number[]>`     |
| option           | `<A>(a: Arbitrary<A>)`                              | <span style='font-family: serif'>⇒</span> | `Arbitrary<Option<A>>`    |
| either           | `<A, E>(e: Arbitrary<E>, a: Arbitrary<A>)`          | <span style='font-family: serif'>⇒</span> | `Arbitrary<Either<A, E>>` |
| error            | `(m: Arbitrary<string>)`                            | <span style='font-family: serif'>⇒</span> | `Arbitrary<Error>`        |
| list             | `<A>(a: Arbitrary<A>)`                              | <span style='font-family: serif'>⇒</span> | `Arbitrary<List<A>>`      |
| cause            | `<E>(e: Arbitrary<E>, defect?: Arbitrary<unknown>)` | <span style='font-family: serif'>⇒</span> | `Arbitrary<Cause<E>>`     |

## [Time](./time.ts)

| Name           | Signature                            |                                           |                                       |
| -------------- | ------------------------------------ | ----------------------------------------- | ------------------------------------- |
| offsetTimezone |                                      |                                           | `Arbitrary<DateTime.Timezone.Offset>` |
| duration       | `(constraints?: IntegerConstraints)` | <span style='font-family: serif'>⇒</span> | `Arbitrary<Duration>`                 |
| utc            | `(constraints: DateConstraints<E>)`  | <span style='font-family: serif'>⇒</span> | `Arbitrary<DateTime.Utc>`             |
| zoned          | `(constraints: DateConstraints<E>)`  | <span style='font-family: serif'>⇒</span> | `Arbitrary<DateTime.Zones>`           |

## [Function](./function.ts)

| Name          | Signature                                                                      |                                           |                             |
| ------------- | ------------------------------------------------------------------------------ | ----------------------------------------- | --------------------------- |
| unary         | `<A>() ⇒ (b: Arbitrary<B>)`                                                    | <span style='font-family: serif'>⇒</span> | `Arbitrary<(a: A) ⇒ B>`     |
| unaryToKind   | `<A>() ⇒ <F extends λ>(getArbitrary: LiftArbitrary<F>) ⇒ <B>(b: Arbitrary<B>)` | <span style='font-family: serif'>⇒</span> | `Arbitrary<(a: A) ⇒ F<B>>`  |
| unaryFromKind | `<A, F extends λ>() ⇒ <B>(b: Arbitrary<B>)`                                    | <span style='font-family: serif'>⇒</span> | `Arbitrary<(fa: F<A>) ⇒ B>` |
| unaryInKind   | `<A>() ⇒ <F extends λ>(of: <T>(t: T) ⇒ F<T>) ⇒ <B>(b: Arbitrary<B>)`           | <span style='font-family: serif'>⇒</span> | `Arbitrary<F<(a: A) ⇒ B>>`  |
| predicate     | `<A>()`                                                                        | <span style='font-family: serif'>⇒</span> | `Arbitrary<Predicate<A>>`   |
