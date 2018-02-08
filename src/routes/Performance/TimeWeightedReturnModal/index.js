import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connectModal } from 'redux-modal'

class TimeWeightedReturnModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  };

  render () {
    const { handleHide, show } = this.props
    return (
      <Modal show={show} onHide={handleHide}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title>Lorem ipsum dolor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

export default connectModal({ name: 'timeWeightedReturnModal' })(TimeWeightedReturnModal)
