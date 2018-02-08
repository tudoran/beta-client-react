import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'redux/api'
import { findOneSelector } from 'redux/api/selectors'

class EnabledGoal extends Component {
  static propTypes = {
    goalId: PropTypes.number,
    label: PropTypes.string
  };

  render () {
    const { label } = this.props
    return (
      <span>{label}</span>
    )
  }
}

const requests = ({ goalId }) => ({
  performanceHistory: ({ findAll }) => findAll({
    type: 'goals',
    url: `/goals/${goalId}/performance-history`,
    deserialize: (values, getState) => R.merge(
      findOneSelector({ type: 'goals', id: goalId })(getState()),
      { performanceHistory: values }
    )
  })
})

export default connect(requests, null, null)(EnabledGoal)
