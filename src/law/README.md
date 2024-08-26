# Law Testing Module

A paper-thin wrapper around the
[fast-check property](https://fast-check.dev/docs/core-blocks/properties/)
abstraction.

## About

These modules add the minimal features required for testing _typeclass_ and
_relation_ laws:

1. `Law ≡ property + assert + test` - running a law will run the
   _fast-check property_ inside an assertion inside
   [a vitest](https://vitest.dev/guide/features.html)
   `test(() => {...})` block. This means you can call
   [testLaw](https://middle-ages.github.io/effect-ts-laws-docs/functions/testLaw.html)/
   [testLaws](https://middle-ages.github.io/effect-ts-laws-docs/functions/testLaws.html)
   from inside a `describe(() => {...})` block, or even from the top level of
   your test file.
2. A `LawList` groups multiple laws together under a single label. Useful for
   testing typeclasses, as most have multiple laws.
3. A law test has a name, just like the `fc.Property` it is wrapping, but also
   an optional string field for a note. It is shown only on failure or when
   the `fast-check` runtime parameter `verbose` is true.
