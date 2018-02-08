import React, { Component, PropTypes } from 'react'
import { Col, Row, Button, FormGroup, ControlLabel, FormControl }
  from 'react-bootstrap'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import { show } from 'redux-modal'
import R from 'ramda'
import { set, setPartnerVar } from 'redux/modules/retiresmartz'
import { getPartnerProfile } from 'redux/modules/auth'
import { createStructuredSelector } from 'reselect'
import Select from 'components/Select/Select'
import { isPartnerAuthenticatedSelector } from 'redux/selectors'
import AddRetirementPlanModal from '../AddRetirementPlanModal/AddRetirementPlanModal'
import PlansCreatedModal from './PlansCreatedModal'
import classes from './PartnersPlan.scss'

const getRetirementPlanOptions = R.map(({ id, name }) => ({
  label: name,
  value: id
}))

export class PartnersPlan extends Component {
  static propTypes = {
    goals: PropTypes.array,
    goTo: PropTypes.func,
    show: PropTypes.func,
    set: PropTypes.func,
    setPartnerVar: PropTypes.func,
    params: PropTypes.object,
    retiresmartz: PropTypes.object,
    partner: PropTypes.object,
    partnerRetirementPlans: PropTypes.array
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  componentWillReceiveProps (nextProps) {
    const { goTo } = this.props
    const { accountId, clientId } = this.context
    if (!nextProps.isPartnerAuthenticated) {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1-authenticate-partner`)
    }
  }

  get currentGoalId () {
    const { params: { goalId }, goals } = this.props
    const firstGoal = R.head(goals)
    return goalId || (firstGoal && firstGoal.id)
  }

  handlePlanChange = (val) => {
    const { show, set } = this.props
    if (val.value === 'new') {
      show('addRetirementPlanModal')
    } else {
      set({ partnersPlan: val.value })
    }
  }

  renderPlansOption (option) {
    if (option.value === 'new') {
      return (
        <div className='text-center'>
          <i className={classes.primaryColor}>-- {option.label} --</i>
        </div>
      )
    } else {
      return option.label
    }
  }

  handlePostAddPlan = (id) => {
    const { goTo, set } = this.props
    const { clientId, accountId } = this.context
    set({ partnersPlan: id })
    goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/2`)
  }

  render () {
    const { goTo, show, partner, partnerRetirementPlans, retiresmartz: {
      partnersPlan } } = this.props
    const { accountId, clientId } = this.context

    const existingPlans = partnerRetirementPlans ? getRetirementPlanOptions(partnerRetirementPlans) : []
    const planOptions = R.append(
      { label: 'Create New', value: 'new' },
      existingPlans
    )

    return (
      <div className={classes.content}>
        <Row className={classes.contentRow}>
          <Col xs={10} xsOffset={1} className={classes.ppContent}>
            <h3>Select your partner's corresponding retirement plan</h3>
            <p className={classes.apDescription}>
              To link your plan to your partner, you first need to access your partner's
              betasmartz account. If your partner is already has a Betasmartz account,
              enter their login email address and authenticate, otherwise you will need to
              create a new account for them.
            </p>
            <div className={`form-horizontal ${classes.emailForm}`}>
              <FormGroup controlId='PartnersEmail'>
                <Col componentClass={ControlLabel} sm={6} className={classes.textColor}>
                  Enter your partner's login email:
                </Col>
                <Col sm={6}>
                  <FormControl.Static className='form-control'>
                    {partner && partner.email}
                  </FormControl.Static>
                </Col>
              </FormGroup>
              <FormGroup controlId='PartnersPlan'>
                <Col componentClass={ControlLabel} sm={6} className={classes.textColor}>
                  Select {partner && partner['first_name']}'s corresponding Retiresmartz plan:
                </Col>
                <Col sm={6}>
                  <Select name='partnersPlan' options={planOptions}
                    searchable={false} clearable={false}
                    value={partnersPlan}
                    valueRenderer={this.renderPlansOption}
                    optionRenderer={this.renderPlansOption}
                    onChange={this.handlePlanChange} />
                </Col>
              </FormGroup>
            </div>
            <Row>
              <Col sm={12} className='text-right'>
                <Button bsStyle='default'
                  onClick={function () {
                    goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1`)
                  }}>
                  Back
                </Button>
                {' '}
                <Button bsStyle='primary'
                  disabled={!partner || !partnersPlan}
                  onClick={function () {
                    show('plansCreatedModal')
                  }}>
                  Save and Continue
                </Button>
              </Col>
            </Row>
            {partner &&
              <div>
                <AddRetirementPlanModal clientId={partner.id} onAddPlan={this.handlePostAddPlan} forPartner />
                <PlansCreatedModal partner={partner} />
              </div>
            }
          </Col>
        </Row>
      </div>
    )
  }
}

const requests = ({ partner }) => ({
  partner: getPartnerProfile
})

const requests2 = ({ partner }) => ({
  partnerRetirementPlans: partner && (({ findAll }) => findAll({
    type: 'partnerRetirementPlans',
    url: `/clients/${partner.id}/retirement-plans?partner`
  }))
})

const selector = createStructuredSelector({
  isPartnerAuthenticated: isPartnerAuthenticatedSelector
})

const actions = {
  goTo,
  show,
  set,
  setPartnerVar
}

export default R.compose(
  connect(requests, selector, actions),
  connect(requests2)
)(PartnersPlan)
