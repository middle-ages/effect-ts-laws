import {Covariant as CO, Foldable as FO, Monad as MD} from '@effect/typeclass'
import type {TypeLambda} from 'effect/HKT'
import {flatMap, map, of, reduce, reduceRight} from 'effect/List'
import type {List} from 'effect/List'
import * as RF from '../RightFoldable.js'

/**
 * @category type lambda
 */
export interface ListTypeLambda extends TypeLambda {
  readonly type: List<this['Target']>
}

/**
 * @category instances
 */
export const Monad: MD.Monad<ListTypeLambda> = {
  of,
  flatMap,
  map,
  imap: CO.imap<ListTypeLambda>(map),
}

/**
 * @category instances
 */
export const Foldable: FO.Foldable<ListTypeLambda> = {
  reduce,
}

/**
 * @category instances
 */
export const RightFoldable: RF.RightFoldable<ListTypeLambda> = {
  ...Foldable,
  reduceRight,
}
