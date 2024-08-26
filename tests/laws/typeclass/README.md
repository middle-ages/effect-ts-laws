# Self-Tests for the Typeclass Laws

For each typeclass we test:

1. The laws pass on some well tested instance, such as `ReadonlyArray<number>`.
2. The conjunction of the law predicates passes.
3. Bad instances fail.

For example the [Monad typeclass laws self-test](./Monad.spec.ts) tests:

1. `ReadonlyArray<number>` passes the laws.
2. It also passes the predicates of the laws.
3. A bad instance fails the laws.

Bad instances are easy to create, for example for the test described above, we
setup `flatMap` to fail the `identity` tests:

```ts
import {Monad as arrayMonad} from '@effect/typeclass/data/Array'

const badInstance = {
  ...arrayMonad,
  flatMap: dual(2, flow(AR.flatMap, AR.drop(1))),
}
 
```
