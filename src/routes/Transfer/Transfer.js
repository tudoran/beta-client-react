import React, { Component, PropTypes } from 'react'
import { Col, MenuItem, Panel, Row } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'
import { FormattedDate, FormattedNumber } from 'react-intl'
import { replace, goTo } from 'redux/modules/router'
import { show } from 'redux-modal'
import R from 'ramda'
import { connect } from 'redux/api'
import { MdExpandLess, MdExpandMore } from 'helpers/icons'
import { pendingPanelExpandedSelector } from 'redux/selectors'
import { propsChanged } from 'helpers/pureFunctions'
import { togglePendingPanel } from 'redux/modules/transfer'
import AllCaps from 'components/AllCaps'
import Button from 'components/Button/Button'
import classes from './Transfer.scss'
import ConfirmDepositModal from 'containers/ConfirmDepositModal/ConfirmDepositModal'
import ConfirmWithdrawModal from './ConfirmWithdrawModal/ConfirmWithdrawModal'
import Deposit from './Deposit/Deposit'
import GoalBalance from 'components/GoalBalance'
import GoalNavigation from 'components/GoalNavigation'
import GoalTargetContainer from 'containers/GoalTargetContainer'
import InlineList from 'components/InlineList'
import Spinner from 'components/Spinner/Spinner'
import Text from 'components/Text'
import Withdraw from './Withdraw/Withdraw'

const getPendingDeposit = R.compose(
  R.when(R.gt(0), R.always(0)),
  R.defaultTo(0),
  R.path(['goal', 'invested', 'net_pending'])
)

const pageHeader = (_props) => {
  const { account, goal, goals, goTo, params: { accountId, clientId, goalId }, show } = _props

  return (
    <Row>
      <Col xs={3}>
        <GoalNavigation goals={goals} selectedGoalId={goalId} onSelect={function (goal) {
            goTo(`/${clientId}/account/${accountId}/goal/${goal.id}/transfer`)
          }}>
          <MenuItem key='retiresmartz' onClick={function () {
              goTo(`/${clientId}/account/${accountId}/retiresmartz/setup`)
          }}>
            RetireSmartz
          </MenuItem>
          <MenuItem key='addGoal' onClick={function () {
            show('createGoal', { saveButtonLabel: 'Add Goal' })
          }}>
            Add Goal
          </MenuItem>
        </GoalNavigation>
      </Col>
      <Col xs={2}>
        <AllCaps tagName='div' value='Balance' />
        <Text size='large'>
          <GoalBalance goal={goal} />
        </Text>
      </Col>
      <Col xs={2}>
        <AllCaps tagName='div' value='Target' />
        <Text size='large'>
          <GoalTargetContainer goal={goal} />
        </Text>
      </Col>
      <Col xs={5} className='text-right'>
        <InlineList>
          {account && account.cash_balance > 0 && <div>
            <AllCaps tagName='div' value='Unallocated Account Balance' />
            <Text size='large'>
              <FormattedNumber value={account.cash_balance} format='currency' />
            </Text>
          </div>}
          <div className={classes.depositButtonWrapper}>
            <Button onClick={function () { show('accountDeposit') }}>
              Deposit
            </Button>
          </div>
        </InlineList>
      </Col>
    </Row>
  )
}

const subHeader = (_props) =>
  <Row>
    <Col xs={3}>
      <h3 className={classes.pendingTitle}>Pending Transfers</h3>
    </Col>
    <Col xs={9}>
      <FormattedNumber value={getPendingDeposit(_props)} format='currency' />
      <span onClick={_props.togglePendingPanel}>
        {_props.pendingPanelExpanded ? <MdExpandLess /> : <MdExpandMore />}
      </span>
    </Col>
  </Row>

class Transfer extends Component {
  static propTypes = {
    account: PropTypes.object,
    goal: PropTypes.object,
    goals: PropTypes.array.isRequired,
    goTo: PropTypes.func,
    params: PropTypes.object,
    pendingPanelExpanded: PropTypes.bool,
    show: PropTypes.func,
    togglePendingPanel: PropTypes.func,
    transfers: PropTypes.array
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goal', 'params', 'pendingPanelExpanded', 'transfers'],
      this.props, nextProps)
  }

  render () {
    const { props } = this
    const { goal, pendingPanelExpanded, show, transfers } = props
    const pendingDeposit = getPendingDeposit(props)

    return (
      <div className='container'>
        <h1 className={classes.pageTitle}>Deposit or withdraw money</h1>
        <Panel header={goal && pageHeader(props)} className={classes.panel}>
          <Panel collapsible header={subHeader(props)}
            expanded={pendingPanelExpanded} className={classes.pending}>
            {R.map(({ amount, id, time }) =>
              <Row key={id}>
                <Col xs={3} className='text-right'>
                  <FormattedDate value={time * 1000} format='dayMonthAndYear' />
                </Col>
                <Col xs={9}>
                  <FormattedNumber value={amount} format='currency' />
                </Col>
              </Row>
            , transfers)}
          </Panel>
          {goal
            ? <div>
              <div className={classes.transferRow}>
                <Col xs={12}>
                  <Deposit goal={goal} pendingDeposit={pendingDeposit}
                    show={show} />
                </Col>
              </div>
              <div className={classes.transferRow}>
                <Col xs={12}>
                  <Withdraw goal={goal} show={show} />
                </Col>
              </div>
            </div>
            : <Spinner />}
        </Panel>
        <ConfirmDepositModal goal={goal} />
        <ConfirmWithdrawModal goal={goal} />
      </div>
    )
  }
}

const selector = createStructuredSelector({
  pendingPanelExpanded: pendingPanelExpandedSelector
})

const requests = ({ params: { accountId, goalId } }) => ({
  account: ({ findOne }) => findOne({
    type: 'accounts',
    id: accountId
  }),
  goal: goalId && (({ findOne }) => findOne({ type: 'goals', id: goalId })),
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  }),
  transfers: goalId && (({ findQuery }) => findQuery({
    type: 'transfers',
    url: `/goals/${goalId}/pending-transfers`,
    query: {
      goal: parseInt(goalId, 10)
    },
    deserialize: R.map(R.assoc('goal', parseInt(goalId, 10)))
  }))
})

const actions = {
  goTo,
  replace,
  show,
  togglePendingPanel
}

export default R.compose(
  connect(requests, selector, actions)
)(Transfer)
