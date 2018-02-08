import React, { Component, PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import classNames from 'classnames'
import { propsChanged } from 'helpers/pureFunctions'
import ContactAdvisor from 'components/ContactAdvisor/ContactAdvisor'
import classes from './Nav.scss'

const link = (to, label, options = { component: Link }) =>
  <li className={classes.listItem}>
    <options.component to={to}
      activeClassName={classes['active']}
      className={classNames('nav-link', classes.link)}>
      {label}
      <span />
    </options.component>
  </li>

export default class Nav extends Component {
  static propTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string,
    goalId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    pathname: PropTypes.string,
    user: PropTypes.object
  }

  shouldComponentUpdate (nextProps) {
    return propsChanged(['accountId', 'clientId', 'goalId', 'pathname', 'user'],
      this.props, nextProps)
  }

  render () {
    const { accountId, clientId, goalId, user } = this.props
    const advisor = user && user.advisor

    return user ? (
      <div className={`navbar ${classes.navbar}`}>
        <div className='container'>
          <ul className={classNames('nav', 'navbar-nav', classes.navbarNav)}>
            {link(`/${clientId}/account/${accountId}`, 'Overview',
              { component: IndexLink })}
            {goalId &&
              link(`/${clientId}/account/${accountId}/goal/${goalId}/portfolio`,
                'Portfolio')}
            {goalId &&
              link(`/${clientId}/account/${accountId}/goal/${goalId}/allocation`,
                'Allocation')}
            {link(`/${clientId}/account/${accountId}/performance`,
              'Performance')}
            {goalId &&
              link(`/${clientId}/account/${accountId}/goal/${goalId}/transfer`,
                'Transfer')}
            {goalId &&
              link(`/${clientId}/account/${accountId}/goal/${goalId}/activity`,
                'Activity')}
          </ul>
          <div className='pull-right'>
            <ContactAdvisor advisor={advisor} />
          </div>
        </div>
      </div>
    ) : <div />
  }
}
