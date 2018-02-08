import moment from 'moment'
import R from 'ramda'

// ------------------------------------
// Activity Types
// ------------------------------------
const allActivityType = {
  id: -1,
  name: 'All Activity',
  filter: R.always(true)
}

const filterActivity = (activityType) =>
  (activity) => R.equals(activity.type, activityType.id)

const getActiveTypeId = ({ activityState }) =>
  activityState && activityState.activeTypeId || allActivityType.id

const assocFilterActivity = (activityType) =>
  R.assoc('filter', filterActivity(activityType), activityType)

export const getActivityTypes = R.compose(
  R.prepend(allActivityType),
  R.map(assocFilterActivity),
  R.prop('activityTypes')
)

export const getActiveType = (props) =>
  R.find(
    R.propEq('id', getActiveTypeId(props)),
    getActivityTypes(props)
  )

// ------------------------------------
// Date Ranges
// ------------------------------------
export const dateRanges = [
  {
    label: '1 mo',
    filter: ({ time }) =>
      R.gte(time * 1000, moment().subtract(1, 'months').valueOf())
  },
  {
    label: '1 yr',
    filter: ({ time }) =>
      R.gte(time * 1000, moment().subtract(1, 'years').valueOf())
  },
  {
    label: 'All',
    filter: R.always(true)
  }
]

export const getActiveDateRange = R.compose(
  R.flip(R.find)(dateRanges),
  R.propEq('label'),
  R.defaultTo('All'),
  R.path(['activityState', 'activeDateRangeLabel'])
)

// ------------------------------------
// Activity Description & Goal
// ------------------------------------
const getDescriptionTemplate = ({ activity, activityTypes }) => R.compose(
  R.defaultTo(''),
  R.prop('format_str'),
  R.defaultTo({}),
  R.find(R.propEq('id', activity.type))
)(activityTypes)

const getNumberOfSubstitutions = R.compose(
  R.length,
  R.match(/\{\}/g)
)

export const getDescription = (activity, { activityTypes }) => {
  const { data } = activity
  const template = getDescriptionTemplate({ activity, activityTypes })
  const numberOfSubstitutions = getNumberOfSubstitutions(template)

  return R.reduce((str, index) =>
    R.replace('{}', data[index], str)
  , template, R.range(0, numberOfSubstitutions))
}

export const goalForActivity = ({ goal }, { goals }) =>
  R.find(R.propEq('id', goal), goals) || {}

// ------------------------------------
// Filter
// ------------------------------------
const getActivity = ({ activityState, accountActivity, goalActivity }) =>
  activityState.allGoals ? accountActivity : goalActivity

export const getFilteredActivity = (activeType, activeDateRange, props) =>
  R.filter(
    R.converge(R.and, [activeType.filter, activeDateRange.filter]),
    getActivity(props)
  )
