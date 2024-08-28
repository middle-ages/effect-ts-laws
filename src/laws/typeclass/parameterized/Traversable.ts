import {option, unaryToKind} from '#arbitrary'
import {composeApplicative} from '#compose'
import {addLawSet, Law, lawTests} from '#law'
import {Traversable as TA} from '@effect/typeclass'
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
import {liftOptions, Options} from './options.js'

/**
 * Test typeclass laws for `Traversable`.
 * @category typeclass laws
 */
export const Traversable = <
  F extends TypeLambda,
  A,
  B = A,
  C = A,
  R = never,
  O = unknown,
  E = unknown,
>(
  options: Options<TraversableTypeLambda, F, A, B, C, R, O, E>,
) => {
  const composition = buildLaws(
    ...liftOptions<TraversableTypeLambda, F, OptionTypeLambda>()(
      'Traversable',
      'Option<F>',
    )<typeof options, A, B, C, R, O, E>(
      options,
      optionTraversable,
      OP.getEquivalence,
      option,
    ),
  )

  return pipe(buildLaws('Traversable', options), addLawSet(composition))
}

/**
 * Test typeclass laws for `Traversable`.
 * @category typeclass laws
 */
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
    equalsC,
    getEquivalence,
    getArbitrary,
    a,
    b,
    c,
  }: Options<TraversableTypeLambda, F, A, B, C, R, O, E>,
) => {
  type Data<I extends TypeLambda, T> = Kind<I, R, O, E, T>

  type G = OptionTypeLambda
  type H = ReadonlyArrayTypeLambda

  type DataF<T> = Data<F, T>
  type DataG<T> = Data<G, T>
  type DataH<T> = Data<H, T>

  const fa = getArbitrary(a),
    [equalsFa, equalsFc] = [getEquivalence(equalsA), getEquivalence(equalsC)],
    [traverseIdentity, traverseG, traverseH, traverseGH] = [
      F.traverse(identityApplicative),
      F.traverse(optionApplicative),
      F.traverse(arrayApplicative),
      F.traverse(composeApplicative(optionApplicative, arrayApplicative)),
    ],
    mapG = optionCovariant.map,
    [agb, bhc]: [
      fc.Arbitrary<(a: A) => DataG<B>>,
      fc.Arbitrary<(a: B) => DataH<C>>,
    ] = [
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
      'traverse(id) = id',
      fa,
    )(fa => equalsFa(pipe(fa, traverseIdentity(identity)), fa)),

    Law(
      'composition',
      'F.traverse(G)(agb) ∘ G.map(F.traverse(H)(bhc)' +
        ' = traverseGH(agb ∘ mapG(bhc))',
      fa,
      agb,
      bhc,
    )((fa, agb, bhc) => {
      const left = pipe(fa, traverseG(agb), mapG(traverseH(bhc)))
      const right = pipe(fa, traverseGH(flow(agb, mapG(bhc))))

      return equalsGHFc(left, right)
    }),
  )
}

/**
 * Type lambda for the `Traversable` typeclass.
 * @category type lambda
 */
export interface TraversableTypeLambda extends TypeLambda {
  readonly type: TA.Traversable<this['Target'] & TypeLambda>
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, R, O, E> {
    Traversable: {
      lambda: TraversableTypeLambda
      options: Options<TraversableTypeLambda, F, A, B, C, R, O, E>
      laws: ReturnType<typeof Traversable<F, A, B, C, R, O, E>>
    }
  }
}
