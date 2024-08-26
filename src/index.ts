export type {
  ArbitrariesFor,
  GetArbitrary,
  GetEquivalence,
  LawList,
  LawTest,
  ParameterOverrides,
} from './law.js'

export type {Mono, TypeclassInstances} from './laws.js'

export {
  asProperty,
  lawTest,
  lawTests,
  testLaw,
  testLaws,
  verboseLaws,
} from './law.js'

export {
  Covariant,
  Equivalence,
  Invariant,
  Monad,
  Monoid,
  Order,
  Semigroup,
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  testConcreteTypeclassLaw,
  testConcreteTypeclassLaws,
  testParameterizedTypeclassLaw,
  testParameterizedTypeclassLaws,
  testTypeclassLaws,
  testTypeclassLawsFor,
} from './laws.js'

export {
  either,
  option,
  tinyInteger,
  predicate,
  unaryFunction,
} from './arbitraries.js'
