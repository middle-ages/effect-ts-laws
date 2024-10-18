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
import type {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'
import {option, unary, unaryToKind} from '../../../arbitrary.js'
import {composeApplicative} from '../../../compose.js'
import {addLawSets, Law, lawTests} from '../../../law.js'
import {withOuterOption} from './compose.js'
import type {ParameterizedGiven as Given} from './given.js'
import type {Kind, TypeLambda} from 'effect/HKT'

/**
 * Typeclass laws for `Traversable`.
 * @category typeclass laws
 */
export const traversableLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  given: Given<TraversableTypeLambda, F, A, B, C, R, O, E>,
) =>
  pipe(
    buildLaws('Traversable', given),
    addLawSets(
      buildLaws(...withOuterOption('Traversable', given, optionTraversable)),
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
  }: Given<TraversableTypeLambda, F, A, B, C, R, O, E>,
) => {
  type Data<I extends TypeLambda, T> = Kind<I, R, O, E, T>

  type G = OptionTypeLambda
  type H = ReadonlyArrayTypeLambda

  type DataF<T> = Data<F, T>
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
    )((fa, agb, bhc) => {
      const left = pipe(fa, traverseG(agb), mapG(traverseH(bhc)))
      const right = pipe(fa, traverseGH(flow(agb, mapG(bhc))))

      return equalsGHFc(left, right)
    }),

    ...('map' in F
      ? [
          Law(
            'map consistency',
            'fa ▹ F.map(ab) = fa ▹ Id.traverse(ab)',
            fa,
            ab,
          )((fa, ab) => {
            const map = F.map as CO.Covariant<F>['map']
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
