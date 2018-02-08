import React, { Component, PropTypes } from 'react'
import { connectModal } from 'redux-modal'
import { Modal, Button } from 'react-bootstrap'
import R from 'ramda'
import { connect } from 'redux/api'

class ConfirmDeleteGoalModal extends Component {
  static propTypes = {
    archiveGoal: PropTypes.func,
    goal: PropTypes.object,
    handleHide: PropTypes.func.isRequired,
    requests: PropTypes.object,
    show: PropTypes.bool
  };

  render () {
    const { archiveGoal, handleHide, goal, show, requests } = this.props
    const archiveGoalRequest = requests.archiveGoal

    return (
      <Modal animation={false} show={show} onHide={handleHide}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Delete Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your {goal.name} goal?
        </Modal.Body>
        <Modal.Footer>
          {archiveGoalRequest && archiveGoalRequest.status === 'rejected' &&
            <span className='text-danger'>
              {archiveGoalRequest.error && archiveGoalRequest.error.message ||
                'An error has occured. Please try again later'}
            </span>}
          <Button bsStyle='danger' onClick={function () { archiveGoal() }}>
            Delete goal
          </Button>
          <Button onClick={handleHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const requests = ({ handleHide, goal: { id } }) => ({
  archiveGoal: ({ update }) => update({
    type: 'goals',
    id,
    url: `/goals/${id}/archive`,
    success: handleHide
  })
})

export default R.compose(
  connectModal({ name: 'confirmDeleteGoal' }),
  connect(requests)
)(ConfirmDeleteGoalModal)
