import {Foldable} from '@effect/typeclass/data/Option'
import {pipe} from 'effect'
import {constant, dual} from 'effect/Function'
import * as OP from 'effect/Option'
import * as RF from '../RightFoldable.js'
import type {ReduceRight} from '../RightFoldable.js'

const reduceRight: ReduceRight<OP.OptionTypeLambda> = dual(
  3,
  <A, B>(self: OP.Option<A>, zero: B, f: (accumulator: B, value: A) => B): B =>
    pipe(self, OP.match({onNone: constant(zero), onSome: a => f(zero, a)})),
)

/**
 * @category instances
 */
export const RightFoldable: RF.RightFoldable<OP.OptionTypeLambda> = {
  ...Foldable,
  reduceRight,
}
