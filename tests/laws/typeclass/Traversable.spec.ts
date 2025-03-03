import {traversableLaws} from '#laws'
import {testLaws} from '#test'
import {Applicative as AP, Traversable as TA} from '@effect/typeclass'
import {Traversable as optionTraversable} from '@effect/typeclass/data/Option'
import {Option as OP} from 'effect'
import {dual} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import {numericOptionGiven, testFailure} from './helpers.js'

type Instance = TA.Traversable<OptionTypeLambda>

const instance = optionTraversable,
  laws = (instance: Instance) =>
    traversableLaws({F: instance, ...numericOptionGiven})
describe('Traversable laws self-test', () => {
  testLaws(laws(instance), {verbose: false})

  testFailure(
    'failure: “traverse to none” breaks identity',
    laws({
      ...instance,
      traverse: <F extends TypeLambda>(F: AP.Applicative<F>) =>
        dual(
          2,
          <A, R, O, E, B>(
            _1: OP.Option<A>,
            _2: (a: A) => Kind<F, R, O, E, B>,
          ): Kind<F, R, O, E, OP.Option<B>> => F.of(OP.none()),
        ),
    }),
  )
})
