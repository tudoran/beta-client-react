import React, { Component, PropTypes } from 'react'
import { Col, Collapse, Row } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import classNames from 'classnames'
import R from 'ramda'
import { getAllocation } from 'routes/Allocation/helpers'
import { propsChanged } from 'helpers/pureFunctions'
import AllCaps from 'components/AllCaps'
import Box from '../Box/Box'
import Button from 'components/Button/Button'
import classes from './Goals.scss'
import GoalEarnings from '../GoalEarnings/GoalEarnings'
import GoalGauge from '../GoalGauge/GoalGauge'
import GoalReturns from '../GoalReturns/GoalReturns'
import Hr from '../Hr/Hr'
import Text from 'components/Text'
import todoRefactorClasses from '../GoalDepositButton/GoalDepositButton.scss'
import TotalGoalsBalance from 'components/TotalGoalsBalance'

const total = path => R.compose(R.sum, R.map(R.path(path)))

const totalEarnings = total(['earnings'])

const totalTimeWeightedReturn = total(['total_return'])

const totalRiskScore = goals => R.compose(
  R.sum,
  R.map(R.compose(
    R.defaultTo(0),
    R.prop('configured_val'),
    R.defaultTo({}),
    getAllocation,
    R.prop('selected_settings')
  ))
)(goals) / R.length(goals)

const invested = goals => ({
  deposits: total(['invested', 'deposits'])(goals),
  withdrawals: total(['invested', 'withdrawals'])(goals),
  other: total(['invested', 'other'])(goals)
})

const earned = goals => ({
  deposits: total(['earned', 'market_moves'])(goals),
  withdrawals: total(['earned', 'dividends'])(goals),
  other: total(['earned', 'fees'])(goals)
})

export default class Goals extends Component {
  static propTypes = {
    account: PropTypes.object,
    allState: PropTypes.object,
    goals: PropTypes.array,
    show: PropTypes.func,
    toggle: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['allState', 'goals'], this.props, nextProps)
  }

  render () {
    const { account, allState = {}, goals, show, toggle } = this.props

    return (
      <Box expanded={allState.isBoxOpened} id='all' toggle={toggle}>
        <Row>
          <Col xs={7}>
            <Row>
              <Col xs={8}>
                <AllCaps value='Total Balance for all goals' />
                <div className={classes.balanceWrapper}>
                  <Text size='xlarge'>
                    <TotalGoalsBalance goals={goals} />
                  </Text>
                </div>
                <GoalEarnings label='Total Earnings' value={totalEarnings(goals)}
                  expanded={!allState.isBoxOpened} />
              </Col>
              <Col xs={4}>
                <div className='text-right'>
                  <AllCaps value='Unallocated Balance' />
                  <div className={classes.balanceRowWrapper}>
                    <span className={classes.depositButtonWrapper}>
                      <Button bsSize='xs'
                        onClick={function () { show('accountDeposit') }}
                        className={todoRefactorClasses.btnDeposit}>
                        Deposit
                      </Button>
                    </span>
                    <FormattedNumber value={account.cash_balance} format='currency' />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={5}>
            <div className={classNames(classes.taxLoss, 'text-center')}>
              <span className={classes.taxLossTitle}>
                <AllCaps value='Tax Loss Harvesting Off' />
              </span>
              <br />Harvested Losses <FormattedNumber value={0}
                format='currency' />
            </div>
          </Col>
        </Row>
        <Collapse in={allState.isBoxOpened}>
          <div>
            <Hr />
            <Row>
              <Col xs={7}>
                <GoalReturns
                  created={goals[0].created}
                  earned={earned(goals)}
                  earnedExpanded={allState.isEarnedOpened}
                  expanded={allState.isBoxOpened}
                  id='all'
                  invested={invested(goals)}
                  investedExpanded={allState.isInvestedOpened}
                  timeWeightedReturn={totalTimeWeightedReturn(goals)}
                  toggle={toggle} />
              </Col>
              <Col xs={5}>
                <div className={classes.gauge}>
                  <GoalGauge
                    label='Overall Allocation'
                    riskScore={totalRiskScore(goals)} />
                </div>
              </Col>
            </Row>
          </div>
        </Collapse>
      </Box>
    )
  }
}
