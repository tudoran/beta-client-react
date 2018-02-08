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
import schema from 'schemas/withdraw'
import Tooltip from 'components/Tooltip/Tooltip'

// TODO:
// This should be merged with '../Deposit/Deposit' into a single
// <Transaction isWithdraw={isWithdraw} /> component.
// Do the merge once the specs stabilize.

const tooltipWithdraw =
  <Tooltip id='tooltipWithdraw'>
    Transfer money from your BetaSmartz goal to your linked checking account.
    A withdrawal takes 4-5 business days to appear in your linked account if
    you submit your request before 15:30 Australian Eastern Time (AET).
  </Tooltip>

const autoWithdrawTooltip =
  <Tooltip id='autoWithdrawTooltip'>
    <p>Use automatic withdrawal to set up a free recurring income stream from
      this goal to your linked account.
    </p>
    <p>Withdrawals will only process if the goal balance covers the amount.</p>
  </Tooltip>

const tooltipAvailable =
  <Tooltip id='tooltipAvailable'>
    Your available balance may be different than your current balance
    because it accounts for pending withdrawals, conditional bonuses,
    and prorated fees.
  </Tooltip>

class Withdraw extends Component {
  static propTypes = {
    fields: PropTypes.object,
    handleSubmit: PropTypes.func,
    goal: PropTypes.object,
    resetForm: PropTypes.func,
    show: PropTypes.func,
    withdraw: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['balance', 'fields', 'goal'], this.props, nextProps)
  }

  render () {
    const { fields: { amount }, goal: { balance, name, selected_settings },
      goal, handleSubmit, resetForm, show } = this.props
    const withdrawalRecurrence = getMonthlyTransactionRecurrence(selected_settings, true)
    const withdrawalAmount = getMonthlyTransactionAmount(selected_settings, true)
    const autoWithdrawEnabled = getAutoTransactionEnabled(selected_settings)

    return (
      <div>
        <h4 className={classes.colTitle}>
          <OverlayTrigger placement='top' overlay={tooltipWithdraw}>
            <strong className={classes.hasTooltip}>Withdraw</strong>
          </OverlayTrigger>
          &nbsp;from your {name} goal.
        </h4>
        <Form inline className={classes.colBlock}
          onSubmit={handleSubmit(({ amount }) =>
            show('confirmWithdraw', { amount, resetForm }))}>
          <FormGroup controlId='oneTimeWithdrawAmount'
            className={classes.formGroup}>
            <CurrencyInput {...amount} max={balance} />
          </FormGroup>
          <FormGroup className={classes.formGroup}
            controlId='OneTimeWithdrawSubmit'>
            <Button bsStyle='primary' type='submit'>Withdraw</Button>
          </FormGroup>
          <OverlayTrigger placement='top' overlay={autoWithdrawTooltip}>
            <Button className={classes.formGroup}
              onClick={function () {
                show('autoTransaction', { goal, isWithdraw: true })
              }}
              bsStyle={autoWithdrawEnabled ? 'round-success' : 'round'}>
              <MdLoop size='18' /> Auto-Withdraw&nbsp;
              {autoWithdrawEnabled ? 'On' : 'Off'}
            </Button>
          </OverlayTrigger>
          {withdrawalRecurrence && withdrawalAmount &&
            <span className={classes.nextTransactions}>
              <span className={classes.nextTransfer}>
                Next Transfer:&nbsp;
              </span>
              <span>
                <span>Auto withdraw&nbsp;</span>
                <FormattedNumber value={withdrawalAmount} format='currency' />
                <span>&nbsp;on&nbsp;</span>
                <NextRecurrenceDate value={withdrawalRecurrence} />
                <span>.</span>
              </span>
            </span>}
          <div className={classes.helpNote}>
            <OverlayTrigger placement='top' overlay={tooltipAvailable}>
              <span>(<span className={classes.hasTooltip}>
                <FormattedNumber value={balance}
                  format='currency' /> available
              </span>)</span>
            </OverlayTrigger>
          </div>
        </Form>
      </div>
    )
  }
}

export default R.compose(
  reduxForm({
    form: 'withdraw',
    ...schema
  })
)(Withdraw)
