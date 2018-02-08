import { handleActions } from 'redux-actions'
import moment from 'moment'
import R from 'ramda'
import throttle from 'lodash/throttle'
import { findSingle, REQUEST_STARTED, REQUEST_SUCCESS, REQUEST_FAIL } from './requests'
import { logout } from 'redux/modules/auth'
import { sessionModalVisibleSelector } from 'redux/selectors'

export const KEEP_ALIVE_REQUEST_INIT = 'init'
export const KEEP_ALIVE_REQUEST_PENDING = 'pending'
export const KEEP_ALIVE_REQUEST_SUCCESS = 'success'
export const KEEP_ALIVE_REQUEST_FAIL = 'fail'

export const keepAlive = () => findSingle({
  type: 'keepAlive',
  url: '/keep-alive',
  force: true,
  fail: logoutIfNeeded
})

export const sessionTimeLeft = R.compose(
  R.unless(
    R.isNil,
    (expiresAt) => -moment().diff(expiresAt, 'seconds')
  ),
  R.prop('expiresAt')
)

const isNotAuthenticated = R.compose(
  R.equals('NotAuthenticated'),
  R.path(['error', 'reason'])
)

const logoutIfNeeded = R.when(isNotAuthenticated, logout)

export const shouldNotify = (timeLeft, thresholdTime) =>
  timeLeft && timeLeft <= thresholdTime


export const monitorUserInteraction = () =>
  (dispatch) => {
    const handleEvent = () => dispatch(interactionEvent())

    window.addEventListener('mousedown', handleEvent)
    window.addEventListener('keydown', handleEvent)

    // note: returns a function to unsubscribe
    return () => {
      window.removeEventListener('mousedown', handleEvent)
      window.removeEventListener('keydown', handleEvent)
    }
  }

const dispatchKeepAlive = (dispatch) => dispatch(keepAlive())
const keepAliveThrottled = throttle(
  dispatchKeepAlive,
  INTERACTION_THROTTLE_TIME
)

export const interactionEvent = (callback = keepAliveThrottled) =>
  (dispatch, getState) => {
    !sessionModalVisibleSelector(getState()) && callback(dispatch)
  }

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_STARTED]: (state, { payload }) => (
    R.merge(state, {
      requestStatus: payload.type === 'keepAlive'
        ? KEEP_ALIVE_REQUEST_PENDING
        : state.requestStatus
    })
  ),

  [REQUEST_SUCCESS]: (state, { payload }) => ({
    expiresAt: payload.meta.session_expires_on,
    requestStatus: payload.type === 'keepAlive'
      ? KEEP_ALIVE_REQUEST_SUCCESS
      : state.requestStatus
  }),

  [REQUEST_FAIL]: (state, { payload }) => (
    R.merge(state, {
      requestStatus: payload.type === 'keepAlive'
        ? KEEP_ALIVE_REQUEST_FAIL
        : state.requestStatus
    })
  )
}, {
  expiresAt: null,
  requestStatus: KEEP_ALIVE_REQUEST_INIT
})
