import React, { Component, PropTypes } from 'react'
import { Modal, FormControl, ControlLabel, Button, InputGroup } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import { createStructuredSelector } from 'reselect'
import { retiresmartzSelector, isAuthenticatedSelector } from 'redux/selectors'
import DateTimeField from 'react-bootstrap-datetimepicker'
import classes from './RecurringTransactionModal.scss'
import R from 'ramda'
import NarrowCol from 'components/NarrowComponents/NarrowCol'
import NarrowFormGroup from 'components/NarrowComponents/NarrowFormGroup'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'

class RecurringTransactionModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    goTo: PropTypes.func.isRequired,
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
    const { handleHide, show } = this.props
    return (
      <Modal show={show} onHide={handleHide} className='test'
        dialogClassName={classes.recurringTransactionModal}>
        <Modal.Header closeButton>
          <Modal.Title>Recurring Transaction Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className={classes.description}>
              Enter the following details of your recurring transaction.
            </p>
            <div className='form-horizontal'>

              <NarrowFormGroup controlId='RTMAmmount'>
                <NarrowCol componentClass={ControlLabel} xs={4} className={classes.label}>
                  Amount:
                </NarrowCol>
                <NarrowCol xs={8}>
                  <CurrencyInput className='text-right' />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='institution'>
                <NarrowCol componentClass={ControlLabel} xs={4} className={classes.label}>
                  Begin Date:
                </NarrowCol>
                <NarrowCol xs={8}>
                  <DateTimeField mode='date' inputFormat='MM/DD/YYYY' />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='assetName'>
                <NarrowCol componentClass={ControlLabel} xs={4} className={classes.label}>
                  Growth:
                </NarrowCol>
                <NarrowCol xs={8}>
                  <InputGroup>
                    <FormControl type='number' className='text-right' />
                    <InputGroup.Addon>%</InputGroup.Addon>
                  </InputGroup>
                </NarrowCol>
              </NarrowFormGroup>

            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary'>
            Save
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
  goTo
}

export default R.compose(
  connectModal({ name: 'recurringTransactionModal' }),
  connect(null, selector, actions)
)(RecurringTransactionModal)
