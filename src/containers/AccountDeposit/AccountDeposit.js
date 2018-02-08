import React, { Component, PropTypes } from 'react'
import { connectModal } from 'redux-modal'
import { Modal, Button } from 'react-bootstrap'
import R from 'ramda'

class AccountDeposit extends Component {
  static propTypes = {
    account: PropTypes.object,
    handleHide: PropTypes.func,
    show: PropTypes.bool
  };

  render () {
    const { account, handleHide, show } = this.props

    return (
      <Modal animation={false} show={show} onHide={handleHide}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Account Deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            TODO: Add information for making a deposit to{' '}
            {account.account_name} account.
          </p>
          <p>
            Lorem ipsum dolor sit amet, mel vidit natum persius no. At eam
            elitr efficiantur, ea porro maiestatis pro, id vis saperet vocibus
            deleniti. Ei munere nonumes quo. Te sea appareat probatus evertitur.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={handleHide}>OK</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default R.compose(
  connectModal({ name: 'accountDeposit' })
)(AccountDeposit)
