export {Equivalence} from './laws/typeclass/concrete/Equivalence.js'
export {Monoid} from './laws/typeclass/concrete/Monoid.js'
export {Order} from './laws/typeclass/concrete/Order.js'
export {Semigroup} from './laws/typeclass/concrete/Semigroup.js'
export {Covariant} from './laws/typeclass/parameterized/Covariant.js'
export {Invariant} from './laws/typeclass/parameterized/Invariant.js'
export {Monad} from './laws/typeclass/parameterized/Monad.js'
export type {Mono} from './laws/typeclass/runner/monomorphic.js'
export type {TypeclassInstances} from './laws/typeclass/runner/typeclass.js'

export {
  testConcreteTypeclassLaw,
  testConcreteTypeclassLaws,
} from './laws/typeclass/runner/concrete.js'

export {
  testParameterizedTypeclassLaw,
  testParameterizedTypeclassLaws,
} from './laws/typeclass/runner/parameterized.js'

export {
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  testTypeclassLaws,
} from './laws/typeclass/runner/monomorphic.js'
export {testTypeclassLawsFor} from './laws/typeclass/runner/typeclass.js'
