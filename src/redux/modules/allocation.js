import { createAction, handleActions } from 'redux-actions'
import { setItem } from 'redux-effects-localstorage'
import R from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
const DELETE_ALLOCATION_VAR = 'DELETE_ALLOCATION_VAR'
const SET_ALLOCATION_VAR = 'SET_ALLOCATION_VAR'
const TOGGLE_ALLOCATION_VAR = 'TOGGLE_ALLOCATION_VAR'

// ------------------------------------
// Helpers
// ------------------------------------
const getData = () =>
  R.compose(
    JSON.parse,
    R.defaultTo('{}'),
  )(window.localStorage.getItem(LOCALSTORAGE_ROOT))

// updateAttr :: String -> Any -> String
const updateAttr = (path, value) => R.assocPath(path, value, getData())

// deleteAttr:: String -> String
const deleteAttr = path => R.dissocPath(path, getData())

// ------------------------------------
// Actions
// ------------------------------------
export const deleteVar = createAction(DELETE_ALLOCATION_VAR)
export const deleteExperimentalSettings = ({ id }) => ([
  deleteVar({ id }),
  setItem(LOCALSTORAGE_ROOT, deleteAttr(['experimental_settings', id + '']))
])
export const set = createAction(SET_ALLOCATION_VAR)
export const setExperimentalSettings = ({ id, experimentalSettings }) => ([
  set({ id, experimentalSettings }),
  setItem(LOCALSTORAGE_ROOT,
    updateAttr(['experimental_settings', id], experimentalSettings))
])
export const toggle = createAction(TOGGLE_ALLOCATION_VAR)

export const actions = {
  set,
  toggle
}

// ------------------------------------
// Reducer
// ------------------------------------

const data = R.prop('experimental_settings', getData())
const initialValue = data
  ? R.map(R.compose(R.zipObj(['experimentalSettings']), R.of), data)
  : {}

export default handleActions({
  [DELETE_ALLOCATION_VAR]: (state, { payload: { id } }) =>
    R.assoc(id, R.dissoc('experimentalSettings', state[id]), state),

  [SET_ALLOCATION_VAR]: (state, { payload: { id, ...obj } }) =>
    R.assoc(id, R.merge(state[id], obj), state),

  [TOGGLE_ALLOCATION_VAR]: (state, { payload: { id, prop } }) =>
    R.assocPath(
      [id, prop],
      !R.path([id, prop], state),
      state
    )
}, initialValue)
