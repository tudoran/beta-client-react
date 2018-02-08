import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'redux/api'
import { goalSelector } from 'redux/selectors'
import { propsChanged } from 'helpers/pureFunctions'
import { set } from 'redux/modules/goals'
import GoalTarget from 'components/GoalTarget'

// getTarget :: Props -> Number
const getTarget = R.compose(
  R.defaultTo(0),
  R.path(['selected_settings', 'target'])
)

// saveTarget :: Props -> undefined
const saveTarget = ({ goalState: { target }, save }) => {
  const body = { target }
  save({ body })
}

export class GoalTargetContainer extends Component {
  static propTypes = {
    goal: PropTypes.object.isRequired,
    goalState: PropTypes.object,
    save: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired
  };

  static defaultProps = {
    goalState: {}
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goal', 'goalState'], this.props, nextProps)
  }

  render () {
    const { goal, goal: { id }, goalState, goalState: { isBoxOpened, isEditingTarget, target },
      save, set, ...otherProps } = this.props
    const finalTarget = target || getTarget(goal)

    return (
      <GoalTarget expanded={isBoxOpened} value={finalTarget} isEditing={isEditingTarget}
        onChange={function (target) { set({ id, target }) }}
        onEnd={function () { saveTarget({ goalState, save }) }}
        setIsEditing={function (value) { set({ id, isEditingTarget: value }) }} {...otherProps} />
    )
  }
}

const requests = ({ goal, goal: { id } }) => ({
  save: ({ update }) => update({
    type: 'goals',
    url: `/goals/${id}/selected-settings`,
    deserialize: selectedSettings => R.merge(goal, { selected_settings: selectedSettings })
  })
})

const selector = (state, { goal: { id } }) => ({
  goalState: goalSelector(id)(state)
})

const actions = {
  set
}

export default R.compose(
  connect(requests, selector, actions)
)(GoalTargetContainer)
