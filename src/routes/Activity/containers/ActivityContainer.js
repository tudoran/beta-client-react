import { createStructuredSelector } from 'reselect'
import { replace, goTo } from 'redux/modules/router'
import R from 'ramda'
import uuid from 'uuid'
import { activitySelector } from 'redux/selectors'
import { connect } from 'redux/api'
import { set } from 'redux/modules/activity'
import Activity from '../components/Activity'

const requests = ({ params: { accountId, clientId, goalId } }) => ({
  accountActivity: ({ findQuery }) => findQuery({
    type: 'activity',
    url: `/accounts/${accountId}/activity`,
    query: {
      account: accountId
    },
    mergeParams: () => ({
      account: accountId,
      id: uuid.v4()
    })
  }),
  activityTypes: ({ findAll }) => findAll({
    type: 'activityTypes',
    url: '/settings/activity-types'
  }),
  goalActivity: ({ findQuery }) => findQuery({
    type: 'activity',
    url: `/goals/${goalId}/activity`,
    query: {
      goal: goalId
    },
    mergeParams: () => ({
      goal: goalId,
      id: uuid.v4()
    })
  }),
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  })
})

const selector = createStructuredSelector({
  activityState: activitySelector
})

const actions = {
  goTo,
  replace,
  set
}

export default R.compose(
  connect(requests, selector, actions)
)(Activity)
