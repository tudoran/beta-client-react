import React, { Component, PropTypes } from 'react'
import { Modal, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import { createStructuredSelector } from 'reselect'
import { retiresmartzSelector, isAuthenticatedSelector } from 'redux/selectors'
import { set, setPartnerVar } from 'redux/modules/retiresmartz'
import Select from 'components/Select/Select'
import DateTimeField from 'react-bootstrap-datetimepicker'
import classes from './CreateClientModal.scss'
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css'
import R from 'ramda'

class CreateClientModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    goTo: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    setPartnerVar: PropTypes.func.isRequired,
    retiresmartz: PropTypes.object.isRequired
  };
  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleKeyDown = (event) => {
    const { accountId, clientId } = this.context
    const { goTo } = this.props
    if (event.keyCode === 13) {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1-partners-retirement-plan`)
    }
  }

  render () {
    const { handleHide, show, setPartnerVar,
      retiresmartz: { partner: {
        email, firstName, lastName, dateOfBirth, gender
      } } } = this.props
    const { accountId, clientId } = this.context
    const genderOptions = [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ]
    return (
      <Modal show={show} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Create Betasmartz Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={classes.formDescription}>
            Enter the following details to create a minimal Betasmartz account for
            {' '}
            <a href={email} className={classes.italic}>{email}</a>
          </p>
          <div className='form-horizontal'>
            <FormGroup key='partnerFirstNameGroup'>
              <Col componentClass={ControlLabel} sm={3}>
                First name
              </Col>
              <Col sm={9}>
                <FormControl type='text' autoFocus value={firstName}
                  onChange={function (e) { setPartnerVar({firstName: e.target.value}) }} />
              </Col>
            </FormGroup>
            <FormGroup key='partnerLastNameGroup'>
              <Col componentClass={ControlLabel} sm={3}>
                Last name
              </Col>
              <Col sm={9}>
                <FormControl type='text' value={lastName}
                  onChange={function (e) { setPartnerVar({lastName: e.target.value}) }} />
              </Col>
            </FormGroup>
            <FormGroup key='partnerDateOfBirthGroup'>
              <Col componentClass={ControlLabel} sm={3}>
                Date of Birth
              </Col>
              <Col sm={9}>
                <DateTimeField dateTime={dateOfBirth} mode='date'
                  inputFormat='MM/DD/YYYY' viewMode='years'
                  onChange={function (x) { setPartnerVar({dateOfBirth: x}) }} />
              </Col>
            </FormGroup>
            <FormGroup key='partnerGenderGroup'>
              <Col componentClass={ControlLabel} sm={3}>
                Gender
              </Col>
              <Col sm={9}>
                <Select name='gender' options={genderOptions}
                  searchable={false} clearable={false}
                  value={gender}
                  onChange={function (val) { setPartnerVar({gender: val.value}) }} />
              </Col>
            </FormGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary'
            onClick={function () {
              goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1-partners-retirement-plan`)
            }}>
            Create Account
          </Button>
          <Button onClick={handleHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const selector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector,
  retiresmartz: retiresmartzSelector
})

const actions = {
  goTo,
  set,
  setPartnerVar
}

export default R.compose(
  connectModal({ name: 'createClientModal' }),
  connect(null, selector, actions)
)(CreateClientModal)
