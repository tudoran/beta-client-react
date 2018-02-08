import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
const SET_ACTIVITY_VAR = 'SET_ACTIVITY_VAR'
const TOGGLE_ACTIVITY_VAR = 'TOGGLE_ACTIVITY_VAR'

// ------------------------------------
// Actions
// ------------------------------------
export const set = createAction(SET_ACTIVITY_VAR)
export const toggle = createAction(TOGGLE_ACTIVITY_VAR)

export const actions = {
  set,
  toggle
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_ACTIVITY_VAR]: (state, { payload }) =>
    R.merge(state, payload)
}, {
  allGoals: true
})
