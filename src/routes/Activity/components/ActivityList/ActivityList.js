import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { getDescription, goalForActivity } from '../../helpers'
import { mapIndexed } from 'helpers/pureFunctions'
import ActivityListItem from '../ActivityListItem'
import classes from './ActivityList.scss'

export default class ActivityList extends Component {
  static propTypes = {
    activityTypes: PropTypes.array.isRequired,
    allGoals: PropTypes.bool.isRequired,
    goals: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired
  };

  render () {
    const { props } = this
    const { allGoals, items } = props

    return (
      <table className={classes.table}>
        <thead>
          <tr>
            {allGoals && <th>Goal</th>}
            <th>Date</th>
            <th>Description</th>
            <th className='text-right'>Change</th>
            <th className={classNames('text-right', classes.lastColumn)}>
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {mapIndexed((item, index) =>
            <ActivityListItem key={index} allGoals={allGoals}
              description={getDescription(item, props)}
              goal={goalForActivity(item, props)} item={item} />
          , items)}
        </tbody>
      </table>
    )
  }
}
