/* eslint-disable */
// @ts-nocheck
var __defProp = Object.defineProperty
var __typeError = msg => {
  throw TypeError(msg)
}
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value)
var __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value)
var __accessCheck = (obj, member, msg) =>
  member.has(obj) || __typeError('Cannot ' + msg)
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
)
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value)
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
)
var _value, _id, _connected
const isFunction$1 = input => typeof input === 'function'
const dual = function (arity, body) {
  if (typeof arity === 'function') {
    return function () {
      if (arity(arguments)) {
        return body.apply(this, arguments)
      }
      return self => body(self, ...arguments)
    }
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`)
    case 2:
      return function (a, b) {
        if (arguments.length >= 2) {
          return body(a, b)
        }
        return function (self) {
          return body(self, a)
        }
      }
    case 3:
      return function (a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c)
        }
        return function (self) {
          return body(self, a, b)
        }
      }
    case 4:
      return function (a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d)
        }
        return function (self) {
          return body(self, a, b, c)
        }
      }
    case 5:
      return function (a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e)
        }
        return function (self) {
          return body(self, a, b, c, d)
        }
      }
    default:
      return function () {
        if (arguments.length >= arity) {
          return body.apply(this, arguments)
        }
        const args = arguments
        return function (self) {
          return body(self, ...args)
        }
      }
  }
}
const apply = a => self => self(a)
const identity = a => a
const constant = value => () => value
const constTrue = /* @__PURE__ */ constant(true)
const constFalse = /* @__PURE__ */ constant(false)
const constNull = /* @__PURE__ */ constant(null)
const constUndefined = /* @__PURE__ */ constant(void 0)
const flip =
  f =>
  (...b) =>
  (...a) =>
    f(...a)(...b)
const compose = /* @__PURE__ */ dual(2, (ab, bc) => a => bc(ab(a)))
const tupled = f => a => f(...a)
const untupled =
  f =>
  (...a) =>
    f(a)
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a
    case 2:
      return ab(a)
    case 3:
      return bc(ab(a))
    case 4:
      return cd(bc(ab(a)))
    case 5:
      return de(cd(bc(ab(a))))
    case 6:
      return ef(de(cd(bc(ab(a)))))
    case 7:
      return fg(ef(de(cd(bc(ab(a))))))
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))))
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))))
    default: {
      let ret = arguments[0]
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret)
      }
      return ret
    }
  }
}
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
  switch (arguments.length) {
    case 1:
      return ab
    case 2:
      return function () {
        return bc(ab.apply(this, arguments))
      }
    case 3:
      return function () {
        return cd(bc(ab.apply(this, arguments)))
      }
    case 4:
      return function () {
        return de(cd(bc(ab.apply(this, arguments))))
      }
    case 5:
      return function () {
        return ef(de(cd(bc(ab.apply(this, arguments)))))
      }
    case 6:
      return function () {
        return fg(ef(de(cd(bc(ab.apply(this, arguments))))))
      }
    case 7:
      return function () {
        return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))
      }
    case 8:
      return function () {
        return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))))
      }
    case 9:
      return function () {
        return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))))
      }
  }
  return
}
const make$3 = isEquivalent => (self, that) =>
  self === that || isEquivalent(self, that)
const isStrictEquivalent = (x, y) => x === y
const strict = () => isStrictEquivalent
const number$2 = /* @__PURE__ */ strict()
const all = collection => {
  return make$3((x, y) => {
    const len = Math.min(x.length, y.length)
    let collectionLength = 0
    for (const equivalence2 of collection) {
      if (collectionLength >= len) {
        break
      }
      if (!equivalence2(x[collectionLength], y[collectionLength])) {
        return false
      }
      collectionLength++
    }
    return true
  })
}
const tuple = (...elements) => all(elements)
const array$1 = item =>
  make$3((self, that) => {
    if (self.length !== that.length) {
      return false
    }
    for (let i = 0; i < self.length; i++) {
      const isEq = item(self[i], that[i])
      if (!isEq) {
        return false
      }
    }
    return true
  })
const let_$1 = map2 =>
  dual(3, (self, name, f) =>
    map2(self, a =>
      Object.assign({}, a, {
        [name]: f(a),
      }),
    ),
  )
const bindTo$1 = map2 =>
  dual(2, (self, name) =>
    map2(self, a => ({
      [name]: a,
    })),
  )
const bind$1 = (map2, flatMap2) =>
  dual(3, (self, name, f) =>
    flatMap2(self, a =>
      map2(f(a), b =>
        Object.assign({}, a, {
          [name]: b,
        }),
      ),
    ),
  )
let moduleVersion = '3.12.7'
const getCurrentVersion = () => moduleVersion
const globalStoreId = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ getCurrentVersion()}`
let globalStore
const globalValue = (id, compute) => {
  if (!globalStore) {
    globalThis[globalStoreId] ??
      (globalThis[globalStoreId] = /* @__PURE__ */ new Map())
    globalStore = globalThis[globalStoreId]
  }
  if (!globalStore.has(id)) {
    globalStore.set(id, compute())
  }
  return globalStore.get(id)
}
const isNumber$1 = input => typeof input === 'number'
const isBoolean = input => typeof input === 'boolean'
const isFunction = isFunction$1
const isRecordOrArray = input => typeof input === 'object' && input !== null
const isObject = input => isRecordOrArray(input) || isFunction(input)
const hasProperty = /* @__PURE__ */ dual(
  2,
  (self, property) => isObject(self) && property in self,
)
class SingleShotGen {
  constructor(self) {
    __publicField(this, 'self')
    __publicField(this, 'called', false)
    this.self = self
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called
      ? {
          value: a,
          done: true,
        }
      : ((this.called = true),
        {
          value: this.self,
          done: false,
        })
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true,
    }
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this.self)
  }
}
const YieldWrapTypeId = /* @__PURE__ */ Symbol.for('effect/Utils/YieldWrap')
class YieldWrap {
  constructor(value) {
    /**
     * @since 3.0.6
     */
    __privateAdd(this, _value)
    __privateSet(this, _value, value)
  }
  /**
   * @since 3.0.6
   */
  [YieldWrapTypeId]() {
    return __privateGet(this, _value)
  }
}
_value = new WeakMap()
const structuralRegionState = /* @__PURE__ */ globalValue(
  'effect/Utils/isStructuralRegion',
  () => ({
    enabled: false,
    tester: void 0,
  }),
)
const randomHashCache = /* @__PURE__ */ globalValue(
  /* @__PURE__ */ Symbol.for('effect/Hash/randomHashCache'),
  () => /* @__PURE__ */ new WeakMap(),
)
const symbol$1 = /* @__PURE__ */ Symbol.for('effect/Hash')
const hash = self => {
  if (structuralRegionState.enabled === true) {
    return 0
  }
  switch (typeof self) {
    case 'number':
      return number$1(self)
    case 'bigint':
      return string(self.toString(10))
    case 'boolean':
      return string(String(self))
    case 'symbol':
      return string(String(self))
    case 'string':
      return string(self)
    case 'undefined':
      return string('undefined')
    case 'function':
    case 'object': {
      if (self === null) {
        return string('null')
      } else if (self instanceof Date) {
        return hash(self.toISOString())
      } else if (isHash(self)) {
        return self[symbol$1]()
      } else {
        return random(self)
      }
    }
    default:
      throw new Error(
        `BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`,
      )
  }
}
const random = self => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(
      self,
      number$1(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
    )
  }
  return randomHashCache.get(self)
}
const combine = b => self => (self * 53) ^ b
const optimize = n => (n & 3221225471) | ((n >>> 1) & 1073741824)
const isHash = u => hasProperty(u, symbol$1)
const number$1 = n => {
  if (n !== n || n === Infinity) {
    return 0
  }
  let h = n | 0
  if (h !== n) {
    h ^= n * 4294967295
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295
  }
  return optimize(h)
}
const string = str => {
  let h = 5381,
    i = str.length
  while (i) {
    h = (h * 33) ^ str.charCodeAt(--i)
  }
  return optimize(h)
}
const cached = function () {
  if (arguments.length === 1) {
    const self2 = arguments[0]
    return function (hash3) {
      Object.defineProperty(self2, symbol$1, {
        value() {
          return hash3
        },
        enumerable: false,
      })
      return hash3
    }
  }
  const self = arguments[0]
  const hash2 = arguments[1]
  Object.defineProperty(self, symbol$1, {
    value() {
      return hash2
    },
    enumerable: false,
  })
  return hash2
}
const symbol = /* @__PURE__ */ Symbol.for('effect/Equal')
function equals() {
  if (arguments.length === 1) {
    return self => compareBoth(self, arguments[0])
  }
  return compareBoth(arguments[0], arguments[1])
}
function compareBoth(self, that) {
  if (self === that) {
    return true
  }
  const selfType = typeof self
  if (selfType !== typeof that) {
    return false
  }
  if (selfType === 'object' || selfType === 'function') {
    if (self !== null && that !== null) {
      if (isEqual(self) && isEqual(that)) {
        if (hash(self) === hash(that) && self[symbol](that)) {
          return true
        } else {
          return structuralRegionState.enabled && structuralRegionState.tester
            ? structuralRegionState.tester(self, that)
            : false
        }
      } else if (self instanceof Date && that instanceof Date) {
        return self.toISOString() === that.toISOString()
      }
    }
    if (structuralRegionState.enabled) {
      if (Array.isArray(self) && Array.isArray(that)) {
        return (
          self.length === that.length &&
          self.every((v, i) => compareBoth(v, that[i]))
        )
      }
      if (
        Object.getPrototypeOf(self) === Object.prototype &&
        Object.getPrototypeOf(self) === Object.prototype
      ) {
        const keysSelf = Object.keys(self)
        const keysThat = Object.keys(that)
        if (keysSelf.length === keysThat.length) {
          for (const key of keysSelf) {
            if (!(key in that && compareBoth(self[key], that[key]))) {
              return structuralRegionState.tester
                ? structuralRegionState.tester(self, that)
                : false
            }
          }
          return true
        }
      }
      return structuralRegionState.tester
        ? structuralRegionState.tester(self, that)
        : false
    }
  }
  return structuralRegionState.enabled && structuralRegionState.tester
    ? structuralRegionState.tester(self, that)
    : false
}
const isEqual = u => hasProperty(u, symbol)
const equivalence = () => equals
const NodeInspectSymbol = /* @__PURE__ */ Symbol.for(
  'nodejs.util.inspect.custom',
)
const toJSON = x => {
  try {
    if (
      hasProperty(x, 'toJSON') &&
      isFunction(x['toJSON']) &&
      x['toJSON'].length === 0
    ) {
      return x.toJSON()
    } else if (Array.isArray(x)) {
      return x.map(toJSON)
    }
  } catch (_) {
    return {}
  }
  return redact(x)
}
const format = x => JSON.stringify(x, null, 2)
const symbolRedactable = /* @__PURE__ */ Symbol.for(
  'effect/Inspectable/Redactable',
)
const isRedactable = u =>
  typeof u === 'object' && u !== null && symbolRedactable in u
