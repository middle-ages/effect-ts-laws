# Vitest Runners

Execute law tests of various kinds through the [Vitest test
runner](https://vitest.dev/). This is the top-level API for running law tests,
and is the API you would normally use for running them.

## Callflow

Callflow When the [Boolean data type](/tests/effect-ts/Boolean.spec.ts) test
suite tests the [Equivalence typeclass laws](/src/laws/typeclass/concrete/Equivalence.ts):

### 1. [Boolean data type suite](/tests/effect-ts/Boolean.spec.ts)

Tests the [Order typeclass
laws](/src/laws/typeclass/concrete/Order.ts) on an `Order<boolean>`:

1. Build a `ConcreteGiven<BooleanTypeLambda, Boolean>` as a record:
    1. Under the key `Order`, an instance of `Order<A>` for `boolean`. This is
      instance under test, and it will be known by the name _Order_.
    2. Under the key `Equivalence`, an instance of `Equivalence<A>` for
       `boolean`. This is always required by the assertion mechanism, regardless
       of the typeclass under test.
    3. Under the key `a` an `Arbitrary<boolean>` that will generate the booleans
       provided to law predicates.
2. Test the typeclass laws by sending the `ConcreteGiven` to
   `testConcreteTypeclassLaws`.

### 2. [`testConcreteTypeclassLaws`](/src/vitest/concrete.ts)

1. Compute the `LawSet` for the tests by sending the `ConcreteGiven` to
   `buildConcreteTypeclassLaws`. This returns a list of `LawSet`.
2. Test the sets that were computed using `testLawSets`, which simply runs the
   predicates and reports results to vitest.

### 3. [`buildConcreteTypeclassLaws`](/src/laws/typeclass/concrete/catalog.ts)

Iterates on the typeclasses under test, collecting the results of calling
the `LawSet` of each typeclass under test with the `ConcreteGiven` argument.
Return the collected `LawSet`.

The `LawSet` of each typeclass is accessed from the typeclass map: a simple
record mapping _name_ ⇒ _typeclass instance_.
