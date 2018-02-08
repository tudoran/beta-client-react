import { applyMiddleware } from 'redux'
import createApiMiddleware from './middleware'

export default (...middlewares) => {
  return applyMiddleware(
    ...middlewares,
    createApiMiddleware()
  )
}