const redactableState = /* @__PURE__ */ globalValue(
  'effect/Inspectable/redactableState',
  () => ({
    fiberRefs: void 0,
  }),
)
const redact = u => {
  if (isRedactable(u) && redactableState.fiberRefs !== void 0) {
    return u[symbolRedactable](redactableState.fiberRefs)
  }
  return u
}
const pipeArguments = (self, args) => {
  switch (args.length) {
    case 0:
      return self
    case 1:
      return args[0](self)
    case 2:
      return args[1](args[0](self))
    case 3:
      return args[2](args[1](args[0](self)))
    case 4:
      return args[3](args[2](args[1](args[0](self))))
    case 5:
      return args[4](args[3](args[2](args[1](args[0](self)))))
    case 6:
      return args[5](args[4](args[3](args[2](args[1](args[0](self))))))
    case 7:
      return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))
    case 8:
      return args[7](
        args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))),
      )
    case 9:
      return args[8](
        args[7](
          args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))),
        ),
      )
    default: {
      let ret = self
      for (let i = 0, len = args.length; i < len; i++) {
        ret = args[i](ret)
      }
      return ret
    }
  }
}
const EffectTypeId = /* @__PURE__ */ Symbol.for('effect/Effect')
const StreamTypeId = /* @__PURE__ */ Symbol.for('effect/Stream')
const SinkTypeId = /* @__PURE__ */ Symbol.for('effect/Sink')
const ChannelTypeId = /* @__PURE__ */ Symbol.for('effect/Channel')
const effectVariance = {
  /* c8 ignore next */
  _R: _ => _,
  /* c8 ignore next */
  _E: _ => _,
  /* c8 ignore next */
  _A: _ => _,
  _V: /* @__PURE__ */ getCurrentVersion(),
}
const sinkVariance = {
  /* c8 ignore next */
  _A: _ => _,
  /* c8 ignore next */
  _In: _ => _,
  /* c8 ignore next */
  _L: _ => _,
  /* c8 ignore next */
  _E: _ => _,
  /* c8 ignore next */
  _R: _ => _,
}
const channelVariance = {
  /* c8 ignore next */
  _Env: _ => _,
  /* c8 ignore next */
  _InErr: _ => _,
  /* c8 ignore next */
  _InElem: _ => _,
  /* c8 ignore next */
  _InDone: _ => _,
  /* c8 ignore next */
  _OutErr: _ => _,
  /* c8 ignore next */
  _OutElem: _ => _,
  /* c8 ignore next */
  _OutDone: _ => _,
}
const EffectPrototype = {
  [EffectTypeId]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol](that) {
    return this === that
  },
  [symbol$1]() {
    return cached(this, random(this))
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this))
  },
  pipe() {
    return pipeArguments(this, arguments)
  },
}
const TypeId = /* @__PURE__ */ Symbol.for('effect/Option')
const CommonProto = {
  ...EffectPrototype,
  [TypeId]: {
    _A: _ => _,
  },
  [NodeInspectSymbol]() {
    return this.toJSON()
  },
  toString() {
    return format(this.toJSON())
  },
}
const SomeProto = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ Object.create(CommonProto),
  {
    _tag: 'Some',
    _op: 'Some',
    [symbol](that) {
      return isOption(that) && isSome$1(that) && equals(this.value, that.value)
    },
    [symbol$1]() {
      return cached(this, combine(hash(this._tag))(hash(this.value)))
    },
    toJSON() {
      return {
        _id: 'Option',
        _tag: this._tag,
        value: toJSON(this.value),
      }
    },
  },
)
const NoneHash = /* @__PURE__ */ hash('None')
const NoneProto = /* @__PURE__ */ Object.assign(
  /* @__PURE__ */ Object.create(CommonProto),
  {
    _tag: 'None',
    _op: 'None',
    [symbol](that) {
      return isOption(that) && isNone$1(that)
    },
    [symbol$1]() {
      return NoneHash
    },
    toJSON() {
      return {
        _id: 'Option',
        _tag: this._tag,
      }
    },
  },
)
const isOption = input => hasProperty(input, TypeId)
const isNone$1 = fa => fa._tag === 'None'
const isSome$1 = fa => fa._tag === 'Some'
const none$1 = /* @__PURE__ */ Object.create(NoneProto)
const some$2 = value => {
  const a = Object.create(SomeProto)
  a.value = value
  return a
}
const isLeft$1 = ma => ma._tag === 'Left'
const isRight$1 = ma => ma._tag === 'Right'
const isLeft = isLeft$1
const isRight = isRight$1
const isNonEmptyArray$1 = self => self.length > 0
const make$2 = compare => (self, that) =>
  self === that ? 0 : compare(self, that)
const number = /* @__PURE__ */ make$2((self, that) => (self < that ? -1 : 1))
const combineMany = /* @__PURE__ */ dual(2, (self, collection) =>
  make$2((a1, a2) => {
    let out = self(a1, a2)
    if (out !== 0) {
      return out
    }
    for (const O of collection) {
      out = O(a1, a2)
      if (out !== 0) {
        return out
      }
    }
    return out
  }),
)
const empty$1 = () => make$2(() => 0)
const combineAll = collection => combineMany(empty$1(), collection)
const array = O =>
  make$2((self, that) => {
    const aLen = self.length
    const bLen = that.length
    const len = Math.min(aLen, bLen)
    for (let i = 0; i < len; i++) {
      const o = O(self[i], that[i])
      if (o !== 0) {
        return o
      }
    }
    return number(aLen, bLen)
  })
const lessThan$1 = O => dual(2, (self, that) => O(self, that) === -1)
const greaterThan$1 = O => dual(2, (self, that) => O(self, that) === 1)
const lessThanOrEqualTo$1 = O => dual(2, (self, that) => O(self, that) !== 1)
const greaterThanOrEqualTo$1 = O =>
  dual(2, (self, that) => O(self, that) !== -1)
const min$2 = O =>
  dual(2, (self, that) => (self === that || O(self, that) < 1 ? self : that))
const max$2 = O =>
  dual(2, (self, that) => (self === that || O(self, that) > -1 ? self : that))
const clamp$2 = O =>
  dual(2, (self, options) =>
    min$2(O)(options.maximum, max$2(O)(options.minimum, self)),
  )
const between$1 = O =>
  dual(
    2,
    (self, options) =>
      !lessThan$1(O)(self, options.minimum) &&
      !greaterThan$1(O)(self, options.maximum),
  )
const none = () => none$1
const some$1 = some$2
const isNone = isNone$1
const isSome = isSome$1
const getOrElse = /* @__PURE__ */ dual(2, (self, onNone) =>
  isNone(self) ? onNone() : self.value,
)
const toArray = self => (isNone(self) ? [] : [self.value])
const make$1 = (...elements) => elements
const getFirst = self => self[0]
const getSecond = self => self[1]
const mapFirst = /* @__PURE__ */ dual(2, (self, f) => [f(self[0]), self[1]])
const mapSecond = /* @__PURE__ */ dual(2, (self, f) => [self[0], f(self[1])])
const getEquivalence$1 = tuple
const findFirst$1 = /* @__PURE__ */ dual(2, (self, f) => {
  let i = 0
  for (const a of self) {
    const o = f(a, i)
    if (isBoolean(o)) {
      if (o) {
        return some$1(a)
      }
    } else {
      if (isSome(o)) {
        return o
      }
    }
    i++
  }
  return none()
})
const collect = /* @__PURE__ */ dual(2, (self, f) => {
  const out = []
  for (const key of keys(self)) {
    out.push(f(key, self[key]))
  }
  return out
})
const toEntries = /* @__PURE__ */ collect((key, value) => [key, value])
const keys = self => Object.keys(self)
const make = (...elements) => elements
const allocate = n => new Array(n)
const makeBy = (n, f) => {
  const max2 = Math.max(1, Math.floor(n))
  const out = new Array(max2)
  for (let i = 0; i < max2; i++) {
    out[i] = f(i)
  }
  return out
}
const range = (start, end) =>
  start <= end ? makeBy(end - start + 1, i => start + i) : [start]
const replicate = /* @__PURE__ */ dual(2, (a, n) => makeBy(n, () => a))
const fromIterable = collection =>
  Array.isArray(collection) ? collection : Array.from(collection)
const ensure = self => (Array.isArray(self) ? self : [self])
const fromRecord = toEntries
const fromOption = toArray
const match = /* @__PURE__ */ dual(2, (self, {onEmpty, onNonEmpty}) =>
  isNonEmptyReadonlyArray(self) ? onNonEmpty(self) : onEmpty(),
)
const matchLeft = /* @__PURE__ */ dual(2, (self, {onEmpty, onNonEmpty}) =>
  isNonEmptyReadonlyArray(self)
    ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self))
    : onEmpty(),
)
const matchRight = /* @__PURE__ */ dual(2, (self, {onEmpty, onNonEmpty}) =>
  isNonEmptyReadonlyArray(self)
    ? onNonEmpty(initNonEmpty(self), lastNonEmpty(self))
    : onEmpty(),
)
const prepend$1 = /* @__PURE__ */ dual(2, (self, head2) => [head2, ...self])
const prependAll$1 = /* @__PURE__ */ dual(2, (self, that) =>
  fromIterable(that).concat(fromIterable(self)),
)
const append$1 = /* @__PURE__ */ dual(2, (self, last2) => [...self, last2])
const appendAll$1 = /* @__PURE__ */ dual(2, (self, that) =>
  fromIterable(self).concat(fromIterable(that)),
)
const scan = /* @__PURE__ */ dual(3, (self, b, f) => {
  const out = [b]
  let i = 0
  for (const a of self) {
    out[i + 1] = f(out[i], a)
    i++
  }
  return out
})
const scanRight = /* @__PURE__ */ dual(3, (self, b, f) => {
  const input = fromIterable(self)
  const out = new Array(input.length + 1)
  out[input.length] = b
  for (let i = input.length - 1; i >= 0; i--) {
    out[i] = f(out[i + 1], input[i])
  }
  return out
})
const isArray = Array.isArray
const isEmptyArray = self => self.length === 0
const isEmptyReadonlyArray = isEmptyArray
const isNonEmptyArray = isNonEmptyArray$1
const isNonEmptyReadonlyArray = isNonEmptyArray$1
const length = self => self.length
const isOutOfBound = (i, as) => i < 0 || i >= as.length
const clamp$1 = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length))
const get = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index)
  return isOutOfBound(i, self) ? none() : some$1(self[i])
})
const unsafeGet = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index)
  if (isOutOfBound(i, self)) {
    throw new Error(`Index ${i} out of bounds`)
  }
  return self[i]
})
const unprepend = self => [headNonEmpty(self), tailNonEmpty(self)]
const unappend = self => [initNonEmpty(self), lastNonEmpty(self)]
const head = /* @__PURE__ */ get(0)
const headNonEmpty = /* @__PURE__ */ unsafeGet(0)
const last = self =>
  isNonEmptyReadonlyArray(self) ? some$1(lastNonEmpty(self)) : none()
