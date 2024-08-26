<h1 align='center' style='border: 0px !important'>
  ⚖
  <code style='color:#555'>️ effect-ts-laws</code>
</h1>

<h3 align='center' style='border: 0px !important'>
  Law Testing for
  <code style='color:#555'>effect-ts</code>
  Instances
</h3>

A library for testing [effect-ts](https://github.com/Effect-ts/effect)
typeclass laws using
[fast-check](https://github.com/dubzzz/fast-check).

1. [Synopsis](#synopsis)
2. [About](#about)
3. [Using](#using)
4. [Limitations](#limitations)
5. [Based Upon](#based-upon)

## Synopsis

Run typeclass law tests on  `effect-ts` function `Array.map`
for numeric arrays:

```ts
import {Number, Array} from 'Effect'
import {ArrayTypeLambda, Covariant} from '@Effect/typeclass/Covariant'
import {testLaws, covariant} from 'effect-ts-laws/typeclass'

const laws: Laws<Covariant<ArrayTypeLambda>> = covariant('Array')(
                          // Provide a name for test labels ⬏
  Covariant,              // The Covariant instance we are testing.
  fc.array(fc.integer()), // Arbitrary required for Covariant laws.
  Array.getEquivalence,   // Equivalence is also required.
)(
  Number.Increment,       // A pair of functions are required. Their
  Number.multiply(10),    // types must match the given arbitrary.
  Number.Equivalence,     // Finally, Equivalence for underlying type.
)

describe('Array instance Covariant laws', () => {
  testLaws(laws)
})
```

When run would show:

<pre style='background:black;color:#eee'>
<font color='green'>✓</font> Covariant.identity    ≡ ∀ a ∈ Array: a ▹ map(I) = a ▹ I
<font color='green'>✓</font> Covariant.composition ≡ ∀ a ∈ Array: a ▹ map(f₁ ∘ f₂) = a ▹ map(f₁) ∘ map(f₂)
</pre>

Showing the the pair of functor laws passed.

## About

Law testing is useful when you are building your own data types and their
associated `effect-ts` instances. Law tests help you verify your instances are
lawful. This library includes most of the laws associated with the `effect-ts`
typeclasses so you can easily test your own instances.

Other features:

1. A test suite for most of `effect-ts` built-in instances.
2. Reusable `fast-check` properties for functions and relations, including
   `Injective`, `Surjective`, `Bijective`, `Reflexive`, `Symmetric`,
   and more. The full list is here: Algebraic Properties
3. Examples of creating lawful instances for your data types
   and of using algebraic property tests for free testing
   of a simple web application.

## Using

<font color='red'>TODO</font>:

1. Importing
2. API docs
3. Examples

## Limitations

1. Ignorant of typeclass hierarchy.
2. Laws for typeclasses on
   [parameterized types](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
   all run on a single underlying value type: `readonly number[]`. This means,
   for example, that when your `map` function is tested, the function it is
   given is of type
   `(a: readonly number[]) ⇒ readonly number[]`. The code supports setting exact
   types if you need them, so you can for example test your `map` function using
   a function of type `(a: RegExp) ⇒ boolean` by building the laws with your own
   functions. See [the example](./examples) if for are working untyped maybe
3. The code lets you test with any

## Based Upon

1. [fp-ts-laws](https://gcanti.github.io/fp-ts-laws) by
   [Giulio Canti](https://github.com/gcanti)
2. Scala's [Discipline](https://typelevel.org/cats/typeclasses/lawtesting.html)

eeeeeeeeeee

1. [fast-check](https://github.com/dubzzz/fast-check)
2. [effect-ts](https://github.com/Effect-ts/effect)

run laws on your own data

Typeclasses

Data Types


ts-fp typelevel thingy

let user format the bad examples of their data type