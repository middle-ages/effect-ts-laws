<h1 align='center' style='border: 0px !important'>⚖ effect-ts-laws</h1>

<h3 align='center' style='border: 0px !important'>
  Law Testing for
  <code style='color:#555'>effect-ts</code>
  Instances
</h3>

A library for testing [effect-ts](https://github.com/Effect-ts/effect)
typeclass laws using
[fast-check](https://github.com/dubzzz/fast-check). API is
[documented here](https://middle-ages.github.io/effect-ts-laws-docs/).

1. [About](#about)
2. [Limitations](#limitations)
3. [More Information](#more-information)
4. [Based Upon](#based-upon)
5. [See Also](#see-also)

<h2>Synopsis</h2>

<details><summary style='background:#f0f6ff'>Introductory Examples <span style='float: right'>👈 <i>click</i></span></summary>

---

You wrote a new data type: `MyTuple`, and an instance of the effect-ts
`Covariant` typeclass. Lets test it for free:

```ts
import {Covariant as CO, Invariant as IN} from '@effect/typeclass'
import {Array as AR} from 'effect'
import {dual} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {testTypeclassLaws} from '../src/index.js'

describe('MyTuple', () => {
  type MyTuple<A> = [A]

  interface MyTupleTypeLambda extends TypeLambda {
    readonly type: MyTuple<this['Target']>
  }

  const map: CO.Covariant<MyTupleTypeLambda>['map'] = dual(
    2,
    <A, B>([a]: MyTuple<A>, ab: (a: A) => B): MyTuple<B> => [ab(a)],
  )

  // The instance we want to test
  const Covariant: CO.Covariant<MyTupleTypeLambda> = {
    map,
    imap: CO.imap<MyTupleTypeLambda>(map),
  }

  testTypeclassLaws(
    {Invariant, Covariant},
    {getEquivalence: AR.getEquivalence, getArbitrary: fc.tuple},
  )
})
```

`fast-check` will try to find a counter example that breaks the laws. If no such
example is found, you should see:

<img src='docs/synopsis-tuple.png' alt='synopsis output' width=100%>

---

Run the typeclass law tests on the `Order` and `Monad` instances of the
effect-ts `Option` data type:

```ts
import {Monad} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import {Arbitraries, monoOrder, testTypeclassLaws} from 'effect-ts-laws'

describe('@effect/typeclass/data/Option', () => {
  testTypeclassLaws(
    {Order: OP.getOrder(monoOrder), Monad},
    {getEquivalence: OP.getEquivalence, getArbitrary: Arbitraries.option},
  )
})
```

_Vitest reporter_ shows law test results for the `Option` data type:

<img src='docs/synopsis-option.png' alt='synopsis output' width=90%>

</details>

## About

Law testing is useful when you are building your own data types and their
associated `effect-ts` instances. Law tests help you verify your instances are
lawful. This is a library of the `effect-ts` typeclass laws, and some law
testing infrastructure.

The implementation features:

* `effect-ts` Data Type Tests. Because:
  * It could help `effect-ts`.
  * Serves as an excellent _self-test_ suite.
  * See [status](#status) for details on what is ready.
* _Randomness_. Uses `fast-check` property testing. For
  _parameterized type_ typeclass laws, all functions are randomly generated as
  well.
* Minimal work to test instances for your own data types: it can all be
  done with single function that takes the instances under test and
  a pair of functions: `getEquivalence` and `getArbitrary`.
  * Lovely test coverage for the price of writing two functions. You
    probably have them somewhere already.
* Excellent tests and reasonable documentation.  

API is [documented here](https://middle-ages.github.io/effect-ts-laws-docs/).

# Status

<details><summary style='background:#f0f6ff'>Coverage Matrix <span style='float: right'>👈 <i>click</i></span></summary>

---

Matrix showing _data-types_ (in columns) vs. _typeclass law tests_ (in rows).
Each intersection of data type and typeclass can be either:
**ready** (✅), **not ready** (❌), or **not relevant** (☐). First data row
show the _typeclass laws_ implementation status, and first data column shows
_data type tests_ implementation status.

|           | Typeclass→ |     | Equivalence | Order | Semigroup | Monoid | Invariant | Covariant | Applicative | Monad | Traversable |
| --------- | ---------- | --- | ----------- | ----- | --------- | ------ | --------- | --------- | ----------- | ----- | ----------- |
|           |            |     | ✅           | ✅     | ✅         | ✅      | ✅         | ✅         | ✅           | ✅     | ❌           |
|           |            |     |             |       |           |        |           |           |             |       |             |
| **↓Data** |            |     |             |       |           |        |           |           |             |       |             |
| Boolean   | ✅          |     | ✅           | ✅     | ✅         | ✅      | ☐         | ☐         | ☐           | ☐     | ☐           |
| Number    | ✅          |     | ✅           | ✅     | ✅         | ✅      | ☐         | ☐         | ☐           | ☐     | ☐           |
| String    | ✅          |     | ✅           | ✅     | ✅         | ✅      | ☐         | ☐         | ☐           | ☐     | ☐           |
| BigInt    | ✅          |     | ✅           | ✅     | ✅         | ✅      | ☐         | ☐         | ☐           | ☐     | ☐           |
| Duration  | ✅          |     | ✅           | ✅     | ✅         | ✅      | ☐         | ☐         | ☐           | ☐     | ☐           |
| DateTime  | ✅          |     | ✅           | ✅     | ☐         | ☐      | ☐         | ☐         | ☐           | ☐     | ☐           |
| Identity  | ✅          |     | ☐           | ☐     | ☐         | ☐      | ✅         | ✅         | ✅           | ✅     | ❌           |
| Option    | ✅          |     | ✅           | ✅     | ✅         | ✅      | ✅         | ✅         | ✅           | ✅     | ❌           |
| Either    | ✅          |     | ✅           | ☐     | ☐         | ☐      | ✅         | ✅         | ✅           | ✅     | ❌           |
| Array     | ✅          |     | ✅           | ✅     | ✅         | ✅      | ✅         | ✅         | ✅           | ✅     | ❌           |
| Struct    | ❌          |     | ❌           | ❌     | ❌         | ❌      | ❌         | ❌         | ❌           | ❌     | ❌           |
| Record    | ❌          |     | ❌           | ❌     | ❌         | ❌      | ❌         | ❌         | ❌           | ❌     | ❌           |
| Effect    | ❌          |     | ❌           | ❌     | ❌         | ❌      | ❌         | ❌         | ❌           | ❌     | ❌           |

</details>

## Limitations

1. Very early release.
2. Ignorant of typeclass hierarchy. You must flatten your typeclass hierarchy
   manually. The
   [diagrams here](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
   should help.
3. Testing multiple instances of same data type, for example for `sum` and
   `multiply` monoids, is not as simple as it could be.

## More Information

* [API documentation](https://middle-ages.github.io/effect-ts-laws-docs/).
* `README` at [the laws for typeclasses](src/laws/typeclass/concrete/README.md) on concrete types.
* `README` at [the laws for typeclasses](src/laws/typeclass/parameterized/README.md) on parameterized types.
* `README` at the typeclass laws [self-tests](tests/laws/typeclass/README.md).

## Based Upon

1. [fp-ts-laws](https://gcanti.github.io/fp-ts-laws) by
   [Giulio Canti](https://github.com/gcanti)
2. Scala's [Discipline](https://typelevel.org/cats/typeclasses/lawtesting.html)

## See Also

1. [fast-check](https://github.com/dubzzz/fast-check)
2. [effect-ts](https://github.com/Effect-ts/effect)

<style>
  summary:hover { background: #e0edf8 !important }
</style>
