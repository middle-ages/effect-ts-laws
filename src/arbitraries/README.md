<h1 style='text-align:center'>Arbitraries</h1>

`fast-check` arbitraries for `effect-ts` data types.

## [Data](./data.ts)

| Name        | Signature                                                      |
| ----------- | -------------------------------------------------------------- |
| tinyInteger | `Arbitrary<number>`                                            |
| option      | `(a: Arbitrary<A>) ⇒ Arbitrary<Option<A>>`                     |
| either      | `(e: Arbitrary<E>, a: Arbitrary<A>) ⇒ Arbitrary<Either<A, E>>` |

## [Time](./time.ts)

| Name           | Signature                                                     |
| -------------- | ------------------------------------------------------------- |
| duration       | `(constraints?: IntegerConstraints) ⇒ Arbitrary<Duration>`    |
| offsetTimezone | `Arbitrary<DateTime.Timezone.Offset>`                         |
| utc            | `(constraints: DateConstraints<E>) ⇒ Arbitrary<DateTime.Utc>` |

## [Function](./function.ts)

| Name          | Signature                                                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| unaryFunction | `<A>() ⇒ (b: Arbitrary<B>) ⇒ Arbitrary<(a: A) ⇒ B>`                                                                                                                               |
| unaryKleisli  | `<A>() ⇒ <F extends TypeLambda, In1, Out2, Out1>(getArbitrary: LiftArbitrary<F, In1, Out2, Out1>) ⇒ <B>(b: fc.Arbitrary<B>): fc.Arbitrary<(a: A) => Kind<F, In1, Out2, Out1, B>>` |
| predicate     | `<A>() ⇒ Arbitrary<Predicate<A>>`                                                                                                                                                 |
