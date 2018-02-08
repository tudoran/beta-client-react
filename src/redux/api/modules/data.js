import { handleActions } from 'redux-actions'
import R from 'ramda'
import { REQUEST_SUCCESS } from './requests'

// ------------------------------------
// Helpers
// ------------------------------------

const defaultFootprint = R.prop('id')

// makeArray :: Any -> Array
const makeArray = R.ifElse(R.is(Array), R.identity, R.of)

// combine :: Array -> Array -> Array
const combine = (footprint = defaultFootprint) =>
  R.compose(
    R.uniqBy(footprint),
    R.useWith(R.concat, [R.defaultTo([]), R.defaultTo([])])
  )

const getMergeParams = ({ mergeParams = {} }) =>
  R.is(Function, mergeParams)
    ? mergeParams()
    : mergeParams

// withData :: Object -> Array|Object -> String -> Object
const withData = (state, type, data, params) =>
  R.compose(
    R.merge(state),
    R.zipObj([type]),
    R.of,
    R.flip(combine(params.footprint))(state[type]),
    R.map((item) => R.merge(item, getMergeParams(params))),
    makeArray
  )(data)

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_SUCCESS]: (state, { payload }) => {
    const { type, value, method, ...params } = payload
    return R.isEmpty(type) || R.isEmpty(value) || R.isNil(value) ? state
      : method === 'DELETE'
        ? R.assoc(type, R.reject(R.propEq('id'), state[type]), state)
        : withData(state, type, value, params)
  }
}, {})
