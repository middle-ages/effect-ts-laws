<h1 align='center' style='border: 0px !important'>⚖ effect-ts-laws</h1>

<h3 align='center' style='border: 0px !important'>
  Law Testing for
  <code style='color:#555'>effect-ts</code>
  Instances
</h3>

A library for testing [effect-ts](https://github.com/Effect-ts/effect)
typeclass laws using
[fast-check](https://github.com/dubzzz/fast-check). API is
[documented here](https://middle-ages.github.io/effect-ts-laws-docs/),
and the laws are
[listed here](https://middle-ages.github.io/effect-ts-laws-docs/catalog-of-laws.html).

1. [About](#about)
   1. [Synopsis](#synopsis)
   2. [Overview](#overview)
2. [Usage](#usage)
3. [Project](#project)
   1. [Status](#status)
   2. [More Information](#more-information)
   3. [Open Questions](#open-questions)
   4. [Roadmap](#roadmap)
4. [See Also](#see-also)
   1. [Based On](#based-on)

## About

### Synopsis

Run all typeclass law tests relevant to the effect-ts `Option` datatype:

```ts
import {Alternative, Applicative, getOptionalMonoid, Monad, Traversable} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import {monoEquivalence, monoOrder, monoSemigroup, option} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {OptionTypeLambda} from 'effect/Option'

describe('@effect/typeclass/data/Option', () => {
  testTypeclassLaws<OptionTypeLambda>({
    getEquivalence: OP.getEquivalence,
    getArbitrary: option,
  })({
    Alternative,
    Applicative,
    Equivalence: OP.getEquivalence(monoEquivalence),
    Monad,
    Monoid: getOptionalMonoid(monoSemigroup),
    Order: OP.getOrder(monoOrder),
    Traversable,
  })
})
```

_Vitest reporter_ shows test results for the `Option` datatype:

<a href="./docs/synopsis-option.png"><img src='docs/synopsis-option.png' alt='synopsis output' width=300></a>

---

<details><summary style='background:#f0f6ff;color:blue;cursor:pointer'>New datatype example.<span style='float: right'>👈 <i>click</i></span></summary>
<br/>

You wrote a new datatype: `MyTuple`, and an instance of the effect-ts
`Covariant` typeclass. Lets test it for free:

```ts
import {Covariant as CO} from '@effect/typeclass'
import {Array as AR} from 'effect'
import {dual} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'

describe('MyTuple', () => {
  type MyTuple<A> = [A]

  interface MyTupleTypeLambda extends TypeLambda {
    readonly type: MyTuple<this['Target']>
  }

  const map: CO.Covariant<MyTupleTypeLambda>['map'] = dual(
    2,
    <A, B>([a]: MyTuple<A>, ab: (a: A) => B): MyTuple<B> => [ab(a)],
  )
  const Covariant: CO.Covariant<MyTupleTypeLambda> = {
    imap: CO.imap<MyTupleTypeLambda>(map),
    map,
  }

  testTypeclassLaws<MyTupleTypeLambda>({
    getEquivalence: AR.getEquivalence,
    getArbitrary: fc.tuple,
  })({Covariant})
})
```

`fast-check` will try to find a counter example that breaks the laws. Because
it is quite impossible to find one in this case you should see:

<a href="./docs/synopsis-tuple.png"><img src='docs/synopsis-tuple.png' alt='synopsis output' width=400></a>

---

</details>

### Overview

Law testing is useful when you are building your own datatype and its
associated `effect-ts` instances. Law tests help you verify your instances are
lawful. This is a library of the `effect-ts` typeclass laws, and some law
testing infrastructure.

The implementation features:

* `effect-ts` datatype typeclass law tests. Because:
  * It could help `effect-ts`.
  * Serves as an excellent _self-test_ suite and as an example for testing your
    own instances.
  * See [status](https://docs.google.com/spreadsheets/d/171O4wzY4TrdRvecFdv83echR7PSal0gejmEqLZWUB6w/edit?usp=sharing) for details on what is ready.
* _Randomness_. Uses `fast-check` property testing. For
  _parameterized type_ typeclass laws, all functions are randomly generated as
  well.
* Minimal work to test instances for your own datatype: it can all be
  done with single function that takes the instances under test and
  a pair of functions: `getEquivalence` and `getArbitrary`.
  * Meaningful test coverage improvement for the price of writing two functions.
    You probably have them somewhere already.

## Usage

To install, replace `pnpm` with your package manager:

```sh
# Peer dependencies:
pnpm i effect-ts @effect/typeclass
pnpm i -D vitest fast-check @fast-check/vitest

# Install effect-ts-laws
pnpm i -D effect-ts-laws
```

API is [documented here](https://middle-ages.github.io/effect-ts-laws-docs/).

## Project

### Status

Matrix showing _data-types_ (in columns) vs. _typeclass law tests_ (in rows).
Each intersection of datatype and typeclass can be either:
**ready** (✅), **not ready** (❌), or **not relevant** (☐). First data row
show the _typeclass laws_ implementation status, and first data column shows
_datatype tests_ implementation status. Note `Equivalence` and `Order` are
both typeclasses _and_ datatypes. You can also view this in [an online
spreadsheet](https://docs.google.com/spreadsheets/d/171O4wzY4TrdRvecFdv83echR7PSal0gejmEqLZWUB6w/edit?usp=sharing).

|     |                                                    | Typeclass→ |     | [Equivalence](./src/laws/typeclass/concrete/Equivalence.ts) | [Order](./src/laws/typeclass/concrete/Order.ts) | [Bounded](./src/laws/typeclass/concrete/Bounded.ts) | [Semigroup](./src/laws/typeclass/concrete/Semigroup.ts) | [Monoid](./src/laws/typeclass/concrete/Monoid.ts) | [Invariant](./src/laws/typeclass/parameterized/Invariant.ts) | [Contravariant](./src/laws/typeclass/parameterized/Contravariant.ts) | [Covariant](./src/laws/typeclass/parameterized/Covariant.ts) | [SemiAlternative](./src/laws/typeclass/parameterized/SemiAlternative.ts) | [Alternative](./src/laws/typeclass/parameterized/Alternative.ts) | [Applicative](./src/laws/typeclass/parameterized/Applicative.ts) | [Monad](./src/laws/typeclass/parameterized/Monad.ts) | [Bicovariant](./src/laws/typeclass/parameterized/Bicovariant.ts) | [Traversable](./src/laws/typeclass/parameterized/Traversable.ts) | Foldable |
| --- | -------------------------------------------------- | ---------- | --- | ----------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
|     |                                                    |            |     | ✅                                                           | ✅                                               | ✅                                                   | ✅                                                       | ✅                                                 | ✅                                                            | ✅                                                                    | ✅                                                            | ✅                                                                        | ✅                                                                | ✅                                                                | ✅                                                    | ✅                                                                | ✅                                                                | ❌        |
|     |                                                    |            |     |                                                             |                                                 |                                                     |                                                         |                                                   |                                                              |                                                                      |                                                              |                                                                          |                                                                  |                                                                  |                                                      |                                                                  |                                                                  |          |
|     | **↓Datatype**                                      |            |     |                                                             |                                                 |                                                     |                                                         |                                                   |                                                              |                                                                      |                                                              |                                                                          |                                                                  |                                                                  |                                                      |                                                                  |                                                                  |          |
| 1.  | [Array](./tests/effect-ts/Array.spec.ts)           | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ✅                                                       | ✅                                                 | ✅                                                            | ☐                                                                    | ✅                                                            | ☐                                                                        | ☐                                                                | ✅                                                                | ✅                                                    | ☐                                                                | ✅                                                                | ❌        |
| 2.  | [BigDecimal](./tests/effect-ts/BigDecimal.spec.ts) | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ☐                                                       | ☐                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 3.  | [BigInt](./tests/effect-ts/BigInt.spec.ts)         | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ✅                                                       | ✅                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 4.  | [Boolean](./tests/effect-ts/Boolean.spec.ts)       | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ✅                                                       | ✅                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 5.  | [Cause](./tests/effect-ts/Cause.spec.ts)           | ✅          |     | ☐                                                           | ☐                                               | ☐                                                   | ☐                                                       | ☐                                                 | ✅                                                            | ✅                                                                    | ✅                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 6.  | [DateTime](./tests/effect-ts/DateTime.spec.ts)     | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ☐                                                       | ☐                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 7.  | [Duration](./tests/effect-ts/Duration.spec.ts)     | ✅          |     | ✅                                                           | ✅                                               | ✅                                                   | ✅                                                       | ✅                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 8.  | Effect                                             | ❌          |     | ❌                                                           | ❌                                               | ☐                                                   | ❌                                                       | ❌                                                 | ❌                                                            | ☐                                                                    | ❌                                                            | ☐                                                                        | ☐                                                                | ❌                                                                | ❌                                                    | ☐                                                                | ❌                                                                | ❌        |
| 9.  | [Either](./tests/effect-ts/Either.spec.ts)         | ✅          |     | ✅                                                           | ☐                                               | ☐                                                   | ☐                                                       | ☐                                                 | ✅                                                            | ☐                                                                    | ✅                                                            | ✅                                                                        | ☐                                                                | ✅                                                                | ✅                                                    | ✅                                                                | ✅                                                                | ❌        |
| 10. | Equivalence                                        | ❌          |     | ☐                                                           | ☐                                               | ☐                                                   | ☐                                                       | ☐                                                 | ❌                                                            | ❌                                                                    | ❌                                                            | ☐                                                                        | ☐                                                                | ❌                                                                | ❌                                                    | ☐                                                                | ❌                                                                | ❌        |
| 11. | [Identity](./tests/effect-ts/Identity.spec.ts)     | ✅          |     | ☐                                                           | ☐                                               | ☐                                                   | ☐                                                       | ☐                                                 | ✅                                                            | ☐                                                                    | ✅                                                            | ☐                                                                        | ☐                                                                | ✅                                                                | ✅                                                    | ☐                                                                | ✅                                                                | ❌        |
| 12. | [List](./tests/effect-ts/List.spec.ts)             | ✅          |     | ✅                                                           | ❌                                               | ☐                                                   | ❌                                                       | ❌                                                 | ✅                                                            | ☐                                                                    | ✅                                                            | ☐                                                                        | ☐                                                                | ❌                                                                | ✅                                                    | ☐                                                                | ❌                                                                | ❌        |
| 13. | [Number](./tests/effect-ts/Number.spec.ts)         | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ✅                                                       | ✅                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 14. | [Option](./tests/effect-ts/Option.spec.ts)         | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ✅                                                       | ✅                                                 | ✅                                                            | ☐                                                                    | ✅                                                            | ✅                                                                        | ✅                                                                | ✅                                                                | ✅                                                    | ☐                                                                | ✅                                                                | ❌        |
| 15. | Order                                              | ❌          |     | ☐                                                           | ☐                                               | ☐                                                   | ☐                                                       | ☐                                                 | ❌                                                            | ❌                                                                    | ❌                                                            | ☐                                                                        | ☐                                                                | ❌                                                                | ❌                                                    | ☐                                                                | ❌                                                                | ❌        |
| 16. | [Predicate](./tests/effect-ts/Predicate.spec.ts)   | ✅          |     | ☐                                                           | ☐                                               | ☐                                                   | ✅                                                       | ✅                                                 | ✅                                                            | ✅                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 17. | [Record](./tests/effect-ts/Record.spec.ts)         | ✅          |     | ✅                                                           | ☐                                               | ☐                                                   | ☐                                                       | ☐                                                 | ✅                                                            | ☐                                                                    | ✅                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ✅                                                                | ☐        |
| 18. | [String](./tests/effect-ts/String.spec.ts)         | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ✅                                                       | ✅                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 19. | [Struct](./tests/effect-ts/Struct.spec.ts)         | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ☐                                                       | ☐                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ☐                                                                | ☐                                                                | ☐        |
| 20. | [Tuple](./tests/effect-ts/Tuple.spec.ts)           | ✅          |     | ✅                                                           | ✅                                               | ☐                                                   | ☐                                                       | ☐                                                 | ☐                                                            | ☐                                                                    | ☐                                                            | ☐                                                                        | ☐                                                                | ☐                                                                | ☐                                                    | ✅                                                                | ☐                                                                | ☐        |

### More Information

* [API documentation](https://middle-ages.github.io/effect-ts-laws-docs/).
* [Catalog of laws](https://middle-ages.github.io/effect-ts-laws-docs/catalog-of-laws.html).
* `README` for the [arbitraries](src/arbitrary/README.md) included.
* `README` at [the laws for typeclasses](src/laws/typeclass/concrete/README.md) on concrete types.
* `README` at [the laws for typeclasses](src/laws/typeclass/parameterized/README.md) on parameterized types.
* `README` at the typeclass laws [self-tests](tests/laws/typeclass/README.md).

### Open Questions

1. Rename to zio-style names? E.g.: `traverse` laws become `foreach` laws?
2. Match the typeclass graph of effect-ts more accurately? E.g.: split
   `Product` laws out of `Applicative`.
3. What is the role of _typeclass laws_ in `effect-ts` where _typeclasses_
   are deemphasized?

### Roadmap

* Tests
  * [ ] More datatypes.
  * [ ] Bicovariant should do Invariant laws twice.
  * [ ] Schema decode/encode laws
  * [ ] Sink Contravariant laws

* Harness
  * [ ] API should let you use any catalog

* Composition
  * [ ] Test composition flipped.
  * [ ] Compose arbitrary instances in composition tests.
  * [ ] Nest three levels.
  * [ ] Brand composition: refine(b₂) ∘ refine(b₁) = refine.all(b₁, b₂).

* Arbitraries
  * [ ] `oneof` arbitrary chosen from built-in instances.

## See Also

1. [fast-check](https://github.com/dubzzz/fast-check)
2. [effect-ts](https://github.com/Effect-ts/effect)
3. [zio-prelude](https://github.com/zio/zio-prelude/tree/series/2.x/laws/shared/src/main/scala/zio/prelude/laws) laws
4. On the [importance of typeclass laws](https://degoes.net/articles/principled-typeclasses#laws)

### Based On

1. [fp-ts-laws](https://gcanti.github.io/fp-ts-laws) by
   [Giulio Canti](https://github.com/gcanti)
2. Scala's [Discipline](https://typelevel.org/cats/typeclasses/lawtesting.html)
