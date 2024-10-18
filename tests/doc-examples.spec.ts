import {Covariant as CO, Semigroup as SE} from '@effect/typeclass'
import {
  getOptionalMonoid,
  Covariant as optionCovariant,
  Monad as optionMonad,
  Traversable as optionTraversable,
} from '@effect/typeclass/data/Option'
import {Array as AR, Number as NU, Option as OP, pipe} from 'effect'
import {
  covariantLaws,
  GivenConcerns,
  Mono,
  monoEquivalence,
  monoOrder,
  monoSemigroup,
  option,
  semigroupLaws,
  unfoldMonoGiven,
} from 'effect-ts-laws'
import {testLaws, testTypeclassLaws, verboseLaws} from 'effect-ts-laws/vitest'
import {dual} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import fc from 'fast-check'

describe('doc examples', () => {
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

  describe('Integers form a semigroup under +', () => {
    const instance: SE.Semigroup<number> = {
      combine: NU.sum,
      combineMany: (head, rest) => NU.sumAll([head, ...rest]),
    }

    pipe(
      {F: instance, equalsA: NU.Equivalence, a: fc.nat()},
      semigroupLaws,
      verboseLaws,
    )
  })

  describe('Option is Covariant', () => {
    const given: GivenConcerns<OptionTypeLambda, Mono> =
      unfoldMonoGiven<OptionTypeLambda>(OP.getEquivalence, option)

    pipe(
      {F: optionCovariant, ...given},
      covariantLaws<OptionTypeLambda, Mono>,
      testLaws,
    )
  })

  describe('option', () => {
    testTypeclassLaws<OptionTypeLambda>({
      getEquivalence: OP.getEquivalence,
      getArbitrary: option,
    })({
      Equivalence: OP.getEquivalence(monoEquivalence),
      Order: OP.getOrder(monoOrder),
      Monoid: getOptionalMonoid(monoSemigroup),
      Monad: optionMonad,
      Traversable: optionTraversable,
    })
  })
})
