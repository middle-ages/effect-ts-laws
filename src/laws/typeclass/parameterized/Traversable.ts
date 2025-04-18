import {option, unary, unaryToKind} from '#arbitrary'
import {addLawSets, Law, lawTests} from '#law'
import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Applicative as arrayApplicative} from '@effect/typeclass/data/Array'
import {Applicative as identityApplicative} from '@effect/typeclass/data/Identity'
import {
  Applicative as optionApplicative,
  Covariant as optionCovariant,
  Traversable as optionTraversable,
} from '@effect/typeclass/data/Option'
import {
  Array as AR,
  Equivalence as EQ,
  flow,
  identity,
  Option as OP,
  pipe,
} from 'effect'
import type {ReadonlyArrayTypeLambda} from 'effect/Array'
import type {Kind, TypeLambda} from 'effect/HKT'
import type {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'
import {composeApplicative} from '../../../compose.js'
import {withOuterOption} from './compose.js'
import type {BuildParameterized, ParameterizedGiven as Given} from './given.js'

/**
 * Typeclass laws for `Traversable`.
 * @category typeclass laws
 */
export const traversableLaws: BuildParameterized<TraversableTypeLambda> = (
  given,
  suffix?,
) =>
  pipe(
    buildLaws(`Traversable${suffix ?? ''}`, given),
    addLawSets(
      buildLaws(...withOuterOption('Traversable', given, optionTraversable)),
    ),
  )

const buildLaws = <
  F1 extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  name: string,
  {
    F,
    equalsA,
    equalsB,
    equalsC,
    getEquivalence,
    getArbitrary,
    a,
    b,
    c,
  }: Given<TraversableTypeLambda, F1, A, B, C, R, O, E>,
) => {
  type Data<I extends TypeLambda, T> = Kind<I, R, O, E, T>

  type G = OptionTypeLambda
  type H = ReadonlyArrayTypeLambda

  type DataF<T> = Data<F1, T>
  type DataG<T> = Data<G, T>
  type DataH<T> = Data<H, T>

  const fa = getArbitrary(a),
    [equalsFa, equalsFb, equalsFc] = [
      getEquivalence(equalsA),
      getEquivalence(equalsB),
      getEquivalence(equalsC),
    ],
    [traverseIdentity, traverseG, traverseH, traverseGH] = [
      F.traverse(identityApplicative),
      F.traverse(optionApplicative),
      F.traverse(arrayApplicative),
      F.traverse(composeApplicative(optionApplicative, arrayApplicative)),
    ],
    mapG = optionCovariant.map,
    [ab, agb, bhc]: [
      fc.Arbitrary<(a: A) => B>,
      fc.Arbitrary<(a: A) => DataG<B>>,
      fc.Arbitrary<(a: B) => DataH<C>>,
    ] = [
      unary<A>()(b),
      pipe(b, unaryToKind<A>()<OptionTypeLambda, R, O, E>(option)),
      pipe(c, unaryToKind<B>()<ReadonlyArrayTypeLambda, R, O, E>(fc.array)),
    ]

  const equalsGHFc: EQ.Equivalence<OP.Option<readonly DataF<C>[]>> = pipe(
    equalsFc,
    AR.getEquivalence,
    OP.getEquivalence,
  )

  return lawTests(
    name,

    Law(
      'identity',
      'Id.traverse(id) = id',
      fa,
    )(fa => equalsFa(pipe(fa, traverseIdentity(identity)), fa)),

    Law(
      'composition',
      'G.map(H.traverse(bhc)) ∘ G.traverse(agb)' +
        ' = GH.traverse(G.map(bhc) ∘ agb)',
      fa,
      agb,
      bhc,
    )((fa, agb, bhc) =>
      equalsGHFc(
        pipe(fa, traverseG(agb), mapG(traverseH(bhc))),
        pipe(fa, traverseGH(flow(agb, mapG(bhc)))),
      ),
    ),

    ...('map' in F
      ? [
          Law(
            'map consistency',
            'fa ▹ F.map(ab) = fa ▹ Id.traverse(ab)',
            fa,
            ab,
          )((fa, ab) => {
            const map = F.map as CO.Covariant<F1>['map']
            return equalsFb(pipe(fa, map(ab)), pipe(fa, traverseIdentity(ab)))
          }),
        ]
      : []),
  )
}

/**
 * Type lambda for the `Traversable` typeclass.
 * @category type lambda
 */
export interface TraversableTypeLambda extends TypeLambda {
  readonly type: TA.Traversable<this['Target'] & TypeLambda>
}

declare module './given.js' {
  interface ParameterizedLambdas {
    Traversable: TraversableTypeLambda
  }
}
