import React, { Component, PropTypes } from 'react'
import { Collapse } from 'react-bootstrap'
import { FormattedDate } from 'react-intl'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'
import AllCaps from 'components/AllCaps'
import classes from './GoalReturns.scss'
import GoalReturnsGroup from '../GoalReturnsGroup/GoalReturnsGroup'
import GoalReturnsFooterRow from '../GoalReturnsFooterRow/GoalReturnsFooterRow'
import Hr from '../Hr/Hr'
import Tooltip from 'components/Tooltip/Tooltip'

const total = R.compose(R.sum, R.values)

const earningsPercentage = ({ earned, invested }) => {
  const totalEarned = total(earned)
  const totalInvested = total(invested)
  return R.equals(totalInvested, 0) ? 0 : totalEarned / totalInvested
}

const getEarningsTooltip = id =>
  <Tooltip id={`tooltip-earnings-${id}`}>
      Your earnings include the impact of all cash flows, allocation
      changes and transfers you’ve made over the selected time.
      Earnings is calculated by dividing your earnings (including
      market changes, dividends, and fees) by your net deposits
      or your average balance. This return cannot be compared with
      other investments since the cashflows will be different.
  </Tooltip>

const getReturnTooltip = id =>
  <Tooltip id={`tooltip-return-${id}`}>
    The time-weighted return is the return of the BetaSmartz
    portfolio over the selected time. This is the time-weighted
    return excluding the impact of your own cashflows and transfers.
    If you are comparing returns to other investments you hold,
    you should use this return.
  </Tooltip>

export default class GoalReturns extends Component {
  static propTypes = {
    created: PropTypes.string,
    earned: PropTypes.object,
    earnedExpanded: PropTypes.bool,
    expanded: PropTypes.bool,
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    invested: PropTypes.object,
    investedExpanded: PropTypes.bool,
    timeWeightedReturn: PropTypes.number,
    toggle: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['created', 'earned', 'earnedExpanded', 'expanded',
      'id', 'invested', 'investedExpanded', 'timeWeightedReturn'],
      this.props, nextProps)
  }

  render () {
    const { created, earned, earnedExpanded, expanded, id, invested,
      investedExpanded, timeWeightedReturn, toggle } = this.props

    return (
      <Collapse in={expanded}>
        <div className={classes.returns}>
          <AllCaps value={<span>
            <span>Period since account opened</span>&nbsp;
            (<FormattedDate value={created} format='monthAndYear' />)
          </span>} />
          <GoalReturnsGroup
            expanded={investedExpanded}
            items={invested}
            onClick={function () { toggle({id, prop: 'isInvestedOpened'}) }}
            title={'What you\'ve invested'} />
          <GoalReturnsGroup
            expanded={earnedExpanded}
            items={earned}
            onClick={function () { toggle({id, prop: 'isEarnedOpened'}) }}
            title={'What you\'ve earned'} />
          <Hr />
          <GoalReturnsFooterRow
            title='Earnings %'
            tooltip={getEarningsTooltip(id)}
            value={earningsPercentage({ earned, invested })} />
          <GoalReturnsFooterRow
            title='Time-weighted return'
            tooltip={getReturnTooltip(id)}
            value={timeWeightedReturn} />
        </div>
      </Collapse>
    )
  }
}
