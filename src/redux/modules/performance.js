import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
const DISABLE_GOAL = 'DISABLE_GOAL'
const DISABLE_RETURN = 'DISABLE_RETURN'
const ENABLE_GOAL = 'ENABLE_GOAL'
const ENABLE_RETURN = 'ENABLE_RETURN'
const SET_PERFORMANCE_VAR = 'SET_PERFORMANCE_VAR'

const colors = ['#33180d', '#7f7540', '#00e6a1', '#99b9cc', '#6900f2', '#ff003c',
  '#ff7940', '#ccc500', '#269986', '#0081cc', '#4f1a66', '#806063', '#994926',
  '#2f330d', '#004035', '#2d3d59', '#b059b3', '#f27985', '#bfa48f', '#99f200',
  '#bffffd', '#acb2e6', '#d200d9', '#4c1319', '#f2be79', '#b6d9a3', '#40fff9',
  '#808cff', '#330020', '#7f000d', '#bf6c00', '#4a8c23', '#394b4d', '#4d5499',
  '#cc0081', '#593300', '#5d7356', '#40d2ff', '#00084d', '#f2b6d4', '#ffb300',
  '#004002', '#1d5f73', '#0600a6', '#802050']

const withPlot = (payload, collection) => R.append({
  ...payload,
  color: R.compose(
    R.head,
    R.without(R.map(R.prop('color'), collection))
  )(colors)
}, collection)

const withoutPlot = (payload, collection) => R.reject(
  R.compose(
    R.equals(payload),
    R.omit('color')
  ),
  collection
)

// ------------------------------------
// Actions
// ------------------------------------
export const disableGoal = createAction(DISABLE_GOAL)
export const disableReturn = createAction(DISABLE_RETURN)
export const enableGoal = createAction(ENABLE_GOAL)
export const enableReturn = createAction(ENABLE_RETURN)
export const set = createAction(SET_PERFORMANCE_VAR)

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [DISABLE_GOAL]: (state, { payload }) =>
    R.assoc(
      'enabledGoals',
      withoutPlot(payload, state.enabledGoals),
      state
    ),

  [DISABLE_RETURN]: (state, { payload }) =>
    R.assoc(
      'enabledReturns',
      withoutPlot(payload, state.enabledReturns),
      state
    ),

  [ENABLE_GOAL]: (state, { payload }) =>
    R.assoc(
      'enabledGoals',
      withPlot(payload, state.enabledGoals),
      state
    ),

  [ENABLE_RETURN]: (state, { payload }) =>
    R.assoc(
      'enabledReturns',
      withPlot(payload, state.enabledReturns),
      state
    ),

  [SET_PERFORMANCE_VAR]: (state, { payload }) =>
    R.merge(state, payload)
}, { enabledReturns: [], enabledGoals: [],
      activeRangeKey: 'all', activeTypeKey: 'returns' })
