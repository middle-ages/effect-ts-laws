export {
  Law,
  LawSet,
  addLawSet,
  addLaws,
  checkLaw,
  checkLaws,
  lawSetTests,
  lawTests,
  liftEquivalences,
  negateLaw,
  testLaw,
  testLaws,
} from './src/law.js'
export type {
  LiftEquivalence,
  LiftedEquivalences,
  Overrides,
  UnknownArgs,
} from './src/law.js'

export {
  duration,
  either,
  fc,
  liftArbitraries,
  offsetTimezone,
  option,
  predicate,
  tinyInteger,
  unary,
  unaryFromKind,
  unaryInKind,
  unaryToKind,
  utc,
  zoned,
} from './src/arbitrary.js'
export type {
  ArbitraryToEquivalence,
  EquivalenceToArbitrary,
  LiftArbitrary,
} from './src/arbitrary.js'

export {instances as arbitraryInstances} from './src/arbitrary.js'

/**
 * Imports all of `effect-ts-laws/arbitrary`.
 * @category arbitraries
 */
export * as Arbitrary from './src/arbitrary.js'

export {
  Applicative,
  Covariant,
  Equivalence,
  Invariant,
  Monad,
  Monoid,
  Order,
  Semigroup,
  Traversable,
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  testConcreteTypeclassLaw,
  testConcreteTypeclassLaws,
  testMonoid,
  testParameterizedTypeclassLaws,
  testTypeclassLaws,
  testTypeclassLawsFor,
} from './src/laws.js'

export type {
  ApplicativeTypeLambda,
  ConcreteOptions,
  CovariantTypeLambda,
  InvariantTypeLambda,
  MonadTypeLambda,
  Mono,
  MonoidTypeLambda,
  MonomorphicOptions,
  Options,
  TraversableTypeLambda,
} from './src/laws.js'

export {
  composeApplicative,
  composeCovariant,
  composeInvariant,
  composeOf,
  composeTraversable,
} from './src/compose.js'
export type {ComposeTypeLambda} from './src/compose.js'
