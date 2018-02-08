import React, { Component, PropTypes } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import R from 'ramda'

class SMSFConfirmModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    goTo: PropTypes.func.isRequired
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleQuit = () => {
    const { handleHide, goTo } = this.props
    const { accountId, clientId } = this.context
    handleHide()
    goTo(`/${clientId}/account/${accountId}`)
  }

  render () {
    const { handleHide, show, goTo } = this.props
    const { accountId, clientId } = this.context

    return (
      <Modal show={show} onHide={handleHide}>
        <Modal.Body>
          <p className='text-center'>
            Is an SMSF right for you? The Australian Superannuation Association recommends
            an SMSF may not be appropriate for fund sizes of less than 200K.
            You should discuss this decision with your financial advisor.<br />
            Do you want to continue?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary'
            onClick={function () {
              goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/4`)
            }}>
            Continue
          </Button>
          <Button onClick={this.handleQuit}>
            Quit
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const actions = {
  goTo
}

export default R.compose(
  connectModal({ name: 'SMSFConfirmModal' }),
  connect(null, null, actions)
)(SMSFConfirmModal)