const lastNonEmpty = self => self[self.length - 1]
const tail = self => {
  const input = fromIterable(self)
  return isNonEmptyReadonlyArray(input) ? some$1(tailNonEmpty(input)) : none()
}
const tailNonEmpty = self => self.slice(1)
const init = self => {
  const input = fromIterable(self)
  return isNonEmptyReadonlyArray(input) ? some$1(initNonEmpty(input)) : none()
}
const initNonEmpty = self => self.slice(0, -1)
const take = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self)
  return input.slice(0, clamp$1(n, input))
})
const takeRight = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self)
  const i = clamp$1(n, input)
  return i === 0 ? [] : input.slice(-i)
})
const takeWhile = /* @__PURE__ */ dual(2, (self, predicate) => {
  let i = 0
  const out = []
  for (const a of self) {
    if (!predicate(a, i)) {
      break
    }
    out.push(a)
    i++
  }
  return out
})
const spanIndex = (self, predicate) => {
  let i = 0
  for (const a of self) {
    if (!predicate(a, i)) {
      break
    }
    i++
  }
  return i
}
const span = /* @__PURE__ */ dual(2, (self, predicate) =>
  splitAt(self, spanIndex(self, predicate)),
)
const drop = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self)
  return input.slice(clamp$1(n, input), input.length)
})
const dropRight = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self)
  return input.slice(0, input.length - clamp$1(n, input))
})
const dropWhile = /* @__PURE__ */ dual(2, (self, predicate) =>
  fromIterable(self).slice(spanIndex(self, predicate)),
)
const findFirstIndex = /* @__PURE__ */ dual(2, (self, predicate) => {
  let i = 0
  for (const a of self) {
    if (predicate(a, i)) {
      return some$1(i)
    }
    i++
  }
  return none()
})
const findLastIndex = /* @__PURE__ */ dual(2, (self, predicate) => {
  const input = fromIterable(self)
  for (let i = input.length - 1; i >= 0; i--) {
    if (predicate(input[i], i)) {
      return some$1(i)
    }
  }
  return none()
})
const findFirst = findFirst$1
const findLast = /* @__PURE__ */ dual(2, (self, f) => {
  const input = fromIterable(self)
  for (let i = input.length - 1; i >= 0; i--) {
    const a = input[i]
    const o = f(a, i)
    if (isBoolean(o)) {
      if (o) {
        return some$1(a)
      }
    } else {
      if (isSome(o)) {
        return o
      }
    }
  }
  return none()
})
const insertAt = /* @__PURE__ */ dual(3, (self, i, b) => {
  const out = Array.from(self)
  if (i < 0 || i > out.length) {
    return none()
  }
  out.splice(i, 0, b)
  return some$1(out)
})
const replace = /* @__PURE__ */ dual(3, (self, i, b) =>
  modify(self, i, () => b),
)
const replaceOption = /* @__PURE__ */ dual(3, (self, i, b) =>
  modifyOption(self, i, () => b),
)
const modify = /* @__PURE__ */ dual(3, (self, i, f) =>
  getOrElse(modifyOption(self, i, f), () => Array.from(self)),
)
const modifyOption = /* @__PURE__ */ dual(3, (self, i, f) => {
  const out = Array.from(self)
  if (isOutOfBound(i, out)) {
    return none()
  }
  const next = f(out[i])
  out[i] = next
  return some$1(out)
})
const remove = /* @__PURE__ */ dual(2, (self, i) => {
  const out = Array.from(self)
  if (isOutOfBound(i, out)) {
    return out
  }
  out.splice(i, 1)
  return out
})
const reverse = self => Array.from(self).reverse()
const sort = /* @__PURE__ */ dual(2, (self, O) => {
  const out = Array.from(self)
  out.sort(O)
  return out
})
const sortWith = /* @__PURE__ */ dual(3, (self, f, order) =>
  Array.from(self)
    .map(a => [a, f(a)])
    .sort((a, b) => order(a[1], b[1]))
    .map(x => x[0]),
)
const sortBy = (...orders) => {
  const sortByAll = sort(combineAll(orders))
  return self => {
    const input = fromIterable(self)
    if (isNonEmptyReadonlyArray(input)) {
      return sortByAll(input)
    }
    return []
  }
}
const zip = /* @__PURE__ */ dual(2, (self, that) => zipWith(self, that, make$1))
const zipWith = /* @__PURE__ */ dual(3, (self, that, f) => {
  const as = fromIterable(self)
  const bs = fromIterable(that)
  if (isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty(as), headNonEmpty(bs))]
    const len = Math.min(as.length, bs.length)
    for (let i = 1; i < len; i++) {
      out[i] = f(as[i], bs[i])
    }
    return out
  }
  return []
})
const unzip = self => {
  const input = fromIterable(self)
  if (isNonEmptyReadonlyArray(input)) {
    const fa = [input[0][0]]
    const fb = [input[0][1]]
    for (let i = 1; i < input.length; i++) {
      fa[i] = input[i][0]
      fb[i] = input[i][1]
    }
    return [fa, fb]
  }
  return [[], []]
}
const intersperse = /* @__PURE__ */ dual(2, (self, middle) => {
  const input = fromIterable(self)
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty(input)]
    const tail2 = tailNonEmpty(input)
    for (let i = 0; i < tail2.length; i++) {
      if (i < tail2.length) {
        out.push(middle)
      }
      out.push(tail2[i])
    }
    return out
  }
  return []
})
const modifyNonEmptyHead = /* @__PURE__ */ dual(2, (self, f) => [
  f(headNonEmpty(self)),
  ...tailNonEmpty(self),
])
const setNonEmptyHead = /* @__PURE__ */ dual(2, (self, b) =>
  modifyNonEmptyHead(self, () => b),
)
const modifyNonEmptyLast = /* @__PURE__ */ dual(2, (self, f) =>
  append$1(initNonEmpty(self), f(lastNonEmpty(self))),
)
const setNonEmptyLast = /* @__PURE__ */ dual(2, (self, b) =>
  modifyNonEmptyLast(self, () => b),
)
const rotate = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self)
  if (isNonEmptyReadonlyArray(input)) {
    const len = input.length
    const m = Math.round(n) % len
    if (isOutOfBound(Math.abs(m), input) || m === 0) {
      return copy(input)
    }
    if (m < 0) {
      const [f, s] = splitNonEmptyAt(input, -m)
      return appendAll$1(s, f)
    } else {
      return rotate(self, m - len)
    }
  }
  return []
})
const containsWith = isEquivalent =>
  dual(2, (self, a) => {
    for (const i of self) {
      if (isEquivalent(a, i)) {
        return true
      }
    }
    return false
  })
