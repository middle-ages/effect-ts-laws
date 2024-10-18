import {Contravariant as CN} from '@effect/typeclass'
import {Contravariant} from '@effect/typeclass/data/Predicate'
import {Boolean as BO} from 'effect'
import {
  buildContravariantLaws,
  checkLawSets,
  getMonoUnaryEquivalence,
  Mono,
  predicate,
} from 'effect-ts-laws'
import {testLawSets} from 'effect-ts-laws/vitest'
import {dual, flow, pipe, tupled} from 'effect/Function'
import {Kind} from 'effect/HKT'
import {PredicateTypeLambda} from 'effect/Predicate'

const build = buildContravariantLaws<PredicateTypeLambda>({
  Arbitrary: predicate<Mono>(),
  Equivalence: getMonoUnaryEquivalence(BO.Equivalence),
})

const numRuns = 2

describe('Contravariant laws self-test', () => {
  pipe({Contravariant}, build, tupled(testLawSets({numRuns})))

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
    const laws = build({Contravariant: unlawful})

    expect(checkLawSets({numRuns})(...laws).length).toBeGreaterThan(0)
  })
})
