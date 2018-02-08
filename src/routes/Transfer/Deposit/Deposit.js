import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import { Form, FormGroup, OverlayTrigger } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import R from 'ramda'
import { getAutoTransactionEnabled, getMonthlyTransactionAmount,
  getMonthlyTransactionRecurrence } from 'routes/Allocation/helpers'
import { MdLoop } from 'helpers/icons'
import { propsChanged } from 'helpers/pureFunctions'
import Button from 'components/Button/Button'
import classes from '../Transfer.scss'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import NextRecurrenceDate
  from 'components/NextRecurrenceDate/NextRecurrenceDate'
import schema from 'schemas/oneTimeDeposit'
import Tooltip from 'components/Tooltip/Tooltip'
import WireInstructionsModal
  from '../WireInstructionsModal/WireInstructionsModal'

const tooltipDeposit =
  <Tooltip id='tooltipDeposit'>
    Transfer money from your linked checking account to BetaSmartz.
    A deposit takes 1 business day if submitted before 23:00 Australian
    Eastern Time (AET). Check the Activity tab to see when a pending
    deposit is expected to invest.
  </Tooltip>

const autoDepositTooltip =
  <Tooltip id='autoDepositTooltip'>
    <p>
      Use automatic deposit to set up free recurring transfers from your
      linked account.
    </p>
    <p>
      You choose the amount and frequency and can change these or discontinue
      at any time.
    </p>
  </Tooltip>

class Deposit extends Component {
  static propTypes = {
    fields: PropTypes.object,
    goal: PropTypes.object,
    handleSubmit: PropTypes.func,
    pendingDeposit: PropTypes.number,
    resetForm: PropTypes.func,
    show: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['fields', 'goal', 'pendingDeposit'], this.props,
      nextProps)
  }

  render () {
    const { fields: { amount }, goal, goal: { selected_settings }, handleSubmit,
      pendingDeposit, resetForm, show } = this.props
    const depositAmount = getMonthlyTransactionAmount(selected_settings)
    const depositRecurrence = getMonthlyTransactionRecurrence(selected_settings)
    const autoDepositEnabled = getAutoTransactionEnabled(selected_settings)

    return (
      <div>
        <h4 className={classes.colTitle}>
          <OverlayTrigger placement='top' overlay={tooltipDeposit}>
            <strong className={classes.hasTooltip}>Deposit</strong>
          </OverlayTrigger>
          &nbsp;into your {goal.name} goal.
        </h4>
        <Form inline className={classes.colBlock}
          onSubmit={handleSubmit(({ amount }) =>
            show('confirmDeposit', { amount, resetForm }))}>
          <FormGroup controlId='oneTimeDepositAmount'
            className={classes.formGroup}>
            <CurrencyInput name='amount' {...amount} />
          </FormGroup>
          <FormGroup controlId='oneTimeDepositSubmit'
            className={classes.formGroup}>
            <Button bsStyle='primary' type='submit'>Deposit</Button>
          </FormGroup>
          <OverlayTrigger placement='top' overlay={autoDepositTooltip}>
            <Button className={classes.formGroup}
              onClick={function () { show('autoTransaction', { goal }) }}
              bsStyle={autoDepositEnabled ? 'round-success' : 'round'}>
              <MdLoop size='18' /> Auto-Deposit&nbsp;
              {autoDepositEnabled ? 'On' : 'Off'}
            </Button>
          </OverlayTrigger>
          {depositRecurrence && depositAmount && autoDepositEnabled &&
            <span className={classes.nextTransactions}>
              <span className={classes.nextTransfer}>
                Next Transfer:&nbsp;
              </span>
              <span>
                <span>Auto deposit&nbsp;</span>
                <FormattedNumber value={depositAmount} format='currency' />
                <span>&nbsp;on&nbsp;</span>
                <NextRecurrenceDate value={depositRecurrence} />
                <span>.</span>
              </span>
            </span>}
          {pendingDeposit
            ? <div className={classes.helpNote}>
              <FormattedNumber value={pendingDeposit}
                format='currency' /> pending
            </div>
            : false}
        </Form>
        <div className={classes.colBlock}>
          Want to do a&nbsp;
          <a onClick={function () { show('wireInstructionsModal') }}>
            wire transfer
          </a> instead?
        </div>
        <WireInstructionsModal goalName={goal.name} />
      </div>
    )
  }
}

export default R.compose(
  reduxForm({
    form: 'oneTimeDeposit',
    ...schema
  })
)(Deposit)
