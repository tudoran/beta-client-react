import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connectModal, show } from 'redux-modal'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import R from 'ramda'
import classes from './PartnersPlan.scss'

class PlansCreatedModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    goTo: PropTypes.func.isRequired,
    partner: PropTypes.object.isRequired
  };
  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleContinue = () => {
    const { goTo, handleHide } = this.props
    const { accountId, clientId } = this.context
    handleHide()
    goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/2`)
  }

  handleQuit = () => {
    const { handleHide, goTo } = this.props
    const { accountId, clientId } = this.context
    handleHide()
    goTo(`/${clientId}/account/${accountId}`)
  }

  render () {
    const { handleHide, show, partner } = this.props
    return (
      <Modal show={show} onHide={handleHide}
        dialogClassName={classes.editRetirementPlanModal}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title>Your Plans have been created!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={classes.primaryColor}>
            <p>
              Great!
            </p>
            <p>
              We now have your and {partner.first_name}'s retirement plans ready to be filled with current financial
              details and retirement preferences. We will gather your details first, then {partner.first_name}'s.
            </p>
            <p>
              When you're finished, you can experiment with different retirement scenarios to explore
              your possibilities during retirement.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className={classes.textRight}>
          <Button bsStyle='primary' onClick={this.handleContinue}>
            Continue
          </Button>
          <Button onClick={this.handleQuit}>
            Save and Quit
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
  connectModal({ name: 'plansCreatedModal' }),
  connect(null, null, actions)
)(PlansCreatedModal)
