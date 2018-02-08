import R from 'ramda'

/** Holdings **************************/

export const holdingName = R.pathOr('', ['assetClass', 'display_name'])

export const sortHoldings = R.sortBy(
  R.compose(R.toLower, holdingName)
)

const allocatedValue = R.compose(
  R.sum,
  R.pluck('value')
)

const allocatedPercent = R.compose(
  R.sum,
  R.pluck('percent')
)

export const unallocatedForGoal = ({ balance = 0 } = {}, holdings) => ({
  assetClass: { display_name: 'Unallocated Funds' },
  value: balance - allocatedValue(holdings),
  percent: 100 - allocatedPercent(holdings)
})
