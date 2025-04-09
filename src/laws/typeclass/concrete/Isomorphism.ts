import {inverse} from '#algebra'
import {Law, LawSet} from '#law'
import {Isomorphism} from '#typeclass'
import {pipe} from 'effect'
import {type Equivalence} from 'effect/Equivalence'
import fc from 'fast-check'
import {defineConcreteLaws} from './given.js'

/**
 * Build typeclass laws for isomorphisms that share their `A` type parameter.
 * @category typeclass laws
 */
export const buildIsomorphismLaws =
  <A>(base: BaseIsomorphismGiven<A>) =>
  <Encodings extends BaseEncoding<A>>(encodings: Encodings) => {
    type Entry<K extends keyof Encodings> = [K & string, Encodings[K]]
    const results: LawSet[] = []
    for (const entry of Object.entries(encodings)) {
      const [suffix, entryGiven] = entry as Entry<keyof Encodings>
      const given: IsomorphismGivenFor<A, any> & BaseIsomorphismGiven<A> = {
        ...base,
        ...entryGiven,
      }
      results.push(isomorphismLaws(suffix, given))
    }

    return results
  }

/**
 * Build typeclass laws for `Isomorphism`.
 * @category typeclass laws
 */
export const isomorphismLaws = <A, B>(
  suffix: string,
  {a, b, equalsA, equalsB, F}: IsomorphismGiven<A, B>,
): LawSet => {
  const [encode, decode] = [Isomorphism.encode(F), Isomorphism.decode(F)]

  return defineConcreteLaws(
    'Isomorphism',
    inverse<A, B>(
      {f: encode, g: decode, a, equals: equalsA},
      'F.encode ⚬ F.decode = id',
      'decode/encode identity',
    ),
    inverse<B, A>(
      {f: decode, g: encode, a: b, equals: equalsB},
      'F.decode ⚬ F.encode = id',
      'encode/decode identity',
    ),

    Law(
      'reverse compose encode identity',
      'compose(F, reverse(F)).encode = id',
      a,
    )(a =>
      equalsA(
        Isomorphism.encode(
          pipe(F, Isomorphism.reverse, Isomorphism.compose(F)),
        )(a),
        a,
      ),
    ),

    Law(
      'reverse compose decode identity',
      'compose(F, reverse(F)).decode = id',
      a,
    )(a =>
      equalsA(
        Isomorphism.decode(
          pipe(F, Isomorphism.reverse, Isomorphism.compose(F)),
        )(a),
        a,
      ),
    ),
  )(suffix)
}

declare module './given.js' {
  interface ConcreteLambdas {
    Isomorphism: Isomorphism.IsomorphismTypeLambda
  }
}

export type IsomorphismGiven<A, B> = IsomorphismGivenFor<A, B> &
  BaseIsomorphismGiven<A>

/**
 * Record of arguments required to test several encodings of the type `A`.  Each
 * `Isomorphism` requires an equivalence and an arbitrary for the encoded type,
 * where the key is the encoding name. As all the encodings share a decoded
 * type, only a single arbitrary/equivalence of `A` is required.
 * @category typeclass laws
 */
export type BaseEncoding<A> = Record<string, IsomorphismGivenFor<A, any>>

/**
 * Arguments required to test a single `Isomorphism<A,B>`.
 * @category typeclass laws
 */
export interface IsomorphismGivenFor<A, B> {
  /** An equivalence for the decoded values of the isomorphism. */
  equalsB: Equivalence<B>

  /** An arbitrary for the decoded values of the isomorphism. */
  b: fc.Arbitrary<B>

  /** Instance of the typeclass under test. */
  F: Isomorphism.Isomorphism<A, B>
}

/**
 * Shared arguments required for testing an `Isomorphism` with a decoded type
 * `A`.
 * @category typeclass laws
 */
export interface BaseIsomorphismGiven<A> {
  /** An equivalence for the decoded value of the `Isomorphism` of type `A`. */
  equalsA: Equivalence<A>

  /** An arbitrary for the decoded value of the `Isomorphism` of type `A`. */
  a: fc.Arbitrary<A>
}
