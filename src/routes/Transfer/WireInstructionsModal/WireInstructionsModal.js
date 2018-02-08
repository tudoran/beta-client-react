import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import classes from './WireInstructionsModal.scss'

class WireInstructionsModal extends Component {
  static propTypes = {
    goalName: PropTypes.string,
    handleHide: PropTypes.func,
    show: PropTypes.bool
  };

  render () {
    const { goalName, handleHide, show } = this.props
    return (
      <Modal show={show}
        onHide={handleHide}
        dialogClassName={classes.wireInstructionsModal}
        aria-labelledby='WireInstructionsModal'>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Wire transfer instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            We have included the wire instructions below for your {goalName}{' '}
            goal. In order to process the deposit you will need to provide these
            instructions to your bank.
          </p>
          <div className={classes.instructions}>
            <h2 className={classes.instructionTitle}>Wire Instructions</h2>
            <dl>
              <dt>Wire funds to:</dt>
              <dd>The Bancorp Bank</dd>
              <dt>Routing number:</dt>
              <dd>031101114</dd>
              <dt>For credit to:</dt>
              <dd>BetaSmartz Investments</dd>
              <dt>Account number:</dt>
              <dd>6</dd>
              <dt>Amount:</dt>
              <dd>Provide the amount to your bank.</dd>
              <dt>Memo/additional info:</dt>
              <dd>Barack Obama, Education Fund</dd>
              <dt>Receiving bank address:</dt>
              <dd>409 Silverside Road, Suite 105<br />Wilmington, DE 19809</dd>
            </dl>
          </div>
          <p className={classes.footerNote}>
            Please note, we do not charge you a fee for incoming wires,
            but your bank may charge you a fee for sending a wire transfer.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary'>Email Me Instructions</Button>
          <Button bsStyle='default' onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connectModal({
  name: 'wireInstructionsModal'
})(WireInstructionsModal)
