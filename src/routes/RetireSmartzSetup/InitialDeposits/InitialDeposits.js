import React, { Component, PropTypes } from 'react'
import { Col, Row, Button, FormControl } from 'react-bootstrap'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import { getProfile, getPartnerProfile } from 'redux/modules/auth'
import { show } from 'redux-modal'
import R from 'ramda'
import { MdHighlightRemove, MdAddCircle } from 'helpers/icons'
import PersonalInfoBox from '../PersonalInfoBox/PersonalInfoBox'
import Select from 'components/Select/Select'
import SMSFConfirmModal from './SMSFConfirmModal'
import classes from './InitialDeposits.scss'

export class InitialDeposits extends Component {
  static propTypes = {
    goTo: PropTypes.func,
    user: PropTypes.object,
    partner: PropTypes.object,
    retiresmartz: PropTypes.object,
    show: PropTypes.func
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleContinue = () => {
    const { show } = this.props
    show('SMSFConfirmModal')
  }

  renderDropdownOption (option) {
    return (
      <span className={classes.primaryColor}>
        {option.label}
        <span className='pull-right'>
          {option.price}
        </span>
      </span>
    )
  }

  renderInitialDeposits (user) {
    const debtOptions = [{
      label: '12366789 - Savings Account - Commonwealth Bank',
      value: '12366789',
      price: '$866 Available'
    }]

    return (
      <table className={classes.dipositsTable}>
        <thead>
          <tr>
            <th className={classes.asset}>ASSET</th>
            <th className={classes.availableAmount}>AVAILABLE AMOUNT</th>
            <th className={classes.depositAmount}>DEPOSIT AMOUNT</th>
            <th className={classes.action}>{' '}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>003465782 - Transaction Account - National Australia Bank</td>
            <td className='text-right'>{'$4,150'}</td>
            <td className='text-right'>{'$4,150'}</td>
            <td>
              <Button className={classes.btnAction}>
                <MdHighlightRemove size='18' />
              </Button>
            </td>
          </tr>
          <tr className={classes.newDepositRow}>
            <td colSpan={2} className='new-deposit-select'>
              <Select name='newDeposit' options={debtOptions}
                valueRenderer={this.renderDropdownOption}
                optionRenderer={this.renderDropdownOption}
                searchable={false} clearable={false}
              />
            </td>
            <td>
              <FormControl type='text' className={classes.newDepositAmountInput} />
            </td>
            <td>
              <Button className={classes.btnAction}>
                <MdAddCircle size='18' className={classes.btnPrimary} />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  render () {
    const { goTo, user, partner } = this.props
    const { accountId, clientId } = this.context

    return (
      <div className={classes.content}>
        <Row className={classes.contentRow}>
          <Col xs={4} md={3} className={classes.personalInfoContainer}>
            {' '}
          </Col>
          <Col xs={8} md={9} className={classes.question}>
            <h2 className={classes.initialDepositsTitle}>Initial Deposits</h2>
            <p className={classes.initialDepositsDesc}>
              Enter the details of the initial deposits you would like to make
              into your and Mary's SMSF accounts.
            </p>
          </Col>
        </Row>
        <Row className={classes.contentRow}>
          <Col xs={4} md={3} className={classes.personalInfoContainer}>
            <PersonalInfoBox user={user} listMode />
          </Col>
          <Col xs={8} md={9} className={classes.question}>
            <div className={classes.accounts}>
              <div className={classes.dipositsList}>
                <div className={classes.listHeader}>
                  YOUR INITIAL DEPOSITS
                </div>
                {this.renderInitialDeposits(user)}
              </div>

            </div>
          </Col>
        </Row>
        {partner &&
          <Row className={classes.contentRow}>
            <Col xs={4} md={3} className={classes.personalInfoContainer}>
              <PersonalInfoBox user={partner} bgColor='rgba(22, 0, 128, .15)' listMode />
            </Col>
            <Col xs={8} md={9} className={classes.question}>
              <div className={classes.accounts}>
                <div className={classes.dipositsList}>
                  <div className={classes.listHeader}>
                    Mary's INITIAL DEPOSITS
                  </div>
                  {this.renderInitialDeposits(partner)}
                </div>

              </div>
            </Col>
          </Row>
        }
        <SMSFConfirmModal />
        <div className={classes.bottomActions}>
          <Button bsStyle='default'
            onClick={function () {
              goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/2`)
            }}>
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

const requests = ({ retiresmartz: { planTogether } }) => ({
  user: getProfile,
  partner: planTogether ? getPartnerProfile : null
})

const actions = {
  goTo,
  show
}

export default R.compose(
  connect(requests, null, actions)
)(InitialDeposits)
