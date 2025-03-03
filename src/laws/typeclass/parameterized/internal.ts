import type {LawSet} from '#law'
import type {TypeLambda} from 'effect/HKT'
import {ParameterizedGiven} from './given.js'

export interface BuildInternal<Typeclass extends TypeLambda> {
  <F extends TypeLambda, A, B = A, C = A, R = never, O = unknown, E = unknown>(
    name: string,
    given: ParameterizedGiven<Typeclass, F, A, B, C, R, O, E>,
  ): LawSet
}
