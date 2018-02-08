import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'

// total :: [String] -> Array -> Number
const total = path => R.compose(
  R.sum,
  R.map(R.compose(
    R.defaultTo(0),
    R.path(path)
  ))
)

// totalBalance :: Props -> Number
const totalBalance = R.compose(
  total(['balance']),
  R.prop('goals')
)

export default class TotalGoalsBalance extends Component {
  static propTypes = {
    goals: PropTypes.array.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goals'], this.props, nextProps)
  }

  render () {
    const { props } = this

    return (
      <FormattedNumber value={totalBalance(props)} format='currency' />
    )
  }
}
