import {Covariant as CO} from '@effect/typeclass'
import {Monad} from '@effect/typeclass/data/Option'
import {Array as AR, Option as OP} from 'effect'
import {monoOrder, option, testTypeclassLaws} from 'effect-ts-laws'
import {dual} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'

describe('synopsis examples', () => {
  describe('MyTuple', () => {
    type MyTuple<A> = [A]

    interface MyTupleTypeLambda extends TypeLambda {
      readonly type: MyTuple<this['Target']>
    }

    const map: CO.Covariant<MyTupleTypeLambda>['map'] = dual(
      2,
      <A, B>([a]: MyTuple<A>, ab: (a: A) => B): MyTuple<B> => [ab(a)],
    )
    const Covariant: CO.Covariant<MyTupleTypeLambda> = {
      imap: CO.imap<MyTupleTypeLambda>(map),
      map,
    }

    testTypeclassLaws<MyTupleTypeLambda>({
      getEquivalence: AR.getEquivalence,
      getArbitrary: fc.tuple,
    })({Covariant})
  })

  describe('@effect/data/Option', () => {
    testTypeclassLaws<OP.OptionTypeLambda>({
      getEquivalence: OP.getEquivalence,
      getArbitrary: option,
    })({Order: OP.getOrder(monoOrder), Monad})
  })
})
