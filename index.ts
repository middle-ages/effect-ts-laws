export {liftEquivalences} from './src/law/equivalence.js'
export {buildLaw} from './src/law/law.js'
export {lawTests, testLaws, verboseLaws} from './src/law/lawList.js'
export {asProperty, lawTest, testLaw} from './src/law/lawTest.js'

export {
  concreteLaws,
  concreteLawsFor,
} from './src/laws/typeclass/concrete/catalog.js'
export {Equivalence} from './src/laws/typeclass/concrete/Equivalence.js'
export {Monoid} from './src/laws/typeclass/concrete/Monoid.js'
export {Order} from './src/laws/typeclass/concrete/Order.js'
export {Semigroup} from './src/laws/typeclass/concrete/Semigroup.js'
export {Applicative} from './src/laws/typeclass/parameterized/Applicative.js'
export {
  isParameterizedTypeclassName,
  parameterizedLaws,
  parameterizedLawsFor,
} from './src/laws/typeclass/parameterized/catalog.js'
export {Covariant} from './src/laws/typeclass/parameterized/Covariant.js'
export {Invariant} from './src/laws/typeclass/parameterized/Invariant.js'
export {Monad} from './src/laws/typeclass/parameterized/Monad.js'
export {
  testConcreteTypeclassLaw,
  testConcreteTypeclassLaws,
  testMonoid,
} from './src/laws/typeclass/runner/concrete.js'
export {
  testParameterizedTypeclassLaw,
  testParameterizedTypeclassLaws,
} from './src/laws/typeclass/runner/parameterized.js'
export {testTypeclassLawsFor} from './src/laws/typeclass/runner/typeclass.js'

export {
  either,
  liftArbitraries,
  option,
  tinyInteger,
} from './src/arbitraries/data.js'

export {
  predicate,
  unaryFunction,
  unaryKleisli,
} from './src/arbitraries/function.js'
export {duration, offsetTimezone, utc, zoned} from './src/arbitraries/time.js'

export type {LiftEquivalence} from './src/law/equivalence.js'
export type {Law, NAryPredicate, UnknownArgs} from './src/law/law.js'
export type {
  LawList,
  LawPredicates,
  ParameterOverrides,
} from './src/law/lawList.js'
export type {ArbitrariesFor, LawTest} from './src/law/lawTest.js'

export type {
  ConcreteInstances,
  ConcreteOptionsFor,
  ConcreteTypeclass,
} from './src/laws/typeclass/concrete/catalog.js'
export type {MonoidTypeLambda} from './src/laws/typeclass/concrete/Monoid.js'
export type {
  ConcreteMap,
  ConcreteOptions,
} from './src/laws/typeclass/concrete/options.js'
export type {
  ApplicativeOptions,
  ApplicativeTypeLambda,
} from './src/laws/typeclass/parameterized/Applicative.js'
export type {
  ParameterizedInstances,
  ParameterizedOptions,
  ParameterizedTypeclass,
} from './src/laws/typeclass/parameterized/catalog.js'
export type {CovariantTypeLambda} from './src/laws/typeclass/parameterized/Covariant.js'
export type {InvariantTypeLambda} from './src/laws/typeclass/parameterized/Invariant.js'
export type {
  MonadOptions,
  MonadTypeLambda,
} from './src/laws/typeclass/parameterized/Monad.js'
export type {
  CommonOptions,
  ParameterizedMap,
} from './src/laws/typeclass/parameterized/options.js'
export {
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  testTypeclassLaws,
} from './src/laws/typeclass/runner/monomorphic.js'
export type {
  Mono,
  MonomorphicOptions,
} from './src/laws/typeclass/runner/monomorphic.js'
export type {
  Typeclass,
  TypeclassInstances,
} from './src/laws/typeclass/runner/typeclass.js'

export type {
  ArbitraryToEquivalence,
  EquivalenceToArbitrary,
  LiftArbitrary,
} from './src/arbitraries/types.js'
