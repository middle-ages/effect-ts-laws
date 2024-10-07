import {Applicative as AP, Traversable as TA} from '@effect/typeclass'
import {Traversable as optionTraversable} from '@effect/typeclass/data/Option'
import {Number as NU, Option as OP, pipe} from 'effect'
import {checkLaws, option, tinyInteger, traversableLaws} from 'effect-ts-laws'

import {testLaws} from 'effect-ts-laws/vitest'
import {dual} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import {
  getEquivalence as optionEquivalence,
  OptionTypeLambda,
} from 'effect/Option'

type Instance = TA.Traversable<OptionTypeLambda>

const a = tinyInteger,
  instance = optionTraversable,
  laws = (instance: Instance) =>
    traversableLaws({
      F: instance,
      a,
      b: a,
      c: a,
      equalsA: NU.Equivalence,
      equalsB: NU.Equivalence,
      equalsC: NU.Equivalence,
      getEquivalence: optionEquivalence,
      getArbitrary: option,
    })

describe('Traversable laws self-test', () => {
  testLaws(laws(instance), {verbose: false})

  test('failure: “traverse to none” breaks identity', () => {
    const traverse = <F extends TypeLambda>(F: AP.Applicative<F>) =>
      dual(
        2,
        <A, R, O, E, B>(
          _1: OP.Option<A>,
          _2: (a: A) => Kind<F, R, O, E, B>,
        ): Kind<F, R, O, E, OP.Option<B>> => F.of(OP.none()),
      )

    expect(pipe({...instance, traverse}, laws, checkLaws)[0]).toMatch(
      /identity/,
    )
  })
})
