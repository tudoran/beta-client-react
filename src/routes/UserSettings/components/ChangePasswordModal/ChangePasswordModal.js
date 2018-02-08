import React, { Component, PropTypes } from 'react'
import { Button, Col, Modal, Form, FormGroup, FormControl,
  ControlLabel } from 'react-bootstrap'
import R from 'ramda'
import ChangePasswordError from '../ChangePasswordError'
import classes from './ChangePasswordModal.scss'
import FieldError from 'components/FieldError'

// getFailed :: Props -> Boolean
const getFailed = R.compose(
  R.equals('rejected'),
  R.path(['requests', 'changePassword', 'status'])
)

export default class ChangePasswordModal extends Component {
  static propTypes = {
    changePassword: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    handleHide: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    requests: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    securityQuestion: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
  };

  handleChange = (fields) => {
    const { changePassword, handleHide, resetForm } = this.props
    this.setState({
      failed: false
    })
    changePassword({
      body: fields,
      success: [
        handleHide,
        resetForm
      ],
      fail: resetForm
    })
  }

  render () {
    const { handleHide, show, fields, handleSubmit } = this.props
    const failed = getFailed(this.props)
    return (
      <Modal show={show} onHide={handleHide} aria-labelledby='ChangePasswordModal'
        dialogClassName={classes.changePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Password</Modal.Title>
        </Modal.Header>
        <Form horizontal onSubmit={handleSubmit(this.handleChange)}>
          <Modal.Body>
            <FormGroup>
              <Col xs={4} componentClass={ControlLabel}>Current Password</Col>
              <Col xs={8}>
                <FormControl type='password' {...fields.old_password} />
                <FieldError for={fields.old_password} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={4} componentClass={ControlLabel}>New Password</Col>
              <Col xs={8}>
                <FormControl type='password' {...fields.new_password} />
                <FieldError for={fields.new_password} />
              </Col>
            </FormGroup>
            <hr className={classes.modalHr} />
            <h3 className={classes.sqTitle}>
              Please answer the following security question
            </h3>
            <FormGroup>
              <Col xs={4} componentClass={ControlLabel}>Question</Col>
              <Col xs={8}>
                <FormControl.Static style={{ marginLeft: 0 }}>
                   {fields.question && fields.question.value}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={4} componentClass={ControlLabel}>Answer</Col>
              <Col xs={8}>
                <FormControl type='text' {...fields.answer} />
                <FieldError for={fields.answer} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={12}>
                <ChangePasswordError show={failed} />
              </Col>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' bsStyle='primary'>
              Change Password
            </Button>
            <Button onClick={handleHide}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}
