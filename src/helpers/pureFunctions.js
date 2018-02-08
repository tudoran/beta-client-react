import R from 'ramda'

// ------------------------------------
// General
// ------------------------------------
export const log = x => {
  console.log(x) // eslint-disable-line no-console
  return x
}

// invokeLater :: Number -> Number -> Function -> Function
export const invokeLater = (arity, delay, callback) => {
  const invoker = function () {
    return window.setTimeout(() => {
      callback.apply(null, Array.prototype.slice.call(arguments))
    }, delay)
  }
  return arity > 0 ? R.curryN(arity, invoker) : invoker()
}

// mapIndexed :: Function -> List -> List
export const mapIndexed = R.addIndex(R.map)

// forEachIndexed :: Function -> List -> List
export const forEachIndexed = R.addIndex(R.forEach)

// propsChanged :: String[] -> Object -> Object -> Boolean
export const propsChanged = (propKeys, props, nextProps) =>
  R.useWith(R.compose(R.not, R.equals), [
    R.pick(propKeys),
    R.pick(propKeys)
  ])(props, nextProps)

export const underscorize = (str) =>
  str.replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
            .replace(/[-\s]+/g, '_')
            .toLowerCase()

// ------------------------------------
// Redux
// ------------------------------------

// dispatch :: Store -> Action -> ?
export const dispatch = R.useWith(R.call, [
  R.prop('dispatch'),
  R.identity
])

// isActionOfType :: ActionType -> Action -> Boolean
export const isActionOfType = R.useWith(R.equals, [
  R.identity,
  R.prop('type')
])

// state :: Selector -> Store -> *
export const state = R.useWith(R.call, [
  R.identity,
  R.invoker(0, 'getState')
])

// ------------------------------------
// redux-form
// ------------------------------------
export const isInvalid = R.compose(
  R.any(R.equals(true)),
  R.values,
  R.map(R.prop('invalid'))
)

// ------------------------------------
// d3.js
// ------------------------------------
const getValuesOfAxis = axis => R.compose(
  R.map(R.map(R.prop(axis))),
  R.map(R.prop('values'))
)

const getMinValue = R.compose(
  R.reduce(R.min, Infinity),
  R.map(R.reduce(R.min, Infinity))
)

const getMaxValue = R.compose(
  R.reduce(R.max, -Infinity),
  R.map(R.reduce(R.max, -Infinity))
)

// getMin :: String -> Datum -> Float
export const getMin = axis => R.compose(getMinValue, getValuesOfAxis(axis))

// getMax :: String -> Datum -> Float
export const getMax = axis => R.compose(getMaxValue, getValuesOfAxis(axis))

export const dataAfterDate = R.curry((epoch, datum) => R.map(
  R.converge(R.assoc('values'), [
    R.compose(R.filter(({ x }) => R.gte(x, epoch)), R.prop('values')),
    R.identity
  ]),
  datum
))
