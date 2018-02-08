import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'
import { REQUEST_SUCCESS } from '../api/modules/requests'

// ------------------------------------
// Constants
// ------------------------------------
const MOVE_GOAL = 'MOVE_GOAL'
const SET_GO = 'SET_GO'
const TOGGLE_GO = 'TOGGLE_GO'

// ------------------------------------
// Actions
// ------------------------------------
export const moveGoal = createAction(MOVE_GOAL)
export const set = createAction(SET_GO)
export const toggle = createAction(TOGGLE_GO)

export const actions = {
  moveGoal,
  set,
  toggle
}

// ------------------------------------
// Helpers
// ------------------------------------
const buildOrder = ({ order }, value) =>
  R.compose(
    R.uniqBy(R.identity),
    R.flip(R.concat)(order),
    R.map(R.prop('id')),
    R.sort(({ order: aOrder }, { order: bOrder }) => aOrder - bOrder),
    R.unless(R.isArrayLike, R.of)
  )(value)

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [MOVE_GOAL]: (state, { payload: { id, atIndex } }) => {
    const newOrder = R.compose(
      R.insert(atIndex, id),
      R.without([id])
    )(state.order)
    return R.assoc('order', newOrder, state)
  },

  [SET_GO]: (state, { payload: { id, ...obj } }) =>
    R.assoc(id, R.merge(state[id], obj), state),

  [TOGGLE_GO]: (state, { payload: { id, prop } }) =>
    R.assocPath(
      [id, prop],
      !R.path([id, prop], state),
      state
    ),

  [REQUEST_SUCCESS]: (state, { payload: { method, type, value } }) =>
    R.equals(type, 'goals') && R.contains(method, ['GET', 'POST'])
      ? R.assoc('order', buildOrder(state, value), state)
      : state
}, { order: [] })
