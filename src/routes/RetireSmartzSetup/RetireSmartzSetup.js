import React, { Component, PropTypes } from 'react'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import R from 'ramda'
import ProgressNav from './ProgressNav/ProgressNav'
import { createStructuredSelector } from 'reselect'
import { retiresmartzSelector } from 'redux/selectors'

import PersonalDetails from './PersonalDetails/PersonalDetails'
import AuthenticatePartner from './AuthenticatePartner/AuthenticatePartner'
import PartnersPlan from './PartnersPlan/PartnersPlan'
import FinancialPicture from './FinancialPicture/FinancialPicture'
import InitialDeposits from './InitialDeposits/InitialDeposits'
import RetirementIncome from './RetirementIncome/RetirementIncome'

export class RetireSmartzSetup extends Component {
  static propTypes = {
    goals: PropTypes.array,
    goTo: PropTypes.func,
    params: PropTypes.object,
    retiresmartz: PropTypes.object
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  getStepComponent () {
    const { params: { stepId } } = this.props
    switch (stepId) {
      case '1':
        return PersonalDetails
      case '1-authenticate-partner':
        return AuthenticatePartner
      case '1-partners-retirement-plan':
        return PartnersPlan
      case '2':
        return FinancialPicture
      case '2-partner':
        return FinancialPicture
      case '3':
        return InitialDeposits
      case '4':
        return RetirementIncome
      default:
        return PersonalDetails
    }
  }

  render () {
    const { params: { stepId }, retiresmartz } = this.props
    const StepComponent = this.getStepComponent()
    return (
      <div className='panel-body'>
        <ProgressNav step={stepId} />
        <StepComponent params={this.props.params} retiresmartz={retiresmartz} />
      </div>
    )
  }
}

const selector = createStructuredSelector({
  retiresmartz: retiresmartzSelector
})

const actions = {
  goTo
}

export default R.compose(
  connect(null, selector, actions)
)(RetireSmartzSetup)
