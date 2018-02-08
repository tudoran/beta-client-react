import React, { Component, PropTypes } from 'react'
import { Col, MenuItem, Row } from 'react-bootstrap'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'
import AllCaps from 'components/AllCaps'
import GoalBalance from 'components/GoalBalance'
import GoalNavigation from 'components/GoalNavigation'
import GoalTargetContainer from 'containers/GoalTargetContainer'
import SelectActivityType from '../SelectActivityType'
import SelectDateRange from '../SelectDateRange'
import Text from 'components/Text'

// getSelectedGoal :: Props -> Goal | undefined
const getSelectedGoal = ({ goals, params: { goalId } }) => R.find(
  R.propEq('id', parseInt(goalId, 10)),
  goals
)

export default class ActivityHeader extends Component {
  static propTypes = {
    activeDateRange: PropTypes.object,
    activeType: PropTypes.object.isRequired,
    activityTypes: PropTypes.array.isRequired,
    allGoals: PropTypes.bool,
    goals: PropTypes.array.isRequired,
    goTo: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    set: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return propsChanged(['activeDateRange', 'activeType', 'activityTypes', 'allGoals', 'goals',
      'params'], this.props, nextProps)
  }

  handleGoalSelect = (goal) => {
    const { goTo, params: { accountId, clientId }, set } = this.props
    set({ allGoals: false })
    goTo(`/${clientId}/account/${accountId}/goal/${goal.id}/activity`)
  }

  handleAllGoalsSelect = () => {
    const { set } = this.props
    set({ allGoals: true })
  }

  render () {
    const { props } = this
    const { activeType, activityTypes, activeDateRange, allGoals, goals, params: { goalId },
      set } = props
    const label = allGoals ? 'All Goals' : null
    const selectedGoal = !allGoals && getSelectedGoal(props)

    return (
      <Row>
        <Col xs={3}>
          <GoalNavigation goals={goals} label={label} onSelect={this.handleGoalSelect}
            selectedGoalId={goalId}>
            <MenuItem key='allGoals' onClick={this.handleAllGoalsSelect}>
              All Goals
            </MenuItem>
          </GoalNavigation>
        </Col>
        {selectedGoal &&
          <Col xs={2}>
            <AllCaps tagName='div' value='Balance' />
            <Text size='large'>
              <GoalBalance goal={selectedGoal} />
            </Text>
          </Col>}
        {selectedGoal &&
          <Col xs={2}>
            <AllCaps tagName='div' value='Target' />
            <Text size='large'>
              <GoalTargetContainer goal={selectedGoal} />
            </Text>
          </Col>}
        <Col xs={5} xsOffset={selectedGoal ? 0 : 4} className={selectedGoal && 'text-right'}>
          <Row>
            <Col sm={7}>
              <SelectActivityType activeType={activeType} activityTypes={activityTypes} set={set} />
            </Col>
            <Col sm={5}>
              <SelectDateRange activeDateRange={activeDateRange} set={set} />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
