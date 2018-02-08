import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'
import { findAllSelector, findOneSelector, findQuerySelector, findSingleSelector,
  findSingleByURLSelector } from 'redux/api/selectors'
import { assignDefaults, compareRequests, requestFootprint } from 'redux/api/utils/request'

// ------------------------------------
// Constants
// ------------------------------------
export const MAYBE_REQUEST = 'MAYBE_REQUEST'
export const REQUEST_STARTED = 'REQUEST_STARTED'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_FAIL = 'REQUEST_FAIL'

// ------------------------------------
// Helpers
// ------------------------------------
const requestIndexSelector = R.compose(R.findIndex, compareRequests)

const saveRequest = (state, payload, params) =>
  R.compose(
    R.append(R.merge(requestFootprint(payload), params)),
    R.remove(requestIndexSelector(payload)(state), 1)
  )(state)

// ------------------------------------
// Actions
// ------------------------------------
export const request = createAction(MAYBE_REQUEST, assignDefaults)

export const lazyRequest = params => request(R.merge({ lazy: true }, params))

export const findAll = ({ type, url, ...options }) =>
  request({
    url: url || `/${type}`,
    method: 'GET',
    type,
    selector: findAllSelector({ type }),
    ...options
  })

export const findOne = ({ id, type, url, ...options }) =>
  request({
    url: url || `/${type}/${id}`,
    method: 'GET',
    type,
    selector: findOneSelector({ id, type }),
    ...options
  })

export const findSingle = ({ type, url, ...options }) =>
  request({
    url: url || `/${type}`,
    method: 'GET',
    type,
    selector: findSingleSelector({ type }),
    ...options
  })

export const findQuery = ({ type, url, query = {}, ...options }) => {
  const queryString = R.compose(
    R.join('&'),
    R.map(pair => `${pair[0]}=${pair[1]}`)
  )(R.toPairs(query))

  return request({
    url: R.join('?', [R.defaultTo(`/${type}`, url), queryString]),
    method: 'GET',
    type,
    selector: findQuerySelector({ type, query }),
    ...options
  })
}

export const findSingleByURL = ({ type, url, mergeParams = {}, ...options }) =>
  request({
    url,
    method: 'GET',
    type,
    footprint: R.prop('url'),
    mergeParams: R.merge({ url }, mergeParams),
    selector: findSingleByURLSelector({ type, url }),
    ...options
  })

export const create = ({ type, url, mergeParams = {}, ...options }) =>
  lazyRequest({
    url: url || `/${type}`,
    method: 'POST',
    type,
    footprint: R.prop('id'),
    mergeParams: R.merge({ url }, mergeParams),
    selector: findSingleByURLSelector({ type, url }),
    ...options
  })

export const update = ({ type, url, id, ...options }) =>
  lazyRequest({
    url: url || `/${type}/${id}`,
    method: 'PUT',
    type,
    selector: findOneSelector({ id, type }),
    ...options
  })

export const deleteRequest = ({ type, url, id, ...options }) =>
  lazyRequest({
    url: url || `/${type}/${id}`,
    method: 'DELETE',
    type,
    ...options
  })

export const actions = {
  findAll,
  findOne,
  findQuery,
  findSingle,
  findSingleByURL,
  create,
  deleteRequest,
  request,
  update
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_STARTED]: (state, { payload }) =>
    saveRequest(state, payload, { status: 'pending' }),

  [REQUEST_SUCCESS]: (state, { payload }) =>
    saveRequest(state, payload, { status: 'fulFilled' }),

  [REQUEST_FAIL]: (state, { payload }) =>
    saveRequest(state, payload, { status: 'rejected', error: payload.error })
}, [])