const _equivalence = /* @__PURE__ */ equivalence()
const contains = /* @__PURE__ */ containsWith(_equivalence)
const chop = /* @__PURE__ */ dual(2, (self, f) => {
  const input = fromIterable(self)
  if (isNonEmptyReadonlyArray(input)) {
    const [b, rest] = f(input)
    const out = [b]
    let next = rest
    while (isNonEmptyArray$1(next)) {
      const [b2, rest2] = f(next)
      out.push(b2)
      next = rest2
    }
    return out
  }
  return []
})
const splitAt = /* @__PURE__ */ dual(2, (self, n) => {
  const input = Array.from(self)
  const _n = Math.floor(n)
  if (isNonEmptyReadonlyArray(input)) {
    if (_n >= 1) {
      return splitNonEmptyAt(input, _n)
    }
    return [[], input]
  }
  return [input, []]
})
const splitNonEmptyAt = /* @__PURE__ */ dual(2, (self, n) => {
  const _n = Math.max(1, Math.floor(n))
  return _n >= self.length
    ? [copy(self), []]
    : [prepend$1(self.slice(1, _n), headNonEmpty(self)), self.slice(_n)]
})
const split = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self)
  return chunksOf(input, Math.ceil(input.length / Math.floor(n)))
})
const splitWhere = /* @__PURE__ */ dual(2, (self, predicate) =>
  span(self, (a, i) => !predicate(a, i)),
)
const copy = self => self.slice()
const pad = /* @__PURE__ */ dual(3, (self, n, fill) => {
  if (self.length >= n) {
    return take(self, n)
  }
  return appendAll$1(
    self,
    makeBy(n - self.length, () => fill),
  )
})
const chunksOf = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable(self)
  if (isNonEmptyReadonlyArray(input)) {
    return chop(input, splitNonEmptyAt(n))
  }
  return []
})
const groupWith = /* @__PURE__ */ dual(2, (self, isEquivalent) =>
  chop(self, as => {
    const h = headNonEmpty(as)
    const out = [h]
    let i = 1
    for (; i < as.length; i++) {
      const a = as[i]
      if (isEquivalent(a, h)) {
        out.push(a)
      } else {
        break
      }
    }
    return [out, as.slice(i)]
  }),
)
const group = /* @__PURE__ */ groupWith(/* @__PURE__ */ equivalence())
const groupBy = /* @__PURE__ */ dual(2, (self, f) => {
  const out = {}
  for (const a of self) {
    const k = f(a)
    if (Object.prototype.hasOwnProperty.call(out, k)) {
      out[k].push(a)
    } else {
      out[k] = [a]
    }
  }
  return out
})
const unionWith = /* @__PURE__ */ dual(3, (self, that, isEquivalent) => {
  const a = fromIterable(self)
  const b = fromIterable(that)
  if (isNonEmptyReadonlyArray(a)) {
    if (isNonEmptyReadonlyArray(b)) {
      const dedupe2 = dedupeWith(isEquivalent)
      return dedupe2(appendAll$1(a, b))
    }
    return a
  }
  return b
})
const union = /* @__PURE__ */ dual(2, (self, that) =>
  unionWith(self, that, _equivalence),
)
const intersectionWith = isEquivalent => {
  const has = containsWith(isEquivalent)
  return dual(2, (self, that) => fromIterable(self).filter(a => has(that, a)))
}
const intersection = /* @__PURE__ */ intersectionWith(_equivalence)
const differenceWith = isEquivalent => {
  const has = containsWith(isEquivalent)
  return dual(2, (self, that) => fromIterable(self).filter(a => !has(that, a)))
}
const difference = /* @__PURE__ */ differenceWith(_equivalence)
const empty = () => []
const of$1 = a => [a]
const map = /* @__PURE__ */ dual(2, (self, f) => self.map(f))
const flatMap = /* @__PURE__ */ dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return []
  }
  const out = []
  for (let i = 0; i < self.length; i++) {
    const inner = f(self[i], i)
    for (let j = 0; j < inner.length; j++) {
      out.push(inner[j])
    }
  }
  return out
})
const flatten = /* @__PURE__ */ flatMap(identity)
const filterMap = /* @__PURE__ */ dual(2, (self, f) => {
  const as = fromIterable(self)
  const out = []
  for (let i = 0; i < as.length; i++) {
    const o = f(as[i], i)
    if (isSome(o)) {
      out.push(o.value)
    }
  }
  return out
})
const filterMapWhile = /* @__PURE__ */ dual(2, (self, f) => {
  let i = 0
  const out = []
  for (const a of self) {
    const b = f(a, i)
    if (isSome(b)) {
      out.push(b.value)
    } else {
      break
    }
    i++
  }
  return out
})
const partitionMap = /* @__PURE__ */ dual(2, (self, f) => {
  const left = []
  const right = []
  const as = fromIterable(self)
  for (let i = 0; i < as.length; i++) {
    const e = f(as[i], i)
    if (isLeft(e)) {
      left.push(e.left)
    } else {
      right.push(e.right)
    }
  }
  return [left, right]
})
const getSomes = /* @__PURE__ */ filterMap(identity)
const getLefts = self => {
  const out = []
  for (const a of self) {
    if (isLeft(a)) {
      out.push(a.left)
    }
  }
  return out
}
const getRights = self => {
  const out = []
  for (const a of self) {
    if (isRight(a)) {
      out.push(a.right)
    }
  }
  return out
}
const filter = /* @__PURE__ */ dual(2, (self, predicate) => {
  const as = fromIterable(self)
  const out = []
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      out.push(as[i])
    }
  }
  return out
})
const partition = /* @__PURE__ */ dual(2, (self, predicate) => {
  const left = []
  const right = []
  const as = fromIterable(self)
  for (let i = 0; i < as.length; i++) {
    if (predicate(as[i], i)) {
      right.push(as[i])
    } else {
      left.push(as[i])
    }
  }
  return [left, right]
})
const separate = /* @__PURE__ */ partitionMap(identity)
const reduce = /* @__PURE__ */ dual(3, (self, b, f) =>
  fromIterable(self).reduce((b2, a, i) => f(b2, a, i), b),
)
const reduceRight = /* @__PURE__ */ dual(3, (self, b, f) =>
  fromIterable(self).reduceRight((b2, a, i) => f(b2, a, i), b),
)
const liftPredicate = predicate => b => (predicate(b) ? [b] : [])
const liftOption =
  f =>
  (...a) =>
    fromOption(f(...a))
const fromNullable = a => (a == null ? empty() : [a])
const liftNullable =
  f =>
  (...a) =>
    fromNullable(f(...a))
const flatMapNullable = /* @__PURE__ */ dual(2, (self, f) =>
  flatMap(self, a => fromNullable(f(a))),
)
const liftEither =
  f =>
  (...a) => {
    const e = f(...a)
    return isLeft(e) ? [] : [e.right]
  }
const every = /* @__PURE__ */ dual(2, (self, refinement) =>
  self.every(refinement),
)
const some = /* @__PURE__ */ dual(2, (self, predicate) => self.some(predicate))
const extend = /* @__PURE__ */ dual(2, (self, f) =>
  self.map((_, i, as) => f(as.slice(i))),
)
const min$1 = /* @__PURE__ */ dual(2, (self, O) => self.reduce(min$2(O)))
const max$1 = /* @__PURE__ */ dual(2, (self, O) => self.reduce(max$2(O)))
const unfold = (b, f) => {
  const out = []
  let next = b
  let o
  while (isSome((o = f(next)))) {
    const [a, b2] = o.value
    out.push(a)
    next = b2
  }
  return out
}
const getOrder = array
const getEquivalence = array$1
const forEach = /* @__PURE__ */ dual(2, (self, f) =>
  fromIterable(self).forEach((a, i) => f(a, i)),
)
const dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const input = fromIterable(self)
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty(input)]
    const rest = tailNonEmpty(input)
    for (const r of rest) {
      if (out.every(a => !isEquivalent(r, a))) {
        out.push(r)
      }
    }
    return out
  }
  return []
})
const dedupe = self => dedupeWith(self, equivalence())
const dedupeAdjacentWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const out = []
  let lastA = none()
  for (const a of self) {
    if (isNone(lastA) || !isEquivalent(a, lastA.value)) {
      out.push(a)
      lastA = some$1(a)
    }
  }
  return out
})
const dedupeAdjacent = /* @__PURE__ */ dedupeAdjacentWith(
  /* @__PURE__ */ equivalence(),
)
const join = /* @__PURE__ */ dual(2, (self, sep) =>
  fromIterable(self).join(sep),
)
const mapAccum = /* @__PURE__ */ dual(3, (self, s, f) => {
  let i = 0
  let s1 = s
  const out = []
  for (const a of self) {
    const r = f(s1, a, i)
    s1 = r[0]
    out.push(r[1])
    i++
  }
  return [s1, out]
})
const cartesianWith = /* @__PURE__ */ dual(3, (self, that, f) =>
  flatMap(self, a => map(that, b => f(a, b))),
)
const cartesian = /* @__PURE__ */ dual(2, (self, that) =>
  cartesianWith(self, that, (a, b) => [a, b]),
)
const Do = /* @__PURE__ */ of$1({})
const bind = /* @__PURE__ */ bind$1(map, flatMap)
const bindTo = /* @__PURE__ */ bindTo$1(map)
const let_ = /* @__PURE__ */ let_$1(map)
const EffectArray = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Do,
      allocate,
      append: append$1,
      appendAll: appendAll$1,
      bind,
      bindTo,
      cartesian,
      cartesianWith,
      chop,
      chunksOf,
      contains,
      containsWith,
      copy,
      dedupe,
      dedupeAdjacent,
      dedupeAdjacentWith,
      dedupeWith,
      difference,
      differenceWith,
      drop,
      dropRight,
      dropWhile,
      empty,
      ensure,
      every,
      extend,
      filter,
      filterMap,
      filterMapWhile,
      findFirst,
      findFirstIndex,
      findLast,
      findLastIndex,
      flatMap,
      flatMapNullable,
      flatten,
      forEach,
      fromIterable,
      fromNullable,
      fromOption,
      fromRecord,
      get,
      getEquivalence,
      getLefts,
      getOrder,
      getRights,
      getSomes,
      group,
      groupBy,
      groupWith,
      head,
      headNonEmpty,
      init,
      initNonEmpty,
      insertAt,
      intersection,
      intersectionWith,
      intersperse,
      isArray,
      isEmptyArray,
      isEmptyReadonlyArray,
      isNonEmptyArray,
      isNonEmptyReadonlyArray,
      join,
      last,
      lastNonEmpty,
      length,
      let: let_,
      liftEither,
      liftNullable,
      liftOption,
      liftPredicate,
      make,
      makeBy,
      map,
      mapAccum,
      match,
      matchLeft,
      matchRight,
      max: max$1,
      min: min$1,
      modify,
      modifyNonEmptyHead,
      modifyNonEmptyLast,
      modifyOption,
      of: of$1,
      pad,
      partition,
      partitionMap,
      prepend: prepend$1,
      prependAll: prependAll$1,
      range,
      reduce,
      reduceRight,
      remove,
      replace,
      replaceOption,
      replicate,
      reverse,
      rotate,
      scan,
      scanRight,
      separate,
      setNonEmptyHead,
      setNonEmptyLast,
      some,
      sort,
      sortBy,
      sortWith,
      span,
      split,
      splitAt,
      splitNonEmptyAt,
      splitWhere,
      tail,
      tailNonEmpty,
      take,
      takeRight,
      takeWhile,
      unappend,
      unfold,
      union,
      unionWith,
      unprepend,
      unsafeGet,
      unzip,
      zip,
      zipWith,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
const isNumber = isNumber$1
const sum = /* @__PURE__ */ dual(2, (self, that) => self + that)
const multiply$1 = /* @__PURE__ */ dual(2, (self, that) => self * that)
const subtract$1 = /* @__PURE__ */ dual(2, (self, that) => self - that)
const divide = /* @__PURE__ */ dual(2, (self, that) =>
  that === 0 ? none$1 : some$2(self / that),
)
const unsafeDivide = /* @__PURE__ */ dual(2, (self, that) => self / that)
const increment = n => n + 1
const decrement = n => n - 1
const Equivalence$1 = number$2
const Order = number
const lessThan = /* @__PURE__ */ lessThan$1(Order)
const lessThanOrEqualTo = /* @__PURE__ */ lessThanOrEqualTo$1(Order)
const greaterThan = /* @__PURE__ */ greaterThan$1(Order)
const greaterThanOrEqualTo = /* @__PURE__ */ greaterThanOrEqualTo$1(Order)
const between = /* @__PURE__ */ between$1(Order)
const clamp = /* @__PURE__ */ clamp$2(Order)
const min = /* @__PURE__ */ min$2(Order)
const max = /* @__PURE__ */ max$2(Order)
const sign = n => Order(n, 0)
const sumAll = collection => {
  let out = 0
  for (const n of collection) {
    out += n
  }
  return out
}
const multiplyAll = collection => {
  let out = 1
  for (const n of collection) {
    if (n === 0) {
      return 0
    }
    out *= n
  }
  return out
}
const remainder = /* @__PURE__ */ dual(2, (self, divisor) => {
  const selfDecCount = (self.toString().split('.')[1] || '').length
  const divisorDecCount = (divisor.toString().split('.')[1] || '').length
  const decCount =
    selfDecCount > divisorDecCount ? selfDecCount : divisorDecCount
  const selfInt = parseInt(self.toFixed(decCount).replace('.', ''))
  const divisorInt = parseInt(divisor.toFixed(decCount).replace('.', ''))
  return (selfInt % divisorInt) / Math.pow(10, decCount)
})
const nextPow2 = n => {
  const nextPow = Math.ceil(Math.log(n) / Math.log(2))
  return Math.max(Math.pow(2, nextPow), 2)
}
const parse = s => {
  if (s === 'NaN') {
    return some$2(NaN)
  }
  if (s === 'Infinity') {
    return some$2(Infinity)
  }
  if (s === '-Infinity') {
    return some$2(-Infinity)
  }
  if (s.trim() === '') {
    return none$1
  }
  const n = Number(s)
  return Number.isNaN(n) ? none$1 : some$2(n)
}
const round = /* @__PURE__ */ dual(2, (self, precision) => {
  const factor = Math.pow(10, precision)
  return Math.round(self * factor) / factor
})
const Number$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Equivalence: Equivalence$1,
      Order,
      between,
      clamp,
      decrement,
      divide,
      greaterThan,
      greaterThanOrEqualTo,
      increment,
      isNumber,
      lessThan,
      lessThanOrEqualTo,
      max,
      min,
      multiply: multiply$1,
      multiplyAll,
      nextPow2,
      parse,
      remainder,
      round,
      sign,
      subtract: subtract$1,
      sum,
      sumAll,
      unsafeDivide,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
