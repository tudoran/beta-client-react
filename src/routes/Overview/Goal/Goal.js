import React, { Component, PropTypes } from 'react'
import { Col, Collapse, Row } from 'react-bootstrap'
import { DragSource, DropTarget } from 'react-dnd'
import { show } from 'redux-modal'
import classNames from 'classnames'
import R from 'ramda'
import { getAllocation, getAutoTransactionEnabled, getMonthlyTransactionAmount,
  getMonthlyTransactionRecurrence } from 'routes/Allocation/helpers'
import { propsChanged } from 'helpers/pureFunctions'
import AllCaps from 'components/AllCaps'
import Box from '../Box/Box'
import classes from './Goal.scss'
import config from 'config'
import GoalAllocation from '../GoalAllocation/GoalAllocation'
import GoalBalance from 'components/GoalBalance'
import GoalDepositButton from '../GoalDepositButton/GoalDepositButton'
import GoalEarnings from '../GoalEarnings/GoalEarnings'
import GoalGauge from '../GoalGauge/GoalGauge'
import GoalName from '../GoalName/GoalName'
import GoalReturns from '../GoalReturns/GoalReturns'
import GoalTargetContainer from 'containers/GoalTargetContainer'
import GoalTransactionInfo from '../GoalTransactionInfo/GoalTransactionInfo'
import NextRecurrenceDate from 'components/NextRecurrenceDate/NextRecurrenceDate'
import Text from 'components/Text'
import Tooltip from 'components/Tooltip/Tooltip'
import TrackButton from 'components/TrackButton'

const getAutoDepositTooltip = id =>
  <Tooltip id={`tooltip-auto-deposit-${id}`}>
    <p>Use automatic deposit to set up free recurring transfers from your linked
      account.
    </p>
    <p>You choose the amount and frequency and can change these or discontinue
      at any time.
    </p>
  </Tooltip>

const getAutoWithdrawalTooltip = id =>
  <Tooltip id={`tooltip-auto-withdrawal-${id}`}>
    <p>Use automatic withdrawal to set up a free recurring income stream from
      this goal to your linked account.
    </p>
    <p>Withdrawals will only process if the goal balance covers the amount.</p>
  </Tooltip>

const saveName = ({ goal: { id }, goalState, set, updateGoal }) => {
  const body = { name: goalState.name }
  updateGoal({ body })
}

class Goal extends Component {
  static propTypes = {
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    goal: PropTypes.object.isRequired,
    goalState: PropTypes.object,
    isDragging: PropTypes.bool,
    onEndDrop: PropTypes.func,
    set: PropTypes.func,
    show: PropTypes.func,
    updateGoal: PropTypes.func,
    updateGoalSettings: PropTypes.func,
    toggle: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goal', 'goalState', 'isDragging'], this.props,
      nextProps)
  }

  render () {
    const { connectDragPreview, connectDragSource, connectDropTarget, goal,
      goal: { id, selected_settings }, isDragging, goalState = {}, set, show,
      toggle, updateGoal } = this.props
    const stateLabel = goal && config.goalsStates[goal.state]
    const className = classNames({
      [classes.isDragging]: isDragging
    })

    return connectDragPreview(connectDropTarget(
      <div className={className} onDrag={function () { return false }}>
        <Box className={classes[stateLabel]}
          connectDragSource={connectDragSource}
          expanded={goalState.isBoxOpened} goal={goal} id={id} set={set}
          show={show} toggle={toggle}>
          <Row>
            <Col xs={7}>
              <Row>
                <Col xs={8}>
                  <GoalName name={goalState.name || goal.name}
                    isEditing={goalState.isEditingName}
                    onChange={function (name) { set({ id, name }) }}
                    onEnd={function () {
                      saveName({ goal, goalState, set, updateGoal })
                    }}
                    setIsEditing={function (value) {
                      set({ id, isEditingName: value })
                    }} />
                  <TrackButton goal={goal} />
                </Col>
                <Col xs={4}>
                  <div className='text-right'>
                    <AllCaps value='Current Balance' />
                    <div className={classes.balanceRowWrapper}>
                      {!getAutoTransactionEnabled(selected_settings) &&
                        <span className={classes.depositButtonWrapper}>
                          <GoalDepositButton goalId={id} />
                        </span>}
                      <Text size='large'>
                        <GoalBalance goal={goal} />
                      </Text>
                    </div>
                  </div>
                  <GoalEarnings className='text-right' label='Earnings'
                    value={goal.earnings} expanded={!goalState.isBoxOpened} />
                  <Collapse in={goalState.isBoxOpened}>
                    <div className='text-right'>
                      <GoalTargetContainer goal={goal} />
                    </div>
                  </Collapse>
                </Col>
              </Row>
              <GoalReturns
                created={goal.created}
                expanded={goalState.isBoxOpened}
                earned={goal.earned}
                earnedExpanded={goalState.isEarnedOpened}
                id={id}
                invested={R.omit(['net_pending'], goal.invested)}
                investedExpanded={goalState.isInvestedOpened}
                timeWeightedReturn={goal.total_return}
                toggle={toggle} />
              <GoalTransactionInfo
                amount={getMonthlyTransactionAmount(selected_settings)}
                date={<NextRecurrenceDate
                  value={getMonthlyTransactionRecurrence(selected_settings)} />}
                enabled={getAutoTransactionEnabled(selected_settings)}
                label='Auto-deposit'
                onClick={function () { show('autoTransaction', { goal }) }}
                tooltip={getAutoDepositTooltip(id)} />
              <GoalTransactionInfo
                amount={getMonthlyTransactionAmount(selected_settings, true)}
                date={<NextRecurrenceDate
                  value={getMonthlyTransactionRecurrence(selected_settings, true)} />}
                enabled={getAutoTransactionEnabled(selected_settings, true)}
                label='Auto-withdrawal'
                onClick={function () {
                  show('autoTransaction', { goal, isWithdraw: true })
                }}
                tooltip={getAutoWithdrawalTooltip(id)} />
            </Col>
            <Col xs={5}>
              <GoalGauge
                riskScore={getAllocation(selected_settings).configured_val} />
              <GoalAllocation
                bondsBalance={goal.bond_balance}
                expanded={goalState.isBoxOpened}
                goalId={id}
                stocksBalance={goal.stock_balance} />
            </Col>
          </Row>
        </Box>
      </div>
    ))
  }
}

const goalTarget = {
  canDrop () {
    return false
  },

  hover (props, monitor) {
    const { id: draggedId } = monitor.getItem()
    const { getGoalIndex, goal: { id: overId }, moveGoal } = props

    if (!R.equals(draggedId, overId)) {
      const overIndex = getGoalIndex(overId)
      moveGoal({
        id: draggedId,
        atIndex: overIndex
      })
    }
  }
}

const goalSource = {
  beginDrag ({ getGoalIndex, goal }) {
    return {
      id: goal && goal.id,
      originalIndex: getGoalIndex(goal && goal.id)
    }
  },

  endDrag (props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem()
    const { moveGoal, onEndDrop } = props
    const didDrop = monitor.didDrop()

    if (didDrop) {
      onEndDrop()
    } else {
      moveGoal({
        id: droppedId,
        atIndex: originalIndex
      })
    }
  }
}

export default R.compose(
  DropTarget('goal', goalTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource('goal', goalSource, (connect, monitor) => ({
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(Goal)
