export {liftEquivalences} from './law/equivalence.js'
export {Law, checkLaw, negateLaw, testLaw} from './law/law.js'
export {
  LawSet,
  addLawSet,
  addLaws,
  checkLawSets,
  checkLaws,
  lawSetTests,
  lawTests,
  testLawSets,
  testLaws,
  verboseLaws,
} from './law/lawSet.js'

export type {LiftEquivalence, LiftedEquivalences} from './law/equivalence.js'
export type {UnknownArgs} from './law/law.js'
export type {Overrides} from './law/lawSet.js'
