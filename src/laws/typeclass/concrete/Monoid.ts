import {Monoid as MO} from '@effect/typeclass'
import {TypeLambda} from 'effect/HKT'
import {Law, LawSet} from '../../../law.js'
import {ConcreteOptions} from './options.js'
import {Semigroup} from './Semigroup.js'

declare module './options.js' {
  interface ConcreteMap<A> {
    Monoid: {
      lambda: MonoidTypeLambda
      laws: ReturnType<typeof Monoid<A>>
    }
  }
}

/**
 * Test typeclass laws for `Monoid` and its requirement `Semigroup` laws.
 * @category typeclass laws
 */
export const Monoid = <A>(options: ConcreteOptions<MonoidTypeLambda, A>) => {
  const {F, equalsA, a} = options

  return LawSet(Semigroup(options))(
    'Monoid',
    Law(
      'leftIdentity',
      '∅ ⊹ a = a',
      a,
    )((a: A) => equalsA(F.combine(F.empty, a), a)),

    Law(
      'rightIdentity',
      'a = a ⊹ ∅',
      a,
    )((a: A) => equalsA(F.combine(a, F.empty), a)),
  )
}

/**
 * Type lambda for the `Monoid` type class.
 * @category type lambda
 */
export interface MonoidTypeLambda extends TypeLambda {
  readonly type: MO.Monoid<this['Target']>
}
