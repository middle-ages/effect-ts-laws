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
import {ReadonlyArrayTypeLambda} from 'effect/Array'
import {Kind, TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'
import {option, unary, unaryToKind} from '../../../arbitrary.js'
import {composeApplicative} from '../../../compose.js'
import {addLawSet, Law, lawTests} from '../../../law.js'
import {ParameterizedGiven as Given} from './given.js'
import {withOuterOption} from './harness/compose.js'

/**
 * Test typeclass laws for `Traversable`.
 * @category typeclass laws
 */
export const traversableLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  given: Given<TraversableTypeLambda, F, A, B, C, In1, Out2, Out1>,
) =>
  pipe(
    buildLaws('Traversable', given),
    addLawSet(
      buildLaws(...withOuterOption('Traversable', given, optionTraversable)),
    ),
  )

const buildLaws = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
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
  }: Given<TraversableTypeLambda, F, A, B, C, In1, Out2, Out1>,
) => {
  type Data<I extends TypeLambda, T> = Kind<I, In1, Out2, Out1, T>

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
      pipe(b, unaryToKind<A>()<OptionTypeLambda, In1, Out2, Out1>(option)),
      pipe(
        c,
        unaryToKind<B>()<ReadonlyArrayTypeLambda, In1, Out2, Out1>(fc.array),
      ),
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
