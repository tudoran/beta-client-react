import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import R from 'ramda'
import { dateRanges } from '../../helpers'
import classes from './SelectDateRange.scss'

const withActiveClass = R.ifElse(
  R.equals,
  R.always(classes.activeItem),
  R.always(null)
)

export default class SelectDateRange extends Component {
  static propTypes = {
    activeDateRange: PropTypes.object,
    set: PropTypes.func.isRequired
  };

  render () {
    const { activeDateRange, set } = this.props

    return (
      <ul className={classes.selectDateRange}>
        {R.map(dateRange =>
          <li key={dateRange.label}
            className={classNames(classes.item, withActiveClass(activeDateRange, dateRange))}
            onClick={function () { set({ activeDateRangeLabel: dateRange.label }) }}>
            {dateRange.label}
          </li>
        , dateRanges)}
      </ul>
    )
  }
}
