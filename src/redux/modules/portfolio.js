import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
const ADD_QUESTIONS = 'ADD_QUESTIONS'

// ------------------------------------
// Actions
// ------------------------------------
export const addQuestions = createAction(ADD_QUESTIONS)

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [ADD_QUESTIONS]: (state, { payload }) =>
    R.assoc('questions', payload, state)
}, {})

