import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'redux/api'
import { replace } from 'redux/modules/router'
import Spinner from 'components/Spinner/Spinner'

const maybeGotoFirstAccount = ({ accounts, replace, params: { clientId } }) => {
  const firstAccount = R.head(accounts)
  firstAccount && replace(`/${clientId}/account/${firstAccount.id}`)
}

class NoAccount extends Component {
  static propTypes = {
    children: PropTypes.element,
    isAuthenticated: PropTypes.bool,
    logout: PropTypes.func,
    replace: PropTypes.func,
    user: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount () {
    maybeGotoFirstAccount(this.props)
  }

  componentWillReceiveProps (nextProps) {
    maybeGotoFirstAccount(nextProps)
  }

  render () {
    return (
      <div className='page'>
        <Spinner />
      </div>
    )
  }
}

const requests = ({ params: { clientId } }) => ({
  accounts: ({ findAll }) => findAll({
    type: 'accounts',
    url: clientId === 'me' ? '/accounts' : `/clients/${clientId}/accounts`
  })
})

const actions = { replace }

export default connect(requests, null, actions)(NoAccount)