const omit = /* @__PURE__ */ dual(
  args => isObject(args[0]),
  (s, ...keys2) => {
    const out = {
      ...s,
    }
    for (const k of keys2) {
      delete out[k]
    }
    return out
  },
)
const style = (element2, key, value) => {
  element2.style.setProperty(key, value.toString())
  return element2
}
const styleC = (key, value) => element2 =>
  style(element2, key, value.toString())
const styles = (node, all2 = {}) => {
  if (!('style' in node)) return node
  const element2 = node,
    style2 = element2.style,
    {size, ...rest} = camelCaseKeys(all2)
  const styles2 = {
    ...rest,
    ...('size' in all2 ? monoRecord(size)(['width', 'height']) : {}),
  }
  for (const [key, value] of Object.entries(styles2)) {
    style2.setProperty(key, value.toString())
  }
  return element2
}
const stylesC = all2 => node => styles(node, all2)
const addClass = className => el => {
  el.classList.add(className)
  return el
}
const addClasses =
  (...classes) =>
  el => {
    el.classList.add(...classes)
    return el
  }
const removeClass = className => el => {
  el.classList.remove(className)
  return el
}
const styleWidth = n => styleC('width', px(n)),
  styleHeight = n => styleC('height', px(n))
const styleSize = ([w, h]) => flow(styleWidth(w), styleHeight(h))
const styleSquareSize = n => flow(styleWidth(n), styleHeight(n))
const absoluteSquareTopLeft = n =>
  stylesC({top: px(n), left: px(n), position: 'absolute'})
const styleLeft = left => styleC('left', px(left))
const styleTop = top => styleC('top', px(top))
const absolutePosition = (top, left) =>
  stylesC({top: px(top), left: px(left), position: 'absolute'})
const relativePosition = (top, left) =>
  stylesC({top: px(top), left: px(left), position: 'relative'})
const transformRight = left => styleC('transform', `translateX(${px(left)})`)
const transformDownRight = (top, left) =>
  styleC('transform', `translate(${px(left)}, ${px(top)})`)
const setZIndex = n => styleC('z-index', n.toString())
const setClipPath = clipId => styleC('clip-path', `url("#${clipId}")`)
const hideOverflow = styleC('overflow', 'hidden')
const scale = n => styleC('transform', `scale(${n.toString()})`)
const setBg = s => styleC('background', s)
const setVar = (key, value) => element2 =>
  style(element2, '--' + camelToDash(key), value.toString())
const setPxVar = (key, value) => setVar(key, px(value))
const minSize = {width: 'min-content', height: 'min-content'}
const element = (tag2, ...classes) => {
  const el = document.createElement(tag2)
  if (classes.length !== 0) {
    el.classList.add(...classes)
  }
  return el
}
const elementC =
  tag2 =>
  (...classes) =>
    element(tag2, ...classes)
const div = elementC('div')
const [h1, h2, h3, h4] = [
  elementC('h1'),
  elementC('h2'),
  elementC('h3'),
  elementC('h4'),
]
const text = s => element2 => {
  element2.innerText = s
  return element2
}
const attr = (element2, key, value) => {
  element2.setAttribute(key, value.toString())
  return element2
}
const attrC = (key, value) => element2 => attr(element2, key, value)
const attrs = (element2, all2) => {
  for (const [key, value] of Object.entries(all2)) {
    attr(element2, key, value)
  }
  return element2
}
const attrsC = all2 => element2 => attrs(element2, all2)
const setTabIndex = i => el => {
  attr(el, 'tabindex', i.toString())
  return el
}
const defineCustom =
  (tag2, ...classes) =>
  construct => {
    customElements.define(tag2, construct)
    return () => element(tag2, ...classes)
  }
const textDiv = s => pipe(div(), text(s))
const builderFor = () => (tag2, element2) => {
  const dom2 = defineCustom(tag2)(element2)
  return Object.assign(
    (props, ...classes) => pipe(dom2(), attrsC(props), addClasses(...classes)),
    {
      tag: tag2,
    },
  )
}
const append = parent => child => {
  parent.appendChild(child)
  return parent
}
const prepend = parent => child => {
  parent.prepend(child)
  return parent
}
const appendAll = parent => children => {
  for (const child of children) {
    parent.appendChild(child)
  }
  return parent
}
const prependAll = parent => children => {
  const nodes = Array.from(children)
  while (nodes.length !== 0) {
    const child = nodes.pop()
    if (child !== void 0) parent.prepend(child)
  }
  return parent
}
const [appendF, prependF] = [flip(append), flip(prepend)]
const [appendAllF, prependAllF] = [flip(appendAll), flip(prependAll)]
const erase = parent => {
  const nodes = Array.from(parent.childNodes)
  const cloned = nodes.map(element2 => element2.cloneNode(true))
  nodes.forEach(node => {
    node.remove()
  })
  return [parent, cloned]
}
const wrap =
  (...classes) =>
  element2 =>
    pipe(div(...classes), appendF(element2))
const appendTextDiv = flow(textDiv, appendF)
const mouseEnter = (instance, method) => element2 => {
  element2.addEventListener('mouseenter', method.bind(instance))
  return element2
}
const mouseLeave = (instance, method) => element2 => {
  element2.addEventListener('mouseleave', method.bind(instance))
  return element2
}
const pointerDown = (instance, method) => element2 => {
  const f = method.bind(instance)
  element2.addEventListener('pointerdown', e => {
    const event = e
    f(event)
    element2.setPointerCapture(event.pointerId)
  })
  return element2
}
const pointerUp = (instance, method, action) => element2 => {
  const [f, g] = [method.bind(instance), action.bind(instance)]
  element2.addEventListener('pointerup', e => {
    const event = e
    f()
    element2.releasePointerCapture(event.pointerId)
    if (
      instance.contains(document.elementFromPoint(event.clientX, event.clientY))
    )
      g(event)
  })
  return element2
}
const keyDown = (instance, method) => element2 => {
  const f = method.bind(instance)
  element2.addEventListener('keydown', e => {
    f(e)
  })
}
const keyUp = (instance, method) => element2 => {
  const f = method.bind(instance)
  element2.addEventListener('keyup', e => {
    f(e)
  })
}
const measureElement = element2 => {
  const width = element2.getBoundingClientRect().width
  pipe(element2, setPxVar('width', width))
  return width
}
const joinPath = flow(
  map(s => s.toString()),
  join(' '),
)
const arcPath =
  (direction, inset = false) =>
  radius => [
    'a',
    ...dup(radius),
    `0 0${(inset ? 0 : 1).toString()}0`,
    (direction === 'up' ? -2 : 2) * radius,
  ]
const [arcUp, arcDown] = [arcPath('up'), arcPath('down')],
  [insetArcUp, insetArcDown] = [arcPath('up', true), arcPath('down', true)]
const roundRect = (radius, foci = 0, moveX = 0, moveY = 0) => [
  'm',
  moveX,
  moveY,
  ...arcDown(radius),
  ...(foci === 0 ? [] : ['l', -1 * foci, 0]),
  ...arcUp(radius),
  ...(foci === 0 ? [] : ['l', 1 * foci, 0]),
]
const circle = (radius, moveX = 0, moveY = 0) =>
  roundRect(radius, 0, moveX, moveY)
const circleRing = (radius, radialWidth) => [
  ...circle(radius, radius),
  ...circle(radius - radialWidth, 0, radialWidth),
]
const [line, move] = [
  (x, y) => `l${x.toString()} ${y.toString()}`,
  (x, y) => `m${x.toString()} ${y.toString()}`,
]
const roundRectRing = (radius, radialWidth, foci) => [
  ...roundRect(radius, foci, radius + foci),
  ...roundRect(radius - radialWidth, foci, 0, radialWidth),
]
roundRect.size = (radius, foci) => [2 * radius + foci, 2 * radius]
const tongue = (radius, foci) => {
  const rf = radius + foci,
    [lineLeft, lineRight] = [line(-1 * rf, 0), line(rf, 0)]
  return [
    move(rf, 0),
    ...arcDown(radius),
    lineRight,
    ...insetArcUp(radius),
    lineLeft,
    ...insetArcDown(radius),
    lineLeft,
    ...arcUp(radius),
    'z',
  ]
}
tongue.size = (radius, foci) => [2 * radius + 2 * foci, 2 * radius]
const scalePath = scale2 => xs =>
  xs
    .split(' ')
    .map(x => (x === '0' ? 0 : x === '1' ? 1 : parseFloat(x) * scale2))
    .map(s => (s === 0 ? '0' : s === 1 ? '1' : s.toFixed(3)))
const moon = radius => {
  const scale2 = scalePath(2 * radius)
  return [
    'm',
    ...scale2('0.5 0'),
    'a',
    ...scale2('0.5 0.5 0 0 0 -0.3 0.48'),
    'a',
    ...scale2('0.5 0.5 0 0 0 0.4 0.48'),
    'a',
    ...scale2('0.5 0.5 0 0 1 -0.1 0'),
    'a',
    ...scale2('0.5 0.5 0 0 1 -0.5 -0.48'),
    'a',
    ...scale2('0.5 0.5 0 0 1 0.4 -0.48'),
  ]
}
const curry = f => a => b => f(a, b)
const sumU = (self, that) => self + that,
  multiplyU = (self, that) => self * that,
  sumC = curry(sumU),
  multiplyC = curry(multiplyU)
