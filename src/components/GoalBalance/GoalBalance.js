import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import { propsChanged } from 'helpers/pureFunctions'

export default class GoalBalance extends Component {
  static propTypes = {
    goal: PropTypes.object.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goal'], this.props, nextProps)
  }

  render () {
    const { goal: { balance } } = this.props

    return (
      <FormattedNumber value={balance} format='currency' />
    )
  }
}
