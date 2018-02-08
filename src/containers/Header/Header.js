import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router'
import { show } from 'redux-modal'
import R from 'ramda'
import { connect } from 'redux/api'
import { findAllSelector, findQuerySelector } from 'redux/api/selectors'
import { getProfile, logout } from 'redux/modules/auth'
import { isAuthenticatedSelector } from 'redux/selectors'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './Header.scss'
import logo from './logo.png'
import UserActions from 'components/UserActions/UserActions'

class Header extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    client: PropTypes.object,
    clientId: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    location: PropTypes.object,
    logout: PropTypes.func,
    show: PropTypes.func,
    user: PropTypes.object
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['accounts', 'client', 'location', 'isAuthenticated',
      'user'], this.props, nextProps)
  }

  render () {
    const { accounts, client, clientId, isAuthenticated, logout, show,
      user } = this.props
    const isAdvisor = user && user.role === 'advisor'

    return (
      <header className={classes.header}>
        {isAdvisor &&
          <div className={classes.advisorAlert}>
            <span>
              Advisor mode
              ({client && `${client.user.first_name} ${client.user.last_name}`})
            </span>
          </div>}
        <div className='container'>
          <div className={classes.inner}>
            <div className={classes.logo}>
              <Link to={`/${clientId}`}>
                <img className={classes.logoImage} src={logo} />
              </Link>
            </div>
            <div className={classes.actions}>
              {isAuthenticated &&
                <UserActions accounts={accounts}
                  createAccount={function () { show('createAccount') }}
                  client={client} logout={logout} user={user} />}
            </div>
          </div>
        </div>
      </header>
    )
  }
}

const requests = ({ clientId }) => ({
  accounts: clientId && (({ findAll }) => findAll({
    type: 'accounts',
    url: clientId === 'me' ? '/accounts' : `/clients/${clientId}/accounts`,
    selector: clientId === 'me'
      ? findAllSelector({
        type: 'accounts'
      })
      : findQuerySelector({
        type: 'accounts',
        query: {
          primary_owner: parseInt(clientId, 10)
        }
      })
  })),
  client: clientId && !R.equals(clientId, 'me') && (({ findOne }) => findOne({
    type: 'clients',
    id: clientId
  })),
  user: getProfile
})

const selector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector
})

const actions = {
  logout,
  show
}

export default connect(requests, selector, actions)(Header)
