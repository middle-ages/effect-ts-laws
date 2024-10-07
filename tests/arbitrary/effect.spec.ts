import {Effect as EF, flow, pipe} from 'effect'
import {fail, succeed, sync, tinyInteger} from 'effect-ts-laws/arbitrary'
import {constant} from 'effect/Function'
import fc from 'fast-check'

const matchRun =
  <E, A>(a: fc.Arbitrary<EF.Effect<A, E>>) =>
  ({onFailure, onSuccess}: {onFailure: boolean; onSuccess: boolean}) => {
    fc.assert(
      fc.property(
        a,
        flow(
          EF.match({
            onFailure: constant(onFailure),
            onSuccess: constant(onSuccess),
          }),
          EF.runSync,
        ),
      ),
    )
  }

describe('effect', () => {
  test('succeed', () => {
    pipe(
      undefined,
      fc.constant,
      succeed,
      matchRun,
    )({
      onFailure: false,
      onSuccess: true,
    })
  })

  test('fail', () => {
    pipe(
      'error',
      fc.constant,
      fail,
      matchRun,
    )({
      onFailure: true,
      onSuccess: false,
    })
  })

  test('sync', () => {
    matchRun(sync(tinyInteger, fc.constant('error')))({
      onFailure: true,
      onSuccess: true,
    })
  })
})
