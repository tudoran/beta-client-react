import { createStructuredSelector } from 'reselect'
import R from 'ramda'
import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import { goTo } from 'redux/modules/router'
import { isAuthenticatedSelector } from 'redux/selectors'

const redirect = (value, props, path) => {
  const { goTo, isAuthenticated, user } = props

  if (R.equals(isAuthenticated, value)) {
    if (R.equals(value, false)) {
      const path = (user && user.role === 'client') ? '/logout' : '/'
      window.location.replace(path)
    } else {
      goTo(path)
    }
  }
}

const getPath = (buildPath, props) =>
  R.is(Function, buildPath) ? buildPath(props) : buildPath

const redirectWhenAuthenticatedIs = (value, wrapWithConnect = false) =>
  buildPath => Component => {
    class Wrapper extends Component {
      componentWillMount () {
        const { props } = this
        super.componentWillMount && super.componentWillMount()
        redirect(value, props, getPath(buildPath, props))
      }

      componentWillReceiveProps (nextProps) {
        super.componentWillReceiveProps &&
          super.componentWillReceiveProps(nextProps)
        redirect(value, nextProps, getPath(buildPath, nextProps))
      }
    }

    if (wrapWithConnect) {
      const requests = R.equals(value, false) ? {
        user: getProfile
      } : null
      const selector = createStructuredSelector({
        isAuthenticated: isAuthenticatedSelector
      })
      const actions = {
        goTo
      }
      return connect(requests, selector, actions)(Wrapper)
    } else {
      return Wrapper
    }
  }

export const needsUser = redirectWhenAuthenticatedIs(false)
export const needsVisitor = redirectWhenAuthenticatedIs(true)
export const connectNeedsUser = redirectWhenAuthenticatedIs(false, true)
export const connectNeedsVisitor = redirectWhenAuthenticatedIs(true, true)
