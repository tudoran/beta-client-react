import R from 'ramda'
import { compareRequests } from './utils/request'

// ------------------------------------
// Requests
// ------------------------------------
const requests = R.compose(
  R.defaultTo([]),
  R.path(['api', 'requests'])
)

export const requestSelector = params => R.compose(
  R.find(compareRequests(params)),
  requests
)

// ------------------------------------
// Data
// ------------------------------------
export const dataSelector = R.path(['api', 'data'])

export const findAllSelector = ({ type }) =>
  R.compose(
    R.defaultTo([]),
    R.prop(type),
    dataSelector
  )

export const findOneSelector = ({ id, type }) =>
  R.compose(
    R.find(R.propEq('id', parseInt(id, 10))),
    findAllSelector({ type })
  )

export const findSingleSelector = ({ type }) =>
  R.compose(
    R.head,
    findAllSelector({ type })
  )

export const findManySelector = ({ ids, type, key = 'id' }) =>
  R.compose(
    R.filter(R.compose(R.flip(R.contains)(ids), R.prop(key))),
    findAllSelector({ type })
  )

export const findQuerySelector = ({ type, query }) =>
  R.compose(
    R.filter(item => R.all(queryPair =>
      R.equals(item[queryPair[0]], queryPair[1])
    , R.toPairs(query))),
    findAllSelector({ type })
  )

export const findByURLSelector = ({ type, url }) =>
  R.compose(
    R.filter(R.propEq('url', url)),
    findAllSelector({ type })
  )

export const findSingleByURLSelector = ({ type, url }) =>
  R.compose(
    R.head,
    findByURLSelector({ type, url })
  )

// ------------------------------------
// Session
// ------------------------------------
export const sessionSelector = R.path(['api', 'session'])
