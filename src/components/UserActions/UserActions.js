import React, { Component, PropTypes } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import classNames from 'classnames'
import R from 'ramda'
import { MdAdd, MdPerson, MdPowerSettingsNew, MdSettings, MdMenu } from 'helpers/icons'
import classes from './UserActions.scss'
import Link from 'components/Link/Link'

export default class UserActions extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    client: PropTypes.object,
    createAccount: PropTypes.func,
    logout: PropTypes.func,
    user: PropTypes.object
  };

  static defaultProps = {
    accounts: []
  };

  static contextTypes = {
    clientId: PropTypes.string
  };

  get name () {
    const { user } = this.props
    return user && `${user.first_name} ${user.last_name}`
  }

  get firstName () {
    const { client, user } = this.props
    return R.equals(user && user.role, 'advisor')
      ? client && client.user && client.user.first_name
      : user && user.first_name
  }

  render () {
    const { accounts, createAccount, logout } = this.props
    const { clientId } = this.context

    return (
      <div className='btn-group header-nav'>
        <span className={classes.welcomeText}>
          <span className='hidden-xs'>Welcome, </span>{this.firstName}
        </span>
        <Button bsStyle='default' className={classes.navButton} data-toggle='dropdown'>
          <MdMenu size={28} />
        </Button>
        <div className={classNames('dropdown-menu', 'dropdown-menu-right',
          classes.dropdown)}>
          {R.map(account =>
            <div key={account.id}
              className={classNames('dropdown-item', classes.dropdownItem)}>
              <Row className={classes.fullRow}>
                <Col xs={10}>
                  <Link
                    className={classNames(classes.link, 'activeTarget')}
                    to={`/${clientId}/account/${account.id}`}>
                    {account.account_name}
                  </Link>
                </Col>
                <Col xs={2}>
                  <Link className={classes.link}
                    to={`/${clientId}/account/${account.id}/settings`}>
                    <MdSettings size={18} />
                  </Link>
                </Col>
              </Row>
            </div>
          , accounts)}
          <div className={classNames('dropdown-item', classes.dropdownItem)}>
            <div className={classes.link} onClick={createAccount}>
              <Row className={classes.fullRow}>
                <Col xs={10}>
                  Open an Account
                </Col>
                <Col xs={2}>
                  <MdAdd size={18} />
                </Col>
              </Row>
            </div>
          </div>
          <div className={classNames('dropdown-item', classes.dropdownItem)}>
            <Row className={classes.splitRow}>
              <Col xs={6}>
                <Link to={`/${clientId}/settings`}
                  className={classNames(classes.link, classes.halfLink)}>
                  <MdPerson size='28' />
                  <div>Settings</div>
                </Link>
              </Col>
              <Col xs={6} className={classes.halfCol}>
                <Button bsStyle='link' onClick={logout}
                  className={classNames(classes.link, classes.halfLink)}>
                  <MdPowerSettingsNew size='28' />
                  <div>Logout</div>
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
