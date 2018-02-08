import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { KEEP_ALIVE_REQUEST_PENDING, KEEP_ALIVE_REQUEST_FAIL,
  keepAlive } from 'redux/api/modules/session'
import { logout } from 'redux/modules/auth'
import { Modal } from 'react-bootstrap'
import R from 'ramda'
import { sessionSelector } from 'redux/api/selectors'
import Button from 'components/Button'
import SessionTimeLeft from 'components/SessionTimeLeft'

export class SessionExpirationNotice extends Component {
  static propTypes = {
    session: PropTypes.object,
    keepAlive: PropTypes.func,
    logout: PropTypes.func,
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  };

  get isRequestPending() {
    const { session } = this.props
    return R.equals(KEEP_ALIVE_REQUEST_PENDING, session.requestStatus)
  }

  get isRequestFailed() {
    const { session } = this.props
    return R.equals(KEEP_ALIVE_REQUEST_FAIL, session.requestStatus)
  }

  render () {
    const { show, handleHide, session, logout, keepAlive } = this.props

    return (
      <Modal show={show} onHide={handleHide} backdrop='static'
        aria-labelledby='ModalHeader'>
        <Modal.Body>
          {this.isRequestPending &&
            <div className='text-center pending'>
              Confirming session status...
            </div>
          }
          {this.isRequestFailed &&
            <div className='text-center failed'>
              Failed to refresh the session. You will be automatically logged out in{' '}
              <SessionTimeLeft session={session} /> seconds.
            </div>
          }
          {!this.isRequestFailed && !this.isRequestPending &&
            <div className='text-center'>
              You will be automatically logged out in{' '}
              <SessionTimeLeft session={session} /> seconds.
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={keepAlive} disabled={this.isRequestPending}>
            Stay logged in
          </Button>
          <Button bsStyle='danger' onClick={logout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const selector = createStructuredSelector({
  session: sessionSelector
})

const actions = {
  keepAlive,
  logout
}

export default R.compose(
  connectModal({ name: 'sessionExpirationNotice' }),
  connect(selector, actions)
)(SessionExpirationNotice)
