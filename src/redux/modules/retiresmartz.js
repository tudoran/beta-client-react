import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
const SET_RETIRESMARTZ_VAR = 'SET_RETIRESMARTZ_VAR'
const SET_RETIRESMARTZ_PARTNER = 'SET_RETIRESMARTZ_PARTNER'

// ------------------------------------
// Actions
// ------------------------------------
export const set = createAction(SET_RETIRESMARTZ_VAR)
export const setPartnerVar = createAction(SET_RETIRESMARTZ_PARTNER)

export const actions = { set }

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [SET_RETIRESMARTZ_VAR]: (state, { payload }) =>
    R.merge(state, payload),
  [SET_RETIRESMARTZ_PARTNER]: (state, { payload }) =>
    R.assoc('partner', R.merge(state.partner, payload), state)
}, {
  partner: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: new Date().now,
    gender: ''
  }
})
