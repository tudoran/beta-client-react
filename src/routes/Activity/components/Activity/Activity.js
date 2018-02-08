import React, { Component, PropTypes } from 'react'
import { Grid, Panel } from 'react-bootstrap'
import R from 'ramda'
import { getActiveDateRange, getActiveType, getActivityTypes,
  getFilteredActivity } from '../../helpers'
import ActivityFooter from '../ActivityFooter'
import ActivityHeader from '../ActivityHeader'
import ActivityList from '../ActivityList'
import classes from './Activity.scss'
import PageTitle from 'components/PageTitle'
import Spinner from 'components/Spinner/Spinner'

export default class Activity extends Component {
  static propTypes = {
    accountActivity: PropTypes.array.isRequired,
    activityState: PropTypes.object.isRequired,
    activityTypes: PropTypes.array.isRequired,
    goalActivity: PropTypes.array.isRequired,
    goals: PropTypes.array.isRequired,
    goTo: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    set: PropTypes.func.isRequired
  };

  render () {
    const { props } = this
    const { activityState: { allGoals }, goals, goTo, params, requests, set } = props
    const activeType = getActiveType(props)
    const activityTypes = getActivityTypes(props)
    const activeDateRange = getActiveDateRange(props)
    const filteredActivity = getFilteredActivity(activeType, activeDateRange, props)
    const request = allGoals ? requests.accountActivity : requests.goalActivity
    const header = <ActivityHeader activeType={activeType} activityTypes={activityTypes}
      activeDateRange={activeDateRange} allGoals={allGoals} goals={goals} goTo={goTo}
      params={params} set={set} />

    return (
      <Grid>
        <PageTitle title='View your account activity' />
        <Panel header={header}>
          {R.equals(request && request.status, 'pending')
            ? <Spinner />
            : <ActivityList activityTypes={activityTypes} allGoals={allGoals}
              goals={goals} items={filteredActivity} />}
          <div className={classes.footerWrapper}>
            <ActivityFooter />
          </div>
        </Panel>
      </Grid>
    )
  }
}