const build = (fst, snd) => [fst, snd],
  buildC = fst => snd => [fst, snd]
const of =
  (k1, k2) =>
  ([fst, snd]) => ({
    [k1]: fst,
    [k2]: snd,
  })
const square = size => ({
  size: dup(size),
  center: dup(size / 2),
})
const Equivalence = getEquivalence$1(Equivalence$1, Equivalence$1)
const centerToTopLeft = ({center, size}) => subtract(center, half(size))
const centerInside = parentSize => childSize =>
  half(subtract(parentSize, childSize))
const show = ([first, second]) => `[${first.toString()}:${second.toString()}]`
const zero = [0, 0],
  zero4 = {center: zero, size: zero},
  unit = [1, 1],
  add = ([a, b], [c, d]) => [a + c, b + d],
  addC = curry(add),
  subtract = ([a, b], [c, d]) => [a - c, b - d],
  isZero = ([fst, snd]) => fst === 0 && snd === 0,
  toSize = of('width', 'height'),
  toPxSize = v2 => pipe(v2, toSize, pxs),
  toTopLeft = of('top', 'left'),
  toPxTopLeft = v2 => pipe(v2, toTopLeft, pxs),
  toXY = v4 => pipe(v4, centerToTopLeft, of('x', 'y')),
  fromFirst = n => build(n, 0),
  fromSecond = n => build(0, n),
  fromTop = fromFirst,
  fromLeft = fromSecond,
  fromWidth = fromFirst,
  fromHeight = fromSecond,
  pxBoth = v2 => pipe(v2, pairMapC(px)),
  addFirst = n => pipe(n, sumC, modFirst),
  addSecond = n => pipe(n, sumC, modSecond),
  multiplyFirst = n => pipe(n, multiplyC, modFirst),
  multiplySecond = n => pipe(n, multiplyC, modSecond),
  multiply = n => pipe(n, multiplyC, pairMapC),
  mirror = v2 => pipe(v2, multiply(-1)),
  negateFirst = v2 => pipe(v2, multiplyFirst(-1)),
  negateSecond = v2 => pipe(v2, multiplySecond(-1)),
  doubleFirst = v2 => pipe(v2, multiplyFirst(2)),
  doubleSecond = v2 => pipe(v2, multiplySecond(2)),
  double = v2 => pipe(v2, doubleFirst, doubleSecond),
  halfFirst = v2 => pipe(v2, multiplyFirst(1 / 2)),
  halfSecond = v2 => pipe(v2, multiplySecond(1 / 2)),
  half = flow(halfFirst, halfSecond),
  subtractC = curry(add),
  subtractFirst = n => pipe(n, fromFirst, mirror, addC),
  subtractSecond = n => pipe(n, fromSecond, mirror, addC),
  circumference = ([fst, snd]) => 2 * (fst + snd),
  absFirst = ([first]) => Math.abs(first),
  absSecond = ([, second]) => Math.abs(second),
  distanceFromOrigin = ([first, second]) => Math.sqrt(first ** 2 + second ** 2)
const modCenter =
    f =>
    ({center, size}) => ({center: f(center), size}),
  modSize =
    f =>
    ({center, size}) => ({center, size: f(size)})
const layout = v4 =>
  pxs({...pipe(v4, centerToTopLeft, toTopLeft), ...toSize(v4.size)})
const absoluteLayout = v4 => ({...layout(v4), position: 'absolute'})
const svgLayout$1 = ({center, size}) => ({
  ...toXY({center, size}),
  ...toSize(size),
})
const squarePxSize = n => ({width: px(n), height: px(n)})
const squareAbsolute = n => ({
  top: px(n),
  left: px(n),
  position: 'absolute',
})
const Vec = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Equivalence,
      absFirst,
      absSecond,
      absoluteLayout,
      add,
      addC,
      addFirst,
      addSecond,
      build,
      buildC,
      centerInside,
      centerToTopLeft,
      circumference,
      distanceFromOrigin,
      double,
      doubleFirst,
      doubleSecond,
      fromFirst,
      fromHeight,
      fromLeft,
      fromSecond,
      fromTop,
      fromWidth,
      half,
      halfFirst,
      halfSecond,
      isZero,
      layout,
      mirror,
      modCenter,
      modSize,
      multiply,
      multiplyFirst,
      multiplySecond,
      negateFirst,
      negateSecond,
      of,
      pxBoth,
      show,
      square,
      squareAbsolute,
      squarePxSize,
      subtract,
      subtractC,
      subtractFirst,
      subtractSecond,
      svgLayout: svgLayout$1,
      toPxSize,
      toPxTopLeft,
      toSize,
      toTopLeft,
      toXY,
      unit,
      zero,
      zero4,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const uncurry = f => (a, b) => f(a)(b)
const svgElement = tag2 => document.createElementNS(SVG_NAMESPACE, tag2)
const svgAttr = key => value => element2 => {
  element2.setAttributeNS(null, key, value.toString())
  return element2
}
const svgAttrU = uncurry(svgAttr)
const svgAttrs = all2 => element2 => {
  for (const [key, value] of Object.entries(all2)) {
    pipe(element2, svgAttrU(key, value))
  }
  return element2
}
const makeSvg = () => svgElement('svg'),
  makeRect = () => svgElement('rect'),
  makeClipPath = () => svgElement('clipPath'),
  svgId = svgAttr('id'),
  svgD = flow(joinPath, svgAttr('d')),
  svgX = svgAttr('x'),
  svgY = svgAttr('y'),
  svgRx = svgAttr('rx'),
  svgRy = svgAttr('ry'),
  svgWidth = svgAttr('width'),
  svgHeight = svgAttr('height'),
  svgRxRy = radius => flow(svgRx(radius), svgRy(radius)),
  svgLayout = flow(svgLayout$1, svgAttrs),
  svgClass = svgAttr('class')
const singletonSvg = element2 => pipe(element2, append(makeSvg()))
const svgDefs = defs => pipe('defs', svgElement, appendAllF(defs))
const svgClipPath = (id, path) =>
  pipe(path, makePath, pipe(makeClipPath(), svgId(id), append))
const defineClipPaths = idToPath => {
  const nodes = []
  for (const [id, path] of Object.entries(idToPath)) {
    nodes.push(svgClipPath(id, path))
  }
  return pipe(makeSvg(), svgClass('defs'), pipe(nodes, svgDefs, appendF))
}
const makePath = path => pipe('path', svgElement, svgD(path))
const svgPath = path => pipe(path, makePath, append(makeSvg()))
const svgPathAtLength = length2 => path =>
  pipe(path, makePath, attrC('pathLength', length2), append(makeSvg()))
const computeDashFor = (outlineWidth2, dashRatio2) => length2 =>
  length2 / Math.floor(length2 / (outlineWidth2 * dashRatio2))
const computeDash$1 = (outlineWidth2, dashRatio2) => path =>
  computeDashFor(outlineWidth2, dashRatio2)(path.getTotalLength())
const svgRect = ({
  radius,
  hfoci,
  vfoci,
  outlineGap: outlineGap2,
  outlineWidth: outlineWidth2,
}) => {
  const size = pipe([hfoci, vfoci], pipe(2 * radius, dup, addC)),
    gapSize = add(size, dup(outlineGap2 + outlineWidth2))
  return pipe(
    makeRect(),
    attrsC({
      x: 0,
      //3 * outlineWidth / 2,
      y: 0,
      rx: radius,
      ry: radius,
      ...toPxSize(size),
    }),
    singletonSvg,
    pipe(gapSize, toPxSize, stylesC),
  )
}
svgRect.pathLength = (radius, hfoci, vfoci) =>
  2 * Math.PI * radius + 2 * (hfoci + vfoci)
const media = () => window.matchMedia('(prefers-color-scheme: dark)')
const matchMedia = () => (media().matches ? 'dark' : 'light')
const setTheme = theme => {
  document.documentElement.style.colorScheme = theme
  const html = document.querySelector('html')
  if (html === null) return
  html.dataset['theme'] = theme
}
const getTheme = () => {
  var _a
  return ((_a = document.querySelector('html')) == null
    ? void 0
    : _a.dataset['theme']) === 'light'
    ? 'light'
    : 'dark'
}
const onThemeChange = handler => {
  media().addEventListener('change', () => {
    handler(getTheme())
  })
}
setTheme(matchMedia())
const dom$c = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      SVG_NAMESPACE,
      absolutePosition,
      absoluteSquareTopLeft,
      addClass,
      addClasses,
      append,
      appendAll,
      appendAllF,
      appendF,
      appendTextDiv,
      attr,
      attrC,
      attrs,
      attrsC,
      builderFor,
      circle,
      circleRing,
      computeDash: computeDash$1,
      computeDashFor,
      defineClipPaths,
      defineCustom,
      div,
      element,
      elementC,
      erase,
      getTheme,
      h1,
      h2,
      h3,
      h4,
      hideOverflow,
      joinPath,
      keyDown,
      keyUp,
      makeClipPath,
      makePath,
      makeRect,
      makeSvg,
      matchMedia,
      measureElement,
      media,
      minSize,
      moon,
      mouseEnter,
      mouseLeave,
      onThemeChange,
      pointerDown,
      pointerUp,
      prepend,
      prependAll,
      prependAllF,
      prependF,
      relativePosition,
      removeClass,
      roundRect,
      roundRectRing,
      scale,
      setBg,
      setClipPath,
      setPxVar,
      setTabIndex,
      setTheme,
      setVar,
      setZIndex,
      singletonSvg,
      style,
      styleC,
      styleHeight,
      styleLeft,
      styleSize,
      styleSquareSize,
      styleTop,
      styleWidth,
      styles,
      stylesC,
      svgAttr,
      svgAttrU,
      svgAttrs,
      svgClass,
      svgClipPath,
      svgD,
      svgDefs,
      svgElement,
      svgHeight,
      svgId,
      svgLayout,
      svgPath,
      svgPathAtLength,
      svgRect,
      svgRx,
      svgRxRy,
      svgRy,
      svgWidth,
      svgX,
      svgY,
      text,
      textDiv,
      tongue,
      transformDownRight,
      transformRight,
      wrap,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
