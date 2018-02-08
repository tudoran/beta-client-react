import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { DragDropContext, DropTarget } from 'react-dnd'
import { Col, Row } from 'react-bootstrap'
import { show } from 'redux-modal'
import Button from 'react-bootstrap/lib/Button'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import HTML5Backend from 'react-dnd-html5-backend'
import Infinite from 'react-infinite'
import R from 'ramda'
import { connect } from 'redux/api'
import { findQuerySelector } from 'redux/api/selectors'
import { getProfile } from 'redux/modules/auth'
import { goTo } from 'redux/modules/router'
import { isAuthenticatedSelector, goalsSelector } from 'redux/selectors'
import { propsChanged } from 'helpers/pureFunctions'
import { moveGoal, set, toggle } from 'redux/modules/goals'
import classes from './Overview.scss'
import ConfirmDepositModal
  from 'containers/ConfirmDepositModal/ConfirmDepositModal'
import CreateGoalModal from 'containers/CreateGoalModal/CreateGoalModal'
import OneTimeDeposit from './OneTimeDeposit/OneTimeDeposit'
import Goal from './Goal/Goal'
import Goals from './Goals/Goals'
import Spinner from 'components/Spinner/Spinner'

const getClientFirstName = ({ client, user }) =>
  R.equals(user && user.role, 'advisor')
    ? client && client.user && client.user.first_name
    : user && user.first_name

const getOrderedGoals = ({ order }, { goals }) => R.map(
  (id) => R.find(R.propEq('id', id), goals),
  order
)

const getGoalIndex = R.curry(({ order }, id) =>
  R.findIndex(R.equals(id), order)
)

const onEndDrop = R.curry(({ order }, { goals, updateGoal }) => {
  R.addIndex(R.forEach)((goal, index) => {
    const body = { order: index }
    updateGoal({
      id: goal.id,
      url: `/goals/${goal.id}`,
      body
    })
  }, getOrderedGoals({ order }, { goals }))
})

const renderGoals = _props => {
  const { account, connectDropTarget, goals, goalsState,
    requests: { goals: { status } }, show, toggle } = _props
  const hasGoals = !R.isNil(goals) && !R.isEmpty(goals)

  if (R.equals(status, 'pending')) {
    return <Spinner />
  } else {
    return connectDropTarget(
      <div>
        {hasGoals && <Goals account={account} goals={goals}
          allState={goalsState.all} show={show} toggle={toggle} />}
        <Infinite elementHeight={194} useWindowAsScrollContainer>
          {R.map(
            goal => goal ? renderGoal(goal, _props) : false,
            getOrderedGoals(goalsState, _props)
          )}
        </Infinite>
      </div>
    )
  }
}

const renderGoal = (goal, _props) => {
  const { goalsState, moveGoal, set, show, toggle, updateGoal } = _props
  const { id } = goal

  return (
    <Goal
      key={id}
      getGoalIndex={getGoalIndex(goalsState)}
      goal={goal}
      goalState={goalsState[id]}
      moveGoal={moveGoal}
      onEndDrop={function () { onEndDrop(goalsState, _props) }}
      set={set}
      show={show}
      toggle={toggle}
      updateGoal={function (params) {
        updateGoal({ ...params, url: `/goals/${id}` })
      }} />
  )
}

class Overview extends Component {
  static propTypes = {
    account: PropTypes.object,
    client: PropTypes.object,
    connectDropTarget: PropTypes.func,
    goals: PropTypes.array,
    goalsState: PropTypes.object,
    params: PropTypes.object,
    requests: PropTypes.object,
    set: PropTypes.func,
    show: PropTypes.func,
    toggle: PropTypes.func,
    updateGoal: PropTypes.func,
    updateGoalSettings: PropTypes.func,
    user: PropTypes.object,
    goTo: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['account', 'client', 'goals', 'goalsState', 'params',
      'requests', 'user'], this.props, nextProps)
  }

  render () {
    const { connectDropTarget, goals, goTo, params: { accountId, clientId },
      show } = this.props
    const clientFirstName = getClientFirstName(this.props)

    return connectDropTarget(
      <div className='container'>
        <Row>
          <Col xs={6} md={7}>
            <h1 className={classes['page-title']}>
              {clientFirstName &&
                `${clientFirstName}'s Personal Account Overview`}
            </h1>
          </Col>
          <Col xs={6} md={5} className='text-right'>
            <ul className='list-inline'>
              <li>
                <DropdownButton bsStyle='danger' pullRight title='Deposit'
                  id='deposit'>
                  <OneTimeDeposit goals={goals} />
                </DropdownButton>
                <ConfirmDepositModal />
              </li>
              <li>
                <Button bsStyle='primary' onClick={function () {
                  show('createGoal', { saveButtonLabel: 'Add Goal' })
                }}>
                  Add Goal
                </Button>
              </li>
              <li>
                <Button bsStyle='info' onClick={function () {
                  goTo(`/${clientId}/account/${accountId}/retiresmartz/setup`)
                }}>
                  RetireSmartz
                </Button>
              </li>
            </ul>
          </Col>
        </Row>
        {renderGoals(this.props)}
        <CreateGoalModal />
      </div>
    )
  }
}

const requests = ({ params: { accountId, clientId }, set }) => ({
  account: accountId && (({ findOne }) => findOne({
    type: 'accounts',
    id: accountId
  })),
  client: clientId && !R.equals(clientId, 'me') && (({ findOne }) => findOne({
    type: 'clients',
    id: clientId
  })),
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    },
    selector: R.compose(
      R.reject(({ state }) => R.equals(state, 3)),
      findQuerySelector({
        type: 'goals',
        query: {
          account: parseInt(accountId, 10)
        }
      })
    )
  }),
  updateGoal: ({ update }) => update({ type: 'goals' }),
  user: getProfile
})

const selector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector,
  goalsState: goalsSelector
})

const actions = {
  goTo,
  moveGoal,
  set,
  show,
  toggle
}

const boxTarget = {
  drop () {
  }
}

export default R.compose(
  connect(requests, selector, actions),
  DragDropContext(HTML5Backend),
  DropTarget('goal', boxTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))
)(Overview)
