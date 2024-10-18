import {Foldable} from '@effect/typeclass/data/Array'
import {reduceRight} from 'effect/Array'
import type {ReadonlyArrayTypeLambda} from 'effect/Array'
import * as RF from '../RightFoldable.js'

/**
 * @category instances
 */
export const RightFoldable: RF.RightFoldable<ReadonlyArrayTypeLambda> = {
  ...Foldable,
  reduceRight,
}
