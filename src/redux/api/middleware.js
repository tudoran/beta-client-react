import { bind } from 'redux-effects'
import { createAction } from 'redux-actions'
import { fetch } from 'redux-effects-fetch'
import R from 'ramda'
import { assignDefaults } from 'redux/api/utils/request'
import { isActionOfType } from 'helpers/pureFunctions'
import { MAYBE_REQUEST, REQUEST_STARTED, REQUEST_SUCCESS, REQUEST_FAIL }
  from './modules/requests'
import { requestSelector } from './selectors'

// ------------------------------------
// Helpers
// ------------------------------------
const isMaybeRequestAction = isActionOfType(MAYBE_REQUEST)

// ------------------------------------
// Actions
// ------------------------------------
const requestStarted = createAction(REQUEST_STARTED)
const requestSuccess = createAction(REQUEST_SUCCESS)
const requestFail = createAction(REQUEST_FAIL)

// ------------------------------------
// Action creators
// ------------------------------------
const request = (params = {}, getState) => {
  const finalParams = assignDefaults(params)
  const { url, success, fail, deserialize = R.identity,
    ...fetchParams } = finalParams

  const fetchSuccess = ({ value }) =>
    R.map(R.flip(R.call)({
      ...finalParams,
      value: value && deserialize(value.data, getState),
      meta: value && value.meta
    }))(
      success ? R.flatten([requestSuccess, success]) : [requestSuccess]
    )

  const fetchFail = ({ value }) =>
    R.map(R.flip(R.call)({ ...finalParams, error: value && value.error }))(
      fail ? R.flatten([requestFail, fail]) : [requestFail]
    )

  return [
    requestStarted(finalParams),
    bind(fetch(API_URL + url, fetchParams), fetchSuccess, fetchFail)
  ]
}

// ------------------------------------
// Middleware
// ------------------------------------
export default function createMiddleware ({ cache } = { cache: true }) {
  return R.curry(({ dispatch, getState }, next, action) => {
    if (!isMaybeRequestAction(action)) {
      return next(action)
    }

    const { payload } = action
    const cachedRequest = requestSelector(payload)(getState())

    // An API request is initiated when one of the following is true:
    // - `payload.method` isnt GET
    // - `payload.force` is true
    // - `payload.cache` is false
    // - `payload.retry` is true AND state.api[payload.url].rejected is true
    // - `state.api[payload.url]` is empty
    if (payload.method !== 'GET' || payload.force || !cache || !cachedRequest ||
      (payload.retry && cachedRequest.status === 'rejected')) {
      dispatch(request(payload, getState))
    }

    return null
  })
}
