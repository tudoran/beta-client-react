import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'redux/api'
import { connectNeedsUser } from 'helpers/auth'
import { getProfile } from 'redux/modules/auth'
import { goTo, replace } from 'redux/modules/router'
import Spinner from 'components/Spinner/Spinner'

const getFirstClientId = R.compose(
  R.prop('primary_owner'),
  R.defaultTo({}),
  R.last
)

const maybeGotoClient = ({ accounts, params: { clientId }, replace, user }) => {
  const firstClientId = getFirstClientId(accounts)

  if (!clientId && user) {
    if (user.advisor) {
      replace('/me')
    } else if (firstClientId) {
      replace(`/${firstClientId}`)
    }
  }
}

class NoClient extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    params: PropTypes.object,
    replace: PropTypes.func,
    user: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount () {
    maybeGotoClient(this.props)
  }

  componentWillReceiveProps (nextProps) {
    maybeGotoClient(nextProps)
  }

  render () {
    return (
      <div className='page'>
        <Spinner />
      </div>
    )
  }
}

const requests = ({ params }) => ({
  accounts: ({ findAll }) => params && params.clientId !== 'me' && (findAll({
    type: 'accounts'
  })),
  user: getProfile
})

const actions = { goTo, replace }

export default R.compose(
  connect(requests, null, actions),
  connectNeedsUser('/a/login')
)(NoClient)
