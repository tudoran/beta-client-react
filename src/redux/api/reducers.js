import { combineReducers } from 'redux'
import data from './modules/data'
import requests from './modules/requests'
import session from './modules/session'

export default combineReducers({
  data,
  requests,
  session
})
