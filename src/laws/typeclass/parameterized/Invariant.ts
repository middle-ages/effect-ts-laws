import {option, unary} from '../../../arbitrary.js'
import {addLawSet, Law, lawTests, liftEquivalences} from '../../../law.js'
import {Invariant as IN} from '@effect/typeclass'
import {Invariant as optionInvariant} from '@effect/typeclass/data/Option'
import {flow, identity, Option as OP, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {OptionTypeLambda} from 'effect/Option'
import {liftOptions, Options} from './options.js'

/**
 * Test typeclass laws for `Invariant`.
 * @category typeclass laws
 */
export const Invariant = <F extends TypeLambda, A, B, C, R, O, E>(
  options: Options<InvariantTypeLambda, F, A, B, C, R, O, E>,
) => {
  const composition = buildLaws(
    ...liftOptions<InvariantTypeLambda, F, OptionTypeLambda>()(
      'Invariant',
      'Option<F>',
    )<typeof options, A, B, C, R, O, E>(
      options,
      optionInvariant,
      OP.getEquivalence,
      option,
    ),
  )

  return pipe(buildLaws('Invariant', options), addLawSet(composition))
}

const buildLaws = <F extends TypeLambda, A, B, C, R, O, E>(
  name: string,
  {
    a,
    b,
    c,
    F,
    equalsA,
    equalsC,
    getEquivalence,
    getArbitrary,
  }: Options<InvariantTypeLambda, F, A, B, C, R, O, E>,
) => {
  const fa = getArbitrary(a),
    [equalsFa, equalsFc] = liftEquivalences(getEquivalence)(equalsA, equalsC),
    [fab, fbc, fba, fcb] = [
      unary<A>()(b),
      unary<B>()(c),
      unary<B>()(a),
      unary<C>()(b),
    ]

  return lawTests(
    name,
    Law(
      'identity',
      'imap(id, id) = id',
      fa,
    )(a => equalsFa(F.imap(a, identity, identity), a)),

    Law(
      'composition',
      'a ▹ imap(fab, fba) ▹ imap(fbc, fcb) = a ▹ imap(fab ∘ fbc, fcb ∘ fba)',
      fa,
      fab,
      fbc,
      fba,
      fcb,
    )((a, ab, bc, ba, cb) =>
      equalsFc(
        pipe(a, F.imap(ab, ba), F.imap(bc, cb)),
        pipe(a, F.imap(flow(ab, bc), flow(cb, ba))),
      ),
    ),
  )
}

/**
 * Type lambda for the `Invariant` typeclass.
 * @category type lambda
 */
export interface InvariantTypeLambda extends TypeLambda {
  readonly type: IN.Invariant<this['Target'] & TypeLambda>
}

declare module './options.js' {
  interface ParameterizedMap<F extends TypeLambda, A, B, C, R, O, E> {
    Invariant: {
      lambda: InvariantTypeLambda
      options: Options<InvariantTypeLambda, F, A, B, C, R, O, E>
      laws: ReturnType<typeof Invariant<F, A, B, C, R, O, E>>
    }
  }
}
