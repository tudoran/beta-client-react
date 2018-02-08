import R from 'ramda'
import { findAllSelector } from 'redux/api/selectors'
import { getValidConstraints } from 'routes/Allocation/helpers'

// ------------------------------------
// Helpers
// ------------------------------------
export const calculatedPortfolioFootprint = R.compose(
  portfolio => R.mergeAll([
    portfolio,
    // TODO: hack to round risk_score. Remove once API is fixed
    { risk: Math.round(portfolio.risk * 100) / 100 },
    { constraints: R.sortBy(R.prop('id'), portfolio.constraints) }
  ]),
  R.pick(['goalId', 'risk', 'constraints'])
)

// ------------------------------------
// Auth
// ------------------------------------
export const isAuthenticatedSelector = R.prop('isAuthenticated')
export const isPartnerAuthenticatedSelector = R.prop('isPartnerAuthenticated')

// ------------------------------------
// RouteParams
// ------------------------------------
export const routeParamsSelector = R.prop('routeParams')

// ------------------------------------
// Portfolio
// ------------------------------------
export const questions = R.compose(
  R.defaultTo([]),
  R.path(['portfolio', 'questions'])
)

// ------------------------------------
// Goal Overview
// ------------------------------------
const goalsOverview = R.prop('goalsOverview')

export const goalOverview = goalId => R.compose(
  R.prop(goalId),
  goalsOverview
)

// ------------------------------------
// Goals
// ------------------------------------
export const goalsSelector = R.prop('goals')

export const goalSelector = id => R.compose(
  R.prop(id),
  goalsSelector
)

// ------------------------------------
// Allocation
// ------------------------------------
export const allocation = R.prop('allocation')

export const endValue50Selector = R.compose(
  R.prop('endValue50'),
  allocation
)

export const calculatedPortfolio = obj => {
  const validConstraints = getValidConstraints(obj.constraints)
  const finalObj = R.merge(obj, { constraints: validConstraints })

  return R.compose(
    R.find(
      R.compose(
        R.equals(calculatedPortfolioFootprint(finalObj)),
        calculatedPortfolioFootprint
      )
    ),
    findAllSelector({ type: 'calculatedPortfolios' })
  )
}

// ------------------------------------
// Performance
// ------------------------------------
export const performanceSelector = R.prop('performance')

export const enabledGoalsSelector = R.compose(
  R.prop('enabledGoals'),
  performanceSelector
)

export const enabledReturnsSelector = R.compose(
  R.prop('enabledReturns'),
  performanceSelector
)

// ------------------------------------
// Transfer
// ------------------------------------
export const transferSelector = R.prop('transfer')
export const pendingPanelExpandedSelector = R.compose(
  R.prop('pendingPanelExpanded'),
  transferSelector
)

// ------------------------------------
// Activity
// ------------------------------------
export const activitySelector = R.prop('activity')

// ------------------------------------
// RetireSmartz
// ------------------------------------
export const retiresmartzSelector = state => {
  return R.merge(
    {
      partner: {
        email: '',
        password: '',
        isAuthenticated: undefined
      }
    },
    R.prop('retiresmartz', state)
  )
}

// ------------------------------------
// Data Loading Statuses
// ------------------------------------
export const checkDataStatusSelector = (status, ways, state) =>
  R.all(property => R.compose(
    R.prop(status),
    R.defaultTo({}),
    R.prop(property),
    R.path(['api', 'requests'])
  )(state))(ways)

// ------------------------------------
// SessionExpirationNotice visibility selector
// ------------------------------------
export const sessionModalVisibleSelector = R.compose(
  R.defaultTo(false),
  R.path(['modal', 'sessionExpirationNotice', 'show'])
)
