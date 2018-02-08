import React, { Component, PropTypes } from 'react'
import { Modal, Button, Form, FormControl, ControlLabel, Checkbox,
  Glyphicon } from 'react-bootstrap'
import { connectModal, show } from 'redux-modal'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import R from 'ramda'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import classes from './EditRetirementPlanModal.scss'
import avatar1 from '../../RetireSmartzSetup/Avatars/avatar1.svg'
import NarrowRow from 'components/NarrowComponents/NarrowRow'
import NarrowCol from 'components/NarrowComponents/NarrowCol'
import NarrowFormGroup from 'components/NarrowComponents/NarrowFormGroup'
import ContributionPlanModal from '../ContributionPlanModal/ContributionPlanModal'

class EditRetirementPlanModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    showModal: PropTypes.func,
    goTo: PropTypes.func.isRequired
  };
  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleChange = () => {

  }

  render () {
    const labelClass = classes.label
    const { handleHide, show, showModal } = this.props
    return (
      <Modal show={show} onHide={handleHide}
        dialogClassName={classes.editRetirementPlanModal}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title>Edit Retirement Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={classes.description}>
            Personalise your plan by giving it a name and optinally a description.
          </p>
          <Form horizontal>
            <NarrowFormGroup controlId='ERPM_PlanName'>
              <NarrowCol componentClass={ControlLabel} sm={3} className={labelClass}>
                Plan name
              </NarrowCol>
              <NarrowCol sm={9}>
                <FormControl type='text' />
              </NarrowCol>
            </NarrowFormGroup>

            <NarrowFormGroup controlId='ERPM_Description'>
              <NarrowCol componentClass={ControlLabel} sm={3} className={labelClass}>
                Description
              </NarrowCol>
              <NarrowCol sm={9}>
                <FormControl componentClass='textarea' rows={3} />
              </NarrowCol>
            </NarrowFormGroup>

            <div className={classes.mbSpacer10} />

            <NarrowRow>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_Type'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Type:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='text' />
                  </NarrowCol>
                </NarrowFormGroup>
                <ContributionPlanModal />
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_Partner'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Partner:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl.Static className={classes.smallLabel}>
                      <img src={avatar1} alt={'Mary'} className={classes.avatarImg} />
                      <a href='#TODO:Link_to_partner_plan'>{'Mary'}</a>
                    </FormControl.Static>
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_RetirementIncome'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Retirement Income:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <CurrencyInput
                      value={0}
                      placeholder='$'
                      onChange={this.handleChange}
                    />
                    <a href='javascript:;' className={classes.configIcon}
                      onClick={function () { }}>
                      <Glyphicon glyph='cog' className={classes.customIcon} />
                    </a>
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_RetirementAge'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Retirement Age:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' />
                    <a href='javascript:;' className={classes.configIcon}
                      onClick={function () { showModal('contributionPlanModal') }}>
                      <Glyphicon glyph='cog' className={classes.customIcon} />
                    </a>
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_AnnualContribution'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Annual Contribution:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <CurrencyInput
                      value={0}
                      placeholder='$'
                      onChange={this.handleChange}
                    />
                    <a href='javascript:;' className={classes.configIcon}
                      onClick={function () { showModal('contributionPlanModal') }}>
                      <Glyphicon glyph='cog' className={classes.customIcon} />
                    </a>
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_InitialInvestment'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Initial Investment:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <CurrencyInput
                      value={0}
                      placeholder='$'
                      onChange={this.handleChange}
                    />
                    <a href='javascript:;' className={classes.configIcon}
                      onClick={function () { }}>
                      <Glyphicon glyph='cog' className={classes.customIcon} />
                    </a>
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
            </NarrowRow>
            <div className={classes.mbSpacer15} />
            <NarrowRow>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_CalculatePension'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Calculate Pension:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <Checkbox />
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_LifeExpectancy'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Life Expectancy:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' className={classes.halfWidthControl} /> years
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_InflationRate'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Inflation Rate:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' className={classes.halfWidthControl} /> %
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_CalculationCertainty'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Calculation Certainty:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' className={classes.halfWidthControl} /> %
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_AverageAnnualFee'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Average Annual Fee:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' className={classes.halfWidthControl} /> %
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_ContributionTaxRate'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Contribution Tax Rate:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' className={classes.halfWidthControl} /> %
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_DividendTaxRate'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Dividend Tax Rate:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' className={classes.halfWidthControl} /> %
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
              <NarrowCol sm={6}>
                <NarrowFormGroup controlId='ERPM_CapitalGainTaxRate'>
                  <NarrowCol componentClass={ControlLabel} xs={6} className={labelClass}>
                    Capital Gain Tax Rate:
                  </NarrowCol>
                  <NarrowCol xs={6}>
                    <FormControl type='number' className={classes.halfWidthControl} /> %
                  </NarrowCol>
                </NarrowFormGroup>
              </NarrowCol>
            </NarrowRow>
          </Form>
        </Modal.Body>
        <Modal.Footer className={classes.textRight}>
          <Button bsStyle='primary'>
            Run Wizard
          </Button>
          <Button bsStyle='primary'>
            Retirement Projection
          </Button>
          <Button bsStyle='primary'>
            Assets and Income
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const actions = {
  goTo,
  showModal: show
}

export default R.compose(
  connectModal({ name: 'editRetirementPlanModal' }),
  connect(null, null, actions)
)(EditRetirementPlanModal)
