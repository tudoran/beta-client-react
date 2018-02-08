import React, { Component, PropTypes } from 'react'
import { connect } from 'redux/api'
import { connectModal, show } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { Modal, FormControl, ControlLabel, Button } from 'react-bootstrap'
import DateTimeField from 'react-bootstrap-datetimepicker'
import R from 'ramda'
import { goTo } from 'redux/modules/router'
import { retiresmartzSelector, isAuthenticatedSelector } from 'redux/selectors'
import ASSET_TYPE from 'constants/retiresmartzConstants'
import classes from './AssetEntryModal.scss'
import NarrowCol from 'components/NarrowComponents/NarrowCol'
import NarrowFormGroup from 'components/NarrowComponents/NarrowFormGroup'
import NarrowRow from 'components/NarrowComponents/NarrowRow'
import RecurringTransactionModal
  from '../../RetireSmartzSetup/RecurringTransactionModal/RecurringTransactionModal'
import Select from 'components/Select/Select'

class AssetEntryModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    showModal: PropTypes.func,
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
    const { handleHide, show, showModal } = this.props
    const debtOptions = [{label: '123456', value: '123456'}]
    const assetTypeOptions = R.map(item => ({ label: item, value: item }), ASSET_TYPE)
    return (
      <Modal show={show} onHide={handleHide} dialogClassName={classes.assetEntryModal}>
        <Modal.Header closeButton>
          <Modal.Title>External Asset Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='form-horizontal'>
            <p className={classes.description}>
              Enter the following details of your external asset.
            </p>
            <div className='form-horizontal'>
              <NarrowFormGroup controlId='assetType'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Asset Type:
                </NarrowCol>
                <NarrowCol sm={9}>
                  <Select name='assetType' options={assetTypeOptions}
                    searchable={false} clearable={false}
                  />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='accountNum'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Account Num:
                </NarrowCol>
                <NarrowCol sm={9}>
                  <FormControl type='text' />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='institution'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Institution:
                </NarrowCol>
                <NarrowCol sm={9}>
                  <FormControl type='text' />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='assetName'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Asset Name:
                </NarrowCol>
                <NarrowCol sm={9}>
                  <FormControl type='text' />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='description'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Description:
                </NarrowCol>
                <NarrowCol sm={9}>
                  <FormControl componentClass='textarea' rows={3} />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='valuation'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Valuation:
                </NarrowCol>
                <NarrowCol sm={9}>
                  <NarrowRow>
                    <NarrowCol sm={2} className={classes.NarrowColNarrowPadding}>
                      <FormControl type='text' />
                    </NarrowCol>
                    <NarrowCol componentClass={ControlLabel} sm={2}
                      className={classes.label}>
                      <div className='text-right'>Valued on:</div>
                    </NarrowCol>
                    <NarrowCol sm={4} className={classes.NarrowColNarrowPadding}>
                      <DateTimeField mode='date' inputFormat='MM/DD/YYYY' />
                    </NarrowCol>
                    <NarrowCol componentClass={ControlLabel} sm={2}
                      className={classes.label}>
                      <div className='text-right'>Growth:</div>
                    </NarrowCol>
                    <NarrowCol sm={2} className={classes.NarrowColNarrowPadding}>
                      <FormControl type='number' placeholder='%' />
                    </NarrowCol>
                  </NarrowRow>
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='acquiredOn'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Acquired on:
                </NarrowCol>
                <NarrowCol sm={4}>
                  <DateTimeField mode='date' inputFormat='MM/DD/YYYY' />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='associatedDebt'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Associated debt:
                </NarrowCol>
                <NarrowCol sm={5}>
                  <Select name='associatedDebt' options={debtOptions}
                    searchable={false} clearable={false}
                  />
                </NarrowCol>
              </NarrowFormGroup>

              <NarrowFormGroup controlId='recurringTransactions'>
                <NarrowCol componentClass={ControlLabel} sm={3} className={classes.label}>
                  Recurring Transactions:
                </NarrowCol>
                <NarrowCol sm={7}>
                  <FormControl componentClass='select' multiple>
                    <option value='select'>select (multiple)</option>
                    <option value='other'>...</option>
                  </FormControl>
                </NarrowCol>
                <NarrowCol sm={2}>
                  <Button bsStyle='primary' block onClick={function () {
                    showModal('recurringTransactionModal')
                  }}>
                    Add
                  </Button>
                </NarrowCol>
              </NarrowFormGroup>
              <RecurringTransactionModal />
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
  goTo,
  showModal: show
}

export default R.compose(
  connectModal({ name: 'assetEntryModal' }),
  connect(null, selector, actions)
)(AssetEntryModal)
