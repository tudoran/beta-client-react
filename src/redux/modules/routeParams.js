import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
const SET_ROUTE_PARAMS = 'SET_ROUTE_PARAMS'

// ------------------------------------
// Actions
// ------------------------------------
export const set = createAction(SET_ROUTE_PARAMS)

export const actions = {
  set
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_ROUTE_PARAMS]: (state, { payload }) =>
    R.merge(state, payload)
}, {})
