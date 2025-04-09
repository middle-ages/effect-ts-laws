import {HKT, flow} from 'effect'

/**
 * A typeclass for lossless bidirectional conversion between two encodings.
 * @category typeclass
 */
export interface Isomorphism<A, B> {
  readonly to: (from: A) => B
  readonly from: (to: B) => A
}

/**
 * Type lambda for the `Isomorphism` typeclass.
 * @category type lambda
 */
export interface IsomorphismTypeLambda extends HKT.TypeLambda {
  readonly type: Isomorphism<this['Target'], this['Out1']>
}

/**
 * Flip the encode/decode direction: encode becomes decode and decode becomes
 * encode.
 * @category typeclass
 */
export const reverse = <A, B>({
  to,
  from,
}: Isomorphism<A, B>): Isomorphism<B, A> => ({from: to, to: from})

/**
 * Compose two isomorphisms of `A⇒B` and `B⇒C` into an isomorphism of `a⇒C`.
 * @category typeclass
 */
export const compose =
  <A, B>(F: Isomorphism<A, B>) =>
  <C>(G: Isomorphism<B, C>): Isomorphism<A, C> => ({
    to: flow(F.to, G.to),
    from: flow(G.from, F.from),
  })

/**
 * Run the `to` transform of the isomorphism.
 * @category typeclass
 */
export const encode = <A, B>(iso: Isomorphism<A, B>): ((a: A) => B) => iso.to,
  /**
   * Run the `from` transform of the isomorphism.
   * @category type lambda
   */
  decode = <A, B>(iso: Isomorphism<A, B>): ((a: B) => A) => iso.from
