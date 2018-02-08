import { createStore, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import cookie from 'redux-effects-cookie'
import effects from 'redux-effects'
import fetch from 'redux-effects-fetch'
import localstorage from 'redux-effects-localstorage'
import multi from 'redux-multi'
import thunk from 'redux-thunk'
import { applyMiddleware } from './api'
import makeRootReducer from './reducers'

// const authenticatedReqMatcher = RegExp('^(?!.*?partner).*' + API_URL + '.*$')
// const authenticatedPartnerReqMatcher = RegExp(API_URL + '.*?partner.*$')

export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    effects,
    cookie(),
    fetch,
    localstorage(window.localStorage),
    multi,
    routerMiddleware(history),
    thunk
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEBUG__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers')
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