const camelToDash = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
const mapValues = f => o => {
  const results = {}
  for (const [key, value] of Object.entries(o)) {
    results[key] = f(value)
  }
  return results
}
const camelCaseKeys = o => {
  const results = {}
  for (const [key, value] of Object.entries(o)) {
    results[camelToDash(key)] = value
  }
  return results
}
const px = px2 => `${px2.toFixed(3)}px`
const pxs = pxs2 => pipe(pxs2, mapValues(px))
const monoRecord = value => keys2 => {
  const result = {}
  for (const key of keys2) {
    result[key] = value
  }
  return result
}
const mapTuple3 =
  f =>
  ([a1, a2, a3]) => [f(a1), f(a2), f(a3)]
const dup = a => [a, a]
const pairMapC =
  f =>
  ([a, b]) => [f(a), f(b)]
const modFirst =
    f =>
    ([a, b]) => [f(a), b],
  modSecond =
    f =>
    ([a, b]) => [a, f(b)]
const AR = EffectArray
const util = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      AR,
      K: constant,
      NU: Number$1,
      SVG_NAMESPACE,
      absolutePosition,
      absoluteSquareTopLeft,
      addClass,
      addClasses,
      append,
      appendAll,
      appendAllF,
      appendF,
      appendTextDiv,
      apply,
      attr,
      attrC,
      attrs,
      attrsC,
      builderFor,
      camelCaseKeys,
      camelToDash,
      circle,
      circleRing,
      compose,
      computeDash: computeDash$1,
      computeDashFor,
      constFalse,
      constNull,
      constTrue,
      constUndefined,
      defineClipPaths,
      defineCustom,
      div,
      dup,
      element,
      elementC,
      erase,
      flip,
      flow,
      getFirst,
      getSecond,
      getTheme,
      h1,
      h2,
      h3,
      h4,
      hideOverflow,
      id: identity,
      joinPath,
      keyDown,
      keyUp,
      makeClipPath,
      makePath,
      makeRect,
      makeSvg,
      mapFirst,
      mapSecond,
      mapTuple3,
      mapValues,
      matchMedia,
      measureElement,
      media,
      minSize,
      modFirst,
      modSecond,
      monoRecord,
      moon,
      mouseEnter,
      mouseLeave,
      omit,
      onThemeChange,
      pairMapC,
      pipe,
      pointerDown,
      pointerUp,
      prepend,
      prependAll,
      prependAllF,
      prependF,
      px,
      pxs,
      relativePosition,
      removeClass,
      roundRect,
      roundRectRing,
      scale,
      setBg,
      setClipPath,
      setPxVar,
      setTabIndex,
      setTheme,
      setVar,
      setZIndex,
      singletonSvg,
      style,
      styleC,
      styleHeight,
      styleLeft,
      styleSize,
      styleSquareSize,
      styleTop,
      styleWidth,
      styles,
      stylesC,
      svgAttr,
      svgAttrU,
      svgAttrs,
      svgClass,
      svgClipPath,
      svgD,
      svgDefs,
      svgElement,
      svgHeight,
      svgId,
      svgLayout,
      svgPath,
      svgPathAtLength,
      svgRect,
      svgRx,
      svgRxRy,
      svgRy,
      svgWidth,
      svgX,
      svgY,
      text,
      textDiv,
      tongue,
      transformDownRight,
      transformRight,
      tupled,
      untupled,
      unzip,
      wrap,
      zip,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class Base extends HTMLElement {
  constructor() {
    super()
    __privateAdd(this, _id)
    __privateAdd(this, _connected, false)
    __privateSet(this, _id, nextId())
  }
  get connected() {
    return __privateGet(this, _connected)
  }
  get id() {
    return __privateGet(this, _id)
  }
  get clipId() {
    return `clip-${this.id}`
  }
  get clipPathStyle() {
    return {
      clipPath: `url('#${this.clipId}')`,
    }
  }
  getIntAttribute(name) {
    return Number.parseInt(this.getAttribute(name) ?? '0')
  }
  getBooleanAttribute(name) {
    return (this.getAttribute(name) ?? 'false') === 'true'
  }
  toggleBooleanAttribute(name) {
    this.setAttribute(name, (!this.getBooleanAttribute(name)).toString())
    return this
  }
  getFloatAttribute(name) {
    return Number.parseFloat(this.getAttribute(name) ?? '0')
  }
  getFloatStyle(name) {
    return Number.parseFloat(getComputedStyle(this).getPropertyValue(name))
  }
  getPxStyle(name) {
    return Number.parseFloat(
      getComputedStyle(this).getPropertyValue(name).replaceAll('px', ''),
    )
  }
  setAbsolute() {
    style(this, 'position', 'absolute')
    return this
  }
  setTop(n) {
    return style(this, 'top', px(n))
  }
  setLeft(n) {
    return style(this, 'left', px(n))
  }
  setSize(size) {
    return styles(this, toPxSize(size))
  }
  setTopLeft(topLeft) {
    return styles(this, toPxTopLeft(topLeft))
  }
  setPxVar(name, n) {
    return style(this, `--${camelToDash(name)}`, px(n))
  }
  setPxVars(all2) {
    for (const [name, n] of Object.entries(all2)) this.setPxVar(name, n)
    return this
  }
  onMouseEnter(element2, method) {
    pipe(element2, mouseEnter(this, method))
    return this
  }
  onMouseLeave(element2, method) {
    pipe(element2, mouseLeave(this, method))
    return this
  }
  onPointerDown(element2, method) {
    pipe(element2, pointerDown(this, method))
    return this
  }
  onPointerUp(element2, method, action) {
    pipe(element2, pointerUp(this, method, action))
    return this
  }
  onKeyDown(element2, method) {
    pipe(element2, keyDown(this, method))
    return this
  }
  onKeyUp(element2, method) {
    pipe(element2, keyUp(this, method))
    return this
  }
  buildChildren() {
    return []
  }
  buildAttributes() {
    return {}
  }
  buildStyle() {
    return {
      display: 'block',
    }
  }
  syncStyle() {
    styles(this, this.buildStyle())
  }
  connectedCallback() {
    if (this.connected) return
    const children = this.buildChildren()
    if (children.length !== 0) this.append(...children)
    attrs(this, this.buildAttributes())
    this.syncStyle()
    __privateSet(this, _connected, true)
  }
}
_id = new WeakMap()
_connected = new WeakMap()
const nextId = /* @__PURE__ */ (() => {
  let i = 0
  return () => 'id-' + (++i).toString()
})()
const Base$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Base,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class Circle extends Base {
  get radius() {
    return this.getFloatAttribute('radius')
  }
  get size() {
    return 2 * this.radius
  }
  buildStyle() {
    const {radius, size} = this
    return {
      '--radius': px(radius),
      ...super.buildStyle(),
      ...squarePxSize(size),
    }
  }
}
const dom$b = builderFor()('x-circle', Circle)
const Circle$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Circle,
      dom: dom$b,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class RoundRect extends Base {
  get radius() {
    return this.getFloatAttribute('radius')
  }
  get foci() {
    return this.getFloatAttribute('foci')
  }
  buildStyle() {
    const {radius, foci} = this
    return {
      '--radius': px(radius),
      '--foci': px(foci),
      ...super.buildStyle(),
      ...toPxSize(roundRect.size(radius, foci)),
    }
  }
}
const dom$a = builderFor()('round-rect', RoundRect)
const RoundRect$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      RoundRect,
      dom: dom$a,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
const outlineWidth$1 = 2,
  dashRatio$1 = 1.5,
  outlineGap$1 = 3 * outlineWidth$1
class FocusFrame extends RoundRect {
  buildChildren() {
    const {foci, radius} = this
    const svg = pipe(
      {
        radius,
        hfoci: foci,
        vfoci: 0,
        outlineGap: outlineGap$1,
        outlineWidth: outlineWidth$1,
      },
      svgRect,
    )
    return [...super.buildChildren(), svg]
  }
  buildStyle() {
    const {foci, radius} = this
    const size = add(
      [2 * radius + foci, 2 * radius],
      dup(2 * (outlineGap$1 + outlineWidth$1)),
    )
    const dash = pipe(
      svgRect.pathLength(radius, foci, 0),
      computeDashFor(outlineWidth$1, dashRatio$1),
    )
    return {
      ...super.buildStyle(),
      ...toPxSize(size),
      '--outline': px(outlineWidth$1),
      '--dash': dash,
    }
  }
}
const dom$9 = builderFor()('focus-frame', FocusFrame)
const FocusFrame$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      FocusFrame,
      dashRatio: dashRatio$1,
      dom: dom$9,
      outlineGap: outlineGap$1,
      outlineWidth: outlineWidth$1,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
