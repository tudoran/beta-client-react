import { reducer as modal } from 'redux-modal'
import { reducer as form } from 'redux-form'
import { combineReducers } from 'redux/api'
import activity from './modules/activity'
import allocation from './modules/allocation'
import isAuthenticated, { isPartnerAuthenticated } from './modules/auth'
import performance from './modules/performance'
import portfolio from './modules/portfolio'
import goals from './modules/goals'
import router from './modules/router'
import retiresmartz from './modules/retiresmartz'
import routeParams from './modules/routeParams'
import transfer from './modules/transfer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    activity,
    allocation,
    isAuthenticated,
    isPartnerAuthenticated,
    form,
    goals,
    modal,
    performance,
    portfolio,
    router,
    routeParams,
    retiresmartz,
    transfer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
