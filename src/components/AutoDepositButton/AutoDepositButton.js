import React, { Component, PropTypes } from 'react'
import 'rrule/lib/nlp'
import { FormattedNumber } from 'react-intl'
import { OverlayTrigger } from 'react-bootstrap'
import R from 'ramda'
import RRule from 'rrule'
import { mapIndexed } from 'helpers/pureFunctions'
import { MdLoop } from 'helpers/icons'
import Button from 'components/Button/Button'
import Tooltip from 'components/Tooltip/Tooltip'

const getTransactions = R.compose(
  R.map(({ amount, schedule }) => ({
    amount,
    rule: RRule.rrulestr(schedule)
  })),
  R.filter(({ amount }) => amount > 0),
  R.defaultTo([]),
  R.path(['selected_settings', 'recurring_transactions'])
)

const btnTooltip = ({ goal, transactions }) => {
  return (
    <Tooltip id={`auto-deposit-tooltip-${goal.id}`}>
      <strong>Auto-deposit</strong>
      {mapIndexed(({ amount, rule }, index) =>
        <div key={index}>
          <FormattedNumber value={amount} format='currency' />&nbsp;
          {rule.toText()}
        </div>
      , transactions)}
    </Tooltip>
  )
}

btnTooltip.propTypes = {
  goal: PropTypes.object,
  transactions: PropTypes.array
}

export default class AutoDepositButton extends Component {
  static propTypes = {
    goal: PropTypes.object.isRequired,
    onClick: PropTypes.func
  };

  render () {
    const { goal, onClick } = this.props
    const transactions = getTransactions(goal)
    const tooltip = btnTooltip({ goal, transactions })

    if (R.isEmpty(transactions)) {
      return <span />
    } else {
      return (
        <OverlayTrigger placement='top' overlay={tooltip}>
          <Button bsStyle='circle-success' onClick={onClick}>
            <MdLoop size='24' />
          </Button>
        </OverlayTrigger>
      )
    }
  }
}
