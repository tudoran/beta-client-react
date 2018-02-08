import React, { Component, PropTypes } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalNavigation.scss'

// activeGoals :: [Goal] -> [Goal]
const activeGoals = R.filter(R.propEq('state', 0))

// getMenuItems :: Props -> [Node]
const getMenuItems = ({ goals, onSelect, selectedGoalId }) => R.compose(
  R.map(goal =>
    <MenuItem key={goal.id} onClick={function () { onSelect(goal) }}
      active={R.equals(parseInt(selectedGoalId, 10), goal.id)}>
      {goal.name}
    </MenuItem>
  ),
  R.sortBy(R.prop('name')),
  activeGoals,
)(goals)

// getSelectedGoal :: Props -> Goal | undefined
const getSelectedGoal = ({ goals, selectedGoalId }) => R.find(
  R.propEq('id', parseInt(selectedGoalId, 10)),
  R.defaultTo([])(goals)
)

// getSelectedGoalName :: Props -> Goal | undefined
const getSelectedGoalName = R.compose(
  R.prop('name'),
  R.defaultTo({}),
  getSelectedGoal
)

// getLabel :: Props -> String
const getLabel = (props) => props.label
  || getSelectedGoalName(props)
  || 'Select a goal'

export default class GoalNavigation extends Component {
  static propTypes = {
    children: PropTypes.node,
    goals: PropTypes.array.isRequired,
    label: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    selectedGoalId: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['children', 'goals', 'label', 'onSelect', 'selectedGoalId'], this.props,
      nextProps)
  }

  render () {
    const { props } = this
    const { children } = props

    return (
      <Dropdown id='goalNavigation' className={classes.dropdown}>
        <Dropdown.Toggle className={classes.dropdownToggle}>
          <span>{getLabel(props)}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className={classes.dropdownMenu}>
          {getMenuItems(props)}
          {children && <MenuItem divider />}
          {children}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}
