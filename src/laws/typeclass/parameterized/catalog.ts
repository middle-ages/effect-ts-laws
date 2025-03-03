import type {LawSet} from '#law'
import {Array as AR, pipe} from 'effect'
import type {Kind, TypeLambda} from 'effect/HKT'
import type {UnionToIntersection} from 'effect/Types'
import {alternativeLaws} from './Alternative.js'
import {applicativeLaws} from './Applicative.js'
import {bicovariantLaws} from './Bicovariant.js'
import {contravariantLaws} from './Contravariant.js'
import {covariantLaws} from './Covariant.js'
import {filterableLaws} from './Filterable.js'
import {foldableLaws} from './Foldable.js'
import type {GivenConcerns, ParameterizedLambdas} from './given.js'
import {invariantLaws} from './Invariant.js'
import {monadLaws} from './Monad.js'
import {rightFoldableLaws} from './RightFoldable.js'
import {semiAlternativeLaws} from './SemiAlternative.js'
import {traversableLaws} from './Traversable.js'

/**
 * Map of typeclass name to their laws, for typeclasses of parameterized
 * types.
 * @category harness
 */
export const parameterizedLaws = {
  Alternative: alternativeLaws,
  Applicative: applicativeLaws,
  Bicovariant: bicovariantLaws,
  Contravariant: contravariantLaws,
  Covariant: covariantLaws,
  Filterable: filterableLaws,
  Foldable: foldableLaws,
  Invariant: invariantLaws,
  Monad: monadLaws,
  RightFoldable: rightFoldableLaws,
  SemiAlternative: semiAlternativeLaws,
  Traversable: traversableLaws,
} as const

/**
 * Union of all names of typeclasses for parameterized types.
 * @category harness
 */
export type ParameterizedClass = keyof typeof parameterizedLaws

/**
 * Maps typeclass name to its instance type.
 * @category harness
 */
export type Parameterized<
  F extends TypeLambda,
  R = never,
  O = unknown,
  E = unknown,
> = {
  [Key in ParameterizedClass]: Kind<ParameterizedLambdas[Key], R, O, E, F>
}

/**
 * Type guard for parameterized type typeclass names.
 * @category harness
 */
export const isParameterizedTypeclassName = (
  o: string,
): o is ParameterizedClass => o in parameterizedLaws

/**
 * Build [parameterized type](https://github.com/Effect-TS/effect/blob/main/packages/typeclass/README.md#parameterized-types)
 * typeclass laws for the given instances of some datatype.
 *
 * @typeParam F - Type lambda of the datatype under test.
 * @typeParam A - Type lambda of first underlying type.
 * @typeParam B - Type lambda of second underlying type.
 * @typeParam C - Type lambda of third underlying type.
 * @category harness
 */
export const buildParameterizedTypeclassLaws =
  <F extends TypeLambda, A, B = A, C = A>() =>
  <Ins extends Partial<Parameterized<F>>, R = never, O = unknown, E = unknown>(
    /**
     * Instances to test. Key is typeclass name and value is the
     * instance under test. For example, `{ Monad: Option.Monad }` will run
     * the monad typeclass laws on `Option`.
     */
    instances: Ins,
    /** Parameterized typeclass test options. */
    given: GivenConcerns<F, A, B, C, R, O, E>,
  ): LawSet[] => {
    const mergedInstances = Object.assign(
      {},
      ...Object.values(instances),
    ) as UnionToIntersection<Ins[keyof Ins]>

    return pipe(
      Object.keys(instances) as ParameterizedClass[],
      AR.map(<K extends ParameterizedClass>(key: K) =>
        parameterizedLaws[key](
          Object.assign({F: mergedInstances}, given) as never,
        ),
      ),
    )
  }
