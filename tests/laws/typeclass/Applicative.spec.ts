import {Applicative as AP} from '@effect/typeclass'
import {
  Applicative as arrayApplicative,
  SemiApplicative as arraySemiApplicative,
} from '@effect/typeclass/data/Array'
import {Number as NU, pipe} from 'effect'
import {Applicative, tinyInteger, verboseLaws} from 'effect-ts-laws'
import {getEquivalence, ReadonlyArrayTypeLambda} from 'effect/Array'
import fc from 'fast-check'

export const Aa = arrayApplicative
export const Bb = arraySemiApplicative

type Instance = AP.Applicative<ReadonlyArrayTypeLambda>

const intArray = fc.array(tinyInteger)
const a = tinyInteger,
  instance = arrayApplicative,
  ab = NU.increment,
  bc = NU.multiply(1_000),
  fab = [ab],
  fbc = [bc, bc],
  laws = (instance: Instance) =>
    Applicative({
      F: instance,
      a,
      b: a,
      c: a,
      equalsA: NU.Equivalence,
      equalsB: NU.Equivalence,
      equalsC: NU.Equivalence,
      getEquivalence,
      getArbitrary: fc.array,
    })

const predicate =
  (instance: Instance) =>
  (fa: readonly number[]): boolean => {
    const [
      identity,
      homomorphism,
      associativeComposition,
      interchange,
      mapLaw,
    ] = laws(instance).predicates
    return (
      identity(fa) &&
      homomorphism(fa[0] ?? 0, ab) &&
      associativeComposition(fa, fab, fbc) &&
      interchange(fa.length, fab) &&
      mapLaw(fa, ab)
    )
  }

const assertInstance = (instance: Instance) => {
  fc.assert(fc.property(intArray, predicate(instance)))
}

describe('Applicative laws self-test', () => {
  pipe(instance, laws, verboseLaws)

  test('Applicative pass', () => {
    assertInstance(instance)
  })
})
