import React, { Component, PropTypes } from 'react'
import { Col, Row, Checkbox, Button, FormGroup,
  ControlLabel } from 'react-bootstrap'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import { show } from 'redux-modal'
import { getProfile, getPartnerProfile } from 'redux/modules/auth'
import R from 'ramda'
import { MdHighlightRemove, MdAddCircle, MdEdit } from 'helpers/icons'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import PersonalInfoBox from '../PersonalInfoBox/PersonalInfoBox'
import AssetEntryModal from '../AssetEntryModal/AssetEntryModal'
import { FormattedNumber } from 'react-intl'
import classes from './FinancialPicture.scss'

export class FinancialPicture extends Component {
  static propTypes = {
    goTo: PropTypes.func,
    show: PropTypes.func,
    user: PropTypes.object,
    params: PropTypes.object,
    retiresmartz: PropTypes.object,
    goals: PropTypes.array,
    accounts: PropTypes.array
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  // States are used for only demo purpose.
  constructor (props) {
    super(props)
    this.state = {
      spouseRetired: false
    }
  }

  handleBack = () => {
    const { goTo, params: { stepId } } = this.props
    const { accountId, clientId } = this.context
    if (stepId === '2') {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1`)
    } else {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/2`)
    }
  }

  handleContinue = () => {
    const { goTo, retiresmartz: { planTogether }, params: { stepId } } = this.props
    const { accountId, clientId } = this.context
    if (planTogether && stepId === '2') {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/2-partner`)
    } else {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/3`)
    }
  }

  accountName (accountId) {
    const { accounts } = this.props
    return accounts && `(${R.find(R.propEq('id', accountId))(accounts).account_name}) `
  }

  renderGoalsTable () {
    const { goals } = this.props

    return (
      <table className={classes.accountList}>
        <thead>
          <tr>
            <th className={classes.accountSummary}>Accounts</th>
            <th className={classes.annualContribution}>Annual Contribution</th>
            <th className={classes.currentBalance}>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {R.map(goal =>
            <tr key={goal.id}>
              <td>
                <form className={classes.accountCheckbox}>
                  <Checkbox>
                    {this.accountName(goal.account)}
                    {goal.name}
                  </Checkbox>
                </form>
              </td>
              <td className='text-right'>{'$29,083'}</td>
              <td className='text-right'>
                <FormattedNumber value={goal.balance} format='currency' />
              </td>
            </tr>
          , goals)}
        </tbody>
      </table>
    )
  }

  render () {
    const { show, user, params: { stepId } } = this.props
    const whose = stepId === '2' ? 'your' : `${user.first_name}'s`
    return (
      <div className={classes.content}>
        <Row className={classes.contentRow}>
          <Col xs={4} md={3} className={classes.personalInfoContainer}>
            <PersonalInfoBox user={user} />
          </Col>
          <Col xs={8} md={9} className={classes.question}>
            <h2 className={classes.financialPictureTitle}>What is {` ${whose} `} financial picture?</h2>
            <p className={classes.financialPictureDesc}>
              Enter the details of all {' '}
              {` ${whose} `}
              income, assets, debt and external retirement income to get the most accurate advice.
            </p>
            <div className='form-inline'>
              <FormGroup controlId='formInlineName'>
                <ControlLabel className={classes.CGAILabel}>
                  CURRENT GROSS ANNUAL INCOME:
                </ControlLabel>
                <CurrencyInput className={classes.CGAIValue} />
              </FormGroup>
            </div>

            <div className={classes.accounts}>
              <div className={classes.bettermentAccounts}>
                <div className={classes.listHeader}>
                  WHICH OF {` ${whose} `} BETASMARTZ GOALS ARE FOR RETIREMENT SPENDING?
                </div>
                {this.renderGoalsTable()}
              </div>

              <div className={classes.externalAssets}>
                <div className={classes.listHeader}>
                  LIST {` ${whose} `} EXTERNAL ASSETS
                </div>
                <table className={classes.accountList}>
                  <thead>
                    <tr>
                      <th className={classes.accountType}>Account Type</th>
                      <th className={classes.accountOwner}>Account Owner</th>
                      <th className={classes.institution}>Institution</th>
                      <th className={classes.currentValue}>Current Value</th>
                      <th className={classes.assetActions}>{' '}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{'003465782'}</td>
                      <td>{'Transaction / Cheque Account'}</td>
                      <td>{'National Australia Bank'}</td>
                      <td className='text-right'>{'$4,150'}</td>
                      <td>
                        <Button className={classes.btnAssetAction}
                          onClick={function () {
                            show('assetEntryModal')
                          }}>
                          <MdEdit size='18' />
                        </Button>
                        <Button className={classes.btnAssetAction}>
                          <MdHighlightRemove size='18' />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={classes.addExternalAccount}>
                  <Button className={classes.btnAdd}
                    onClick={function () {
                      show('assetEntryModal')
                    }}>
                    <MdAddCircle size='28' />
                    <span>Add Asset</span>
                  </Button>
                </div>
              </div>

              <div className={classes.externalIncome}>
                <div className={classes.listHeader}>
                  LIST ANY EXTERNAL RETIREMENT INCOME
                </div>
                <table className={classes.accountList}>
                  <thead>
                    <tr>
                      <th className={classes.eiName}>NAME</th>
                      <th className={classes.eiStartDate}>START DATE</th>
                      <th className={classes.eiAnnualAmount}>ANNUAL AMOUNT</th>
                      <th className={classes.eiActions}>{' '}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{'National Australia Bank'}</td>
                      <td>{'2016-06-20'}</td>
                      <td className='text-right'>{'$4,150'}</td>
                      <td>
                        <Button className={classes.btnAssetAction}
                          onClick={function () {
                            show('assetEntryModal')
                          }}>
                          <MdEdit size='18' />
                        </Button>
                        <Button className={classes.btnAssetAction}>
                          <MdHighlightRemove size='18' />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={classes.addExternalAccount}>
                  <Button className={classes.btnAdd}
                    onClick={function () {
                      show('assetEntryModal')
                    }}>
                    <MdAddCircle size='28' />
                    <span>Add Income</span>
                  </Button>
                </div>
              </div>

              <AssetEntryModal />
            </div>
          </Col>
        </Row>
        <div className={classes.bottomActions}>
          <Button bsStyle='default'
            onClick={this.handleBack}>
            Back
          </Button>
          {' '}
          <Button bsStyle='primary'
            onClick={this.handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    )
  }
}

const requests = ({ params: { accountId, stepId } }) => ({
  goals: ({ findAll }) => findAll({
    type: stepId === '2' ? 'goals' : 'partnerGoals',
    url: stepId === '2' ? `/accounts/${accountId}/goals` : '/goals?partner'
  }),
  accounts: ({ findAll }) => findAll({
    type: stepId === '2' ? 'accounts' : 'partnerAccounts',
    url: stepId === '2' ? '/accounts' : '/accounts?partner'
  }),
  user: stepId === '2' ? getProfile : getPartnerProfile
})

const actions = {
  goTo,
  show
}

export default R.compose(
  connect(requests, null, actions)
)(FinancialPicture)