const tag = 'x-knob'
const [knobRadiiRatio, knobMiddleRingRatio] = [[1, 0.7, 0.75], 1 / 4]
const unfoldRings = radius => {
  const radii = pipe(knobRadiiRatio, pipe(radius, multiply$1, mapTuple3)),
    outerWidth = 2 * (radii[0] - radii[1]),
    middleWidth = outerWidth * knobMiddleRingRatio
  return [
    {radius: radii[0] * 2, radialWidth: outerWidth},
    {radius: radii[1] * 2, radialWidth: outerWidth / 2},
    {radius: radii[2] * 2, radialWidth: middleWidth},
  ]
}
class Knob extends Circle {
  buildChildren() {
    const [outer, inner, middle] = pipe(
      this.radius / 2,
      unfoldRings,
      mapTuple3(dom$3),
    )
    pipe(inner, addClass('g-shinyBottom'))
    pipe(outer, addClass('g-shinyTop'))
    pipe(middle, styleC('background', '#bbb7'))
    return [
      pipe(outer, pipe(outer.size, square, absoluteLayout, stylesC)),
      inner.moveCenterOf(outer.size).setAbsolute(),
      middle.moveCenterOf(outer.size).setAbsolute(),
    ]
  }
}
const dom$8 = builderFor()(tag, Knob)
const Knob$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Knob,
      dom: dom$8,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class Moon extends Circle {
  buildChildren() {
    const {radius} = this
    return pipe({[this.clipId]: moon(radius)}, defineClipPaths, AR.of)
  }
  buildStyle() {
    return {...super.buildStyle(), ...this.clipPathStyle}
  }
}
const dom$7 = builderFor()('x-moon', Moon)
const Moon$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Moon,
      dom: dom$7,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class SkyMoon extends Circle {
  get innerRadius() {
    return Math.round((2 * this.radius) / 3)
  }
  buildChildren() {
    const {radius: outerRadius, innerRadius} = this,
      radiusΔ = outerRadius - innerRadius
    return [
      pipe(
        {radius: innerRadius},
        dom$b,
        transformDownRight(...dup(radiusΔ)),
        pipe({radius: innerRadius}, dom$7, appendF),
      ),
    ]
  }
}
const dom$6 = builderFor()('sky-moon', SkyMoon)
const SkyMoon$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      SkyMoon,
      dom: dom$6,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class SkySun extends Circle {
  get innerRadius() {
    return Math.round((2 * this.radius) / 3)
  }
  buildChildren() {
    const {radius: outerRadius, innerRadius} = this,
      radiusΔ = outerRadius - innerRadius
    return [
      pipe({radius: innerRadius}, dom$b, transformDownRight(...dup(radiusΔ))),
    ]
  }
}
const dom$5 = builderFor()('sky-sun', SkySun)
const SkySun$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      SkySun,
      dom: dom$5,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class MoonSun extends Base {
  get radius() {
    return this.getFloatAttribute('radius')
  }
  get foci() {
    return this.getFloatAttribute('foci')
  }
  buildChildren() {
    const {radius, foci} = this
    return [
      pipe({radius, foci}, dom$a, addClass('g-dullBottomWide')).setAbsolute(),
      pipe({radius}, dom$6).setAbsolute(),
      pipe({radius}, dom$5, transformRight(foci)).setAbsolute(),
    ]
  }
  buildStyle() {
    const {radius, foci} = this
    return {
      '--radius': px(radius),
      '--foci': px(foci),
      ...super.buildStyle(),
      ...toPxSize(roundRect.size(radius, foci)),
    }
  }
}
const dom$4 = builderFor()('moon-sun', MoonSun)
const MoonSun$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      MoonSun,
      dom: dom$4,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class Ring extends Circle {
  get radialWidth() {
    return this.getFloatAttribute('radialWidth')
  }
  get maxRadialWidth() {
    return this.radialWidth + (this.radius - this.radialWidth) / 3.5
  }
  get activeClipId() {
    return `clip-${this.id}-active`
  }
  moveCenterOf(outerSize) {
    return this.setTopLeft(
      pipe(this.size, dup, pipe(outerSize, dup, centerInside)),
    )
  }
  buildChildren() {
    return [
      defineClipPaths({
        [this.clipId]: circleRing(this.radius, this.radialWidth),
        [this.activeClipId]: circleRing(this.radius, this.maxRadialWidth),
      }),
    ]
  }
  buildStyle() {
    return {
      '--radialWidth': px(this.radialWidth),
      '--activeClipId': `url(#${this.activeClipId})`,
      '--clipId': `url(#${this.clipId})`,
      ...super.buildStyle(),
    }
  }
}
const dom$3 = builderFor()('x-ring', Ring)
const Ring$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Ring,
      dom: dom$3,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class RoundRectRing extends RoundRect {
  get radialWidth() {
    return this.getFloatAttribute('radialWidth')
  }
  buildChildren() {
    return pipe(
      {
        [this.clipId]: roundRectRing(this.radius, this.radialWidth, this.foci),
      },
      defineClipPaths,
      of$1,
    )
  }
  buildStyle() {
    return {
      '--radialWidth': px(this.radialWidth),
      ...super.buildStyle(),
      ...this.clipPathStyle,
    }
  }
}
const dom$2 = builderFor()('round-rect-ring', RoundRectRing)
const RoundRectRing$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      RoundRectRing,
      dom: dom$2,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class Tongue extends Base {
  get radius() {
    return this.getFloatAttribute('radius')
  }
  get foci() {
    return this.getFloatAttribute('foci')
  }
  buildChildren() {
    return pipe(
      {[this.clipId]: tongue(this.radius, this.foci)},
      defineClipPaths,
      AR.of,
    )
  }
  buildStyle() {
    const {radius, foci} = this
    return {
      '--radius': px(radius),
      '--foci': px(foci),
      ...super.buildStyle(),
      ...toPxSize(tongue.size(radius, foci)),
      ...this.clipPathStyle,
    }
  }
}
const dom$1 = builderFor()('x-tongue', Tongue)
const Tongue$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      Tongue,
      dom: dom$1,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
class ThemeToggleBase extends Base {
  constructor() {
    super()
    onThemeChange(this.toggle.bind(this))
    this.addEventListener('blur', this.unsetActive.bind(this))
  }
  get hover() {
    return this.hasAttribute('hover')
  }
  get active() {
    return this.hasAttribute('active')
  }
  setHover() {
    this.setAttribute('hover', 'true')
    return this
  }
  unsetHover() {
    this.removeAttribute('hover')
    return this
  }
  setActive() {
    this.setAttribute('active', 'true')
    return this
  }
  unsetActive() {
    this.removeAttribute('active')
    return this
  }
  get theme() {
    return this.getAttribute('theme') === 'dark' ? 'dark' : 'light'
  }
  get isLight() {
    return this.theme === 'light'
  }
  get isDark() {
    return this.theme === 'dark'
  }
  setLight() {
    this.setAttribute('theme', 'light')
    setTheme('light')
    return this
  }
  setDark() {
    this.setAttribute('theme', 'dark')
    setTheme('dark')
    return this
  }
  get innerRadius() {
    return this.getFloatAttribute('innerRadius')
  }
  get outerRadius() {
    return this.getFloatAttribute('outerRadius')
  }
  get frameRadialWidth() {
    return this.getFloatAttribute('frameRadialWidth')
  }
  tongueRightShift(isLight) {
    return isLight ? -2 * this.outerRadius : 0
  }
  knobRightShift(isLight) {
    return isLight ? 0 : 2 * this.outerRadius
  }
  toggle() {
    const isLight = this.isLight
    this[isLight ? 'setDark' : 'setLight']()
    return this.setPxVars({
      knobRightShift: this.knobRightShift(isLight),
      tongueRightShift: this.tongueRightShift(isLight),
    })
  }
  handleKeyDown({code}) {
    if (code === 'Enter' || code === 'KeyZ') {
      this.setActive()
    }
    return this
  }
  handleKeyUp(event) {
    const {code} = event
    if (code === 'Escape') {
      this.blur()
    } else if (code === 'Enter' || code === 'KeyZ') {
      this.unsetActive()
      this.toggle()
      event.preventDefault()
    }
    return this
  }
  get clipId() {
    return `clip-${this.id}`
  }
  buildAttributes() {
    return {...super.buildAttributes(), theme: matchMedia()}
  }
}
const [outlineWidth, dashRatio] = [2, 1.5],
  [outlineWidthHalf, gap] = [outlineWidth / 2, 3 * outlineWidth],
  [outlineGap, gapHalf] = [gap / 3, gap],
  [gapW, gapH] = [gap + 2 * outlineWidth - outlineGap, gap + outlineWidth - 1]
const computeDash = computeDash$1(outlineWidth, dashRatio)
const addPositionGap = flow(addC([gapH, gapW]), tupled(absolutePosition))
const addOutline = size =>
  pipe(
    size,
    pipe(gap + outlineGap, dup, addC([outlineWidth, outlineWidthHalf]), addC),
    toPxSize,
  )
const [makeTongue, makeFrame] = [
  props => dom$1(props, 'g-dullBottom'),
  props => dom$2(props, 'g-shinyTopWide'),
]
class ThemeToggle extends ThemeToggleBase {
  buildChildren() {
    const {
        innerRadius: inner,
        outerRadius: outer,
        frameRadialWidth: radialWidth,
      } = this,
      radiusΔ = outer - inner,
      frameΔ = radiusΔ - radialWidth,
      foci = 2 * outer,
      [tongueRadius, outerGap] = [inner + radialWidth, outer + gap - 1]
    const knobPosition = transformDownRight(gapH, gapW),
      tonguePosition = pipe(radiusΔ, dup, addPositionGap),
      framePosition = pipe(frameΔ, dup, addPositionGap),
      focusPosition = absolutePosition(0, outlineGap)
    const tongueClip = pipe(
      div(),
      tonguePosition,
      setClipPath(this.clipId),
      append,
    )
    const focusPath = makePath(
      roundRect(
        outerGap,
        foci,
        foci + outerGap + outlineWidthHalf,
        outlineWidth,
      ),
    )
    const focusPathSize = pipe(
      [outerGap, foci],
      tupled(roundRect.size),
      pipe(gapHalf, dup, addC),
    )
    const elements = [
      pipe({radius: tongueRadius, foci, radialWidth}, makeFrame, framePosition),
      pipe({radius: inner, foci}, makeTongue, tongueClip),
      pipe({radius: outer}, dom$8, knobPosition),
    ]
    for (const element2 of elements) {
      this.onMouseEnter(element2, this.setHover)
      this.onMouseLeave(element2, this.unsetHover)
      this.onPointerDown(element2, this.setActive)
      this.onPointerUp(element2, this.unsetActive, this.toggle)
    }
    this.onKeyDown(this, this.handleKeyDown)
    this.onKeyUp(this, this.handleKeyUp)
    return [
      ...super.buildChildren(),
      pipe(
        focusPath,
        singletonSvg,
        styleSize(focusPathSize),
        focusPosition,
        setVar('dash', computeDash(focusPath)),
        addClass('theme-toggle-focus-ring'),
      ),
      pipe({radius: inner, foci}, dom$4, tonguePosition),
      ...elements,
      defineClipPaths({
        [this.clipId]: roundRect(inner, foci, foci + inner),
      }),
    ]
  }
  buildStyle() {
    const {innerRadius, outerRadius, frameRadialWidth, isLight} = this
    return {
      '--outlineWidth': px(outlineWidth),
      '--innerRadius': px(innerRadius),
      '--outerRadius': px(outerRadius),
      '--frameRadialWidth': px(frameRadialWidth),
      '--tongueRightShift': px(this.tongueRightShift(!isLight)),
      '--knobRightShift': px(this.knobRightShift(!isLight)),
      ...super.buildStyle(),
      ...pipe(
        tongue.size(outerRadius, 2 * outerRadius),
        subtractFirst(2 * outerRadius),
        addOutline,
      ),
    }
  }
}
const dom = builderFor()('theme-toggle', ThemeToggle)
const ThemeToggle$1 = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      ThemeToggle,
      dom,
    },
    Symbol.toStringTag,
    {value: 'Module'},
  ),
)
export {
  Base$1 as base,
  Circle$1 as circle,
  dom$c as dom,
  FocusFrame$1 as focusFrame,
  Knob$1 as knob,
  Moon$1 as moon,
  MoonSun$1 as moonSun,
  Ring$1 as ring,
  RoundRect$1 as roundRect,
  RoundRectRing$1 as roundRectRing,
  SkyMoon$1 as skyMoon,
  SkySun$1 as skySun,
  ThemeToggle$1 as themeToggle,
  Tongue$1 as tongue,
  util,
  Vec as VE,
}
