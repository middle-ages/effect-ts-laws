import {Contravariant as CN} from '@effect/typeclass'
import {Contravariant} from '@effect/typeclass/data/Predicate'
import {Boolean as BO} from 'effect'
import {
  buildContravariantLaws,
  checkLawSets,
  getMonoUnaryEquivalence,
  Mono,
  predicate,
  testLawSets,
} from 'effect-ts-laws'
import {dual, flow, pipe, tupled} from 'effect/Function'
import {Kind} from 'effect/HKT'
import {PredicateTypeLambda} from 'effect/Predicate'

const build = buildContravariantLaws<PredicateTypeLambda>({
  Arbitrary: predicate<Mono>(),
  Equivalence: getMonoUnaryEquivalence(BO.Equivalence),
})

describe('Covariant laws self-test', () => {
  pipe({Contravariant}, build, tupled(testLawSets({numRuns: 10})))

  test('unlawful', () => {
    const unlawful: CN.Contravariant<PredicateTypeLambda> = {
      ...Contravariant,
      contramap: dual(
        2,
        <R, O, E, A, B>(
          self: Kind<PredicateTypeLambda, R, O, E, A>,
          f: (b: B) => A,
        ): Kind<PredicateTypeLambda, R, O, E, B> =>
          flow(Contravariant.contramap(self, f), BO.not),
      ),
    }

    expect(
      pipe(
        {Contravariant: unlawful},
        build,
        tupled(checkLawSets({numRuns: 100})),
      ).length,
    ).toBeGreaterThan(0)
  })
})
