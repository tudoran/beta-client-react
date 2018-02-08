import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { hide, show } from 'redux-modal'
import R from 'ramda'
import { monitorUserInteraction, sessionTimeLeft,
  shouldNotify } from 'redux/api/modules/session'
import { logout } from 'redux/modules/auth'
import { sessionModalVisibleSelector } from 'redux/selectors'
import { sessionSelector } from 'redux/api/selectors'
import SessionExpirationNotice from 'containers/SessionExpirationNotice'

const UPDATE_TIME_LEFT_EVERY = 500

export class SessionMonitor extends Component {
  static propTypes = {
    hide: PropTypes.func,
    logout: PropTypes.func,
    monitorUserInteraction: PropTypes.func,
    session: PropTypes.object,
    sessionModalVisible: PropTypes.bool,
    show: PropTypes.func
  };
  constructor (props) {
    super(props)
    this.checkSessionTimeLeft()
  }

  componentDidMount () {
    const { monitorUserInteraction } = this.props
    this.stopMonitorUserInteraction = monitorUserInteraction()
  }

  componentDidUpdate () {
    const { hide, sessionModalVisible, session } = this.props
    const timeLeft = sessionTimeLeft(session)
    if (!shouldNotify(timeLeft, SESSION_THRESHOLD_TIME) && sessionModalVisible) {
      hide('sessionExpirationNotice')
    }
  }

  componentWillUnmount () {
    this.stopMonitorUserInteraction()
  }

  shouldCheckNextTime(timeLeft) {
    return timeLeft >= 0
  }

  shouldLogout(timeLeft) {
    return !R.isNil(timeLeft) && timeLeft <= 0
  }

  checkSessionTimeLeft = () => {
    const { show, sessionModalVisible, session, logout } = this.props
    const timeLeft = sessionTimeLeft(session)
    if (shouldNotify(timeLeft, SESSION_THRESHOLD_TIME)) {
      // TODO: Need to check the performance of using show alone vs.
      // check redux state and call show.
      !sessionModalVisible && show('sessionExpirationNotice')
    }
    if (this.shouldCheckNextTime(timeLeft)) {
      setTimeout(this.checkSessionTimeLeft, UPDATE_TIME_LEFT_EVERY)
    }
    if (this.shouldLogout(timeLeft)) {
      hide('sessionExpirationNotice')
      logout()
    }
  }

  render () {
    return (
      <SessionExpirationNotice />
    )
  }
}

const selector = createStructuredSelector({
  session: sessionSelector,
  sessionModalVisible: sessionModalVisibleSelector
})

const actions = {
  hide,
  logout,
  monitorUserInteraction,
  show
}

export default connect(selector, actions)(SessionMonitor)
