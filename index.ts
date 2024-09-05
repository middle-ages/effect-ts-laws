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
  arbitraryMonad,
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
  LiftedEquivalenceToArbitrary,
} from './src/arbitrary.js'

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
  testMonoids,
  testParameterizedTypeclassLaws,
  testTypeclassLaws,
  testTypeclassLawsFor,
} from './src/laws.js'

export type {
  ApplicativeTypeLambda,
  ConcreteGiven,
  CovariantTypeLambda,
  InvariantTypeLambda,
  MonadTypeLambda,
  Mono,
  MonoidTypeLambda,
  MonomorphicOptions,
  ParameterizedGiven,
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
