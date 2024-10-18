import {Foldable as FO} from '@effect/typeclass'
import {Monad as identityMonad} from '@effect/typeclass/data/Identity'
import {Foldable as optionFoldable} from '@effect/typeclass/data/Option'
import {Array as AR, identity, pipe} from 'effect'
import type {TypeLambda} from 'effect/HKT'
import {addLawSets, Law, LawSet, lawTests} from '../../../law.js'
import {Endo} from '../../../typeclass.js'
import {withOuterOption} from './compose.js'
import type {ParameterizedGiven as Given} from './given.js'
import {unfoldGiven} from './given.js'

/**
 * Typeclass laws for `Foldable`.
 * @category typeclass laws
 */
export const foldableLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<FoldableTypeLambda, F, A, B, C, R, O, E>,
) =>
  pipe(
    buildLaws('Foldable', given),
    addLawSets(
      buildLaws(...withOuterOption('Foldable', given, optionFoldable)),
    ),
  )

const buildLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  name: string,
  given: Given<FoldableTypeLambda, F, A, B, C, R, O, E>,
): LawSet => {
  const {Monoid: monoid, F, fa, b, bab, equalsA, equalsB} = unfoldGiven(given),
    {reduce} = F,
    toArray = FO.toArray(F),
    equalsArrayA = AR.getEquivalence(equalsA),
    reduceKind = FO.reduceKind(F),
    {empty, combine} = monoid,
    combineMap = pipe(monoid, FO.combineMap(F)),
    arrayAppend = <T>(accumulator: T[], value: T): T[] =>
      AR.append(accumulator, value)

  return pipe(
    lawTests(
      name,

      Law(
        'reduce',
        'reduce(b, bab) = combineMap(Monoid<Endo<B>>)(a ⇒ b ⇒ bab(b, a))',
        fa,
        b,
        bab,
      )((fa, empty, combine) =>
        equalsB(
          pipe(fa, reduce(empty, combine)),
          pipe(
            empty,
            pipe(
              fa,
              pipe(
                Endo.getMonoid<B>(),
                FO.combineMap(F),
              )(a => b => combine(b, a)),
            ),
          ),
        ),
      ),

      Law(
        'combineMap',
        'reduce(∅, ⊕) = combineMap(Monoid)(id)',
        fa,
      )(fa =>
        equalsA(
          pipe(fa, reduce(empty, combine)),
          pipe(fa, combineMap(identity)),
        ),
      ),

      Law(
        'reduceKind',
        'reduceKind(Monad<Id>) = reduce',
        fa,
        b,
        bab,
      )((fa, b, bab) =>
        equalsB(
          pipe(fa, reduceKind(identityMonad)(b, bab)),
          pipe(fa, reduce(b, bab)),
        ),
      ),

      Law(
        'toArray',
        'toArray = reduce([], Array.append)',
        fa,
      )(fa =>
        equalsArrayA(toArray(fa), pipe(fa, reduce([] as A[], arrayAppend))),
      ),
    ),
  )
}

/**
 * Type lambda for the `Foldable` typeclass.
 * @category type lambda
 */
export interface FoldableTypeLambda extends TypeLambda {
  readonly type: FO.Foldable<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Foldable: FoldableTypeLambda
  }
}
