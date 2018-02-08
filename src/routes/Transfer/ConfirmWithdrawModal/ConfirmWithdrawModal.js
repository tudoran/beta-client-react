import React, { Component, PropTypes } from 'react'
import { connectModal } from 'redux-modal'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Modal }
  from 'react-bootstrap'
import R from 'ramda'
import { connect } from 'redux/api'
import { findOne } from 'redux/api/modules/requests'
import classes from './ConfirmWithdrawModal.scss'

class ConfirmWithdrawModal extends Component {
  static propTypes = {
    amount: PropTypes.number,
    goal: PropTypes.object,
    handleHide: PropTypes.func,
    requests: PropTypes.object,
    resetForm: PropTypes.func,
    save: PropTypes.func,
    show: PropTypes.bool
  };

  save = () => {
    const { amount, save } = this.props
    const body = { amount }
    save({ body })
  }

  render () {
    const { amount, goal, handleHide, requests: { save }, show } = this.props

    return (
      <Modal animation={false} show={show} onHide={handleHide}
        aria-labelledby='ModalHeader'
        dialogClassName={classes.modal}>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Please Confirm Withdraw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col componentClass={ControlLabel} xs={5}>Withdraw Amount:</Col>
              <Col xs={7}>
                <FormControl.Static>
                  ${amount}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} xs={5}>From:</Col>
              <Col xs={7}>
                <FormControl.Static>
                  {goal.name}
                </FormControl.Static>
              </Col>
            </FormGroup>
          </Form>
          {save && save.status === 'rejected' &&
            <div className='text-danger'>
              {save.error && save.error.message ||
                'An error has occured. Please try again later'}
            </div>}
        </Modal.Body>
        <Modal.Footer className={classes.footer}>
          <Button bsStyle='primary' onClick={this.save}>
            Withdraw
          </Button>
          <Button onClick={handleHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const requests = ({ goal: { id }, handleHide, resetForm }) => ({
  save: ({ create }) => create({
    type: 'withdrawals',
    url: `/goals/${id}/withdraw`,
    success: [
      handleHide,
      resetForm,
      () => findOne({
        type: 'goals',
        id,
        force: true
      })
    ]
  })
})

export default R.compose(
  connectModal({ name: 'confirmWithdraw' }),
  connect(requests)
)(ConfirmWithdrawModal)
