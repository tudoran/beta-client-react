import { combineReducers } from 'redux'
import api from './reducers'

export default (reducers = {}) => combineReducers({
  ...reducers,
  api
})
