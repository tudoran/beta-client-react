import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'

// ------------------------------------
// Constants
// ------------------------------------
const TOGGLE_PENDING_PANEL = 'TOGGLE_PENDING_PANEL'

// ------------------------------------
// Actions
// ------------------------------------
export const togglePendingPanel = createAction(TOGGLE_PENDING_PANEL)

export const actions = {
  togglePendingPanel
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [TOGGLE_PENDING_PANEL]: (state) =>
    R.assoc(
      'pendingPanelExpanded',
      !R.prop('pendingPanelExpanded', state),
      state
    )
}, {
  pendingPanelExpanded: false
})
