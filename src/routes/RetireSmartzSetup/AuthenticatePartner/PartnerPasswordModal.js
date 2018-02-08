import React, { Component, PropTypes } from 'react'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { Modal, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import R from 'ramda'
import { connect } from 'redux/api'
import { goTo } from 'redux/modules/router'
import { partnerLogin } from 'redux/modules/auth'
import { retiresmartzSelector, isPartnerAuthenticatedSelector } from 'redux/selectors'
import { set } from 'redux/modules/retiresmartz'
import classes from './AuthenticatePartner.scss'
import FieldError from 'components/FieldError/FieldError'

const validate = values => {
  const errors = {}
  if (!values.password) {
    errors.password = ['Partner\'s password is required.']
  }
  return errors
}

class PartnerPasswordModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func,
    show: PropTypes.bool,
    goTo: PropTypes.func,
    set: PropTypes.func,
    fields: PropTypes.object,
    retiresmartz: PropTypes.object.isRequired,
    partnerLogin: PropTypes.func.isRequired,
    requests: PropTypes.object
  };
  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  componentWillReceiveProps (nextProps) {
    const { handleHide, goTo } = this.props
    const { accountId, clientId } = this.context
    if (nextProps.isPartnerAuthenticated) {
      handleHide()
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1-partners-retirement-plan`)
    }
  }

  handleKeyDown = (event) => {
    const { fields, partnerLogin } = this.props
    if (event.keyCode === 13) {
      if (fields.password.valid) {
        const body = {
          email: fields.email.value,
          password: fields.password.value
        }
        partnerLogin({
          body
        })
      }
    }
  }

  render () {
    const { handleHide, show, fields, requests: { partnerLogin } } = this.props
    return (
      <Modal show={show} onHide={handleHide} bsSize='large'>
        <Modal.Body>
          <div className='form-horizontal'>
            <FormGroup controlId='partnerPassword' className={classes.passwordGroup}>
              <Col componentClass={ControlLabel} sm={6}>
                Please enter the password for{' '}
                <a href='mailto:#{fields.email.value}'>{fields.email.value}</a>
              </Col>
              <Col sm={6}>
                <FormControl type='password'
                  {...fields.password}
                  onKeyDown={this.handleKeyDown}
                  autoFocus
                  />
                <FieldError for={fields.password} />
                {partnerLogin && partnerLogin.error &&
                  <div className='text-danger'>
                    {partnerLogin.error.message}
                  </div>
                }
              </Col>
            </FormGroup>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

const requests = {
  partnerLogin
}

const selector = createStructuredSelector({
  retiresmartz: retiresmartzSelector,
  isPartnerAuthenticated: isPartnerAuthenticatedSelector
})

const actions = {
  goTo,
  set
}

export default R.compose(
  reduxForm({
    form: 'partnerLogin',
    fields: ['email', 'password'],
    validate
  }),
  connectModal({ name: 'partnerPasswordModal' }),
  connect(requests, selector, actions)
)(PartnerPasswordModal)
