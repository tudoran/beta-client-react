import React, { Component, PropTypes } from 'react'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { Modal, FormControl, ControlLabel, Button, InputGroup, Row, Col }
  from 'react-bootstrap'
import R from 'ramda'
import { connect } from 'redux/api'
import { goTo } from 'redux/modules/router'
import { retiresmartzSelector, isAuthenticatedSelector } from 'redux/selectors'
import classes from './ContributionPlanModal.scss'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import DateTimeField from 'react-bootstrap-datetimepicker'
import NarrowCol from 'components/NarrowComponents/NarrowCol'
import NarrowFormGroup from 'components/NarrowComponents/NarrowFormGroup'

class ContributionPlanModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    goTo: PropTypes.func.isRequired
  };
  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleChange = () => {

  }

  render () {
    const { handleHide, show } = this.props
    return (
      <Modal show={show} onHide={handleHide} className='test'
        dialogClassName={classes.contributionPlanModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contribution Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body className={classes.modalBody}>
          <Row>
            <Col sm={6} className={classes.modalCol}>
              <p className={classes.description}>
                Before-tax contribution details
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
            </Col>
            <Col sm={6} className={classes.modalCol}>
              <p className={classes.description}>
                After-tax contribution details
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
            </Col>
          </Row>
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
  connectModal({ name: 'contributionPlanModal' }),
  connect(null, selector, actions)
)(ContributionPlanModal)
