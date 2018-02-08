import { routerActions, routerReducer } from 'react-router-redux'
import R from 'ramda'

// ------------------------------------
// Helpers
// ------------------------------------
const formatUrl = R.replace(/\/\//g, '/')

// ------------------------------------
// Actions
// ------------------------------------
export const goTo = (path) => routerActions.push(formatUrl(path))
export const replace = path => routerActions.replace(formatUrl(path))

// ------------------------------------
// Reducer
// ------------------------------------
export default routerReducer
