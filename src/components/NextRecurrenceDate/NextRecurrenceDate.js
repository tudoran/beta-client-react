import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import RRule from 'rrule'
import { propsChanged } from 'helpers/pureFunctions'

const nextDate = recurrence =>
  recurrence && RRule.rrulestr(recurrence).after(new Date())

export default class NextRecurrenceDate extends Component {
  static propTypes = {
    format: PropTypes.string,
    value: PropTypes.string
  };

  static defaultProps = {
    format: 'dddd, MMMM D, YYYY'
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['value'], this.props, nextProps)
  }

  render () {
    const { format, value } = this.props

    return (
      <span>{moment(nextDate(value)).format(format)}</span>
    )
  }
}
