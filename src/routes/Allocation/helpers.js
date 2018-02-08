import moment from 'moment'
import R from 'ramda'
import RRule from 'rrule'
import { mapIndexed } from 'helpers/pureFunctions'
import { validateConstraint } from 'schemas/allocation'

// ------------------------------------
// Projection
// ------------------------------------
export const getPeriodDelta = ({ monthlyTransactionAmount = 0, monthlyFees = 0 }) =>
  monthlyTransactionAmount - monthlyFees

export const getNumberOfperiods = (startDate, { duration }) =>
  moment(getCompletion({ duration })).diff(startDate, 'months') + 1

export const getPortEr = ({ er }) => Math.pow(1 + er, 1 / 12)

export const getPortVol = ({ stdev }) => stdev / Math.sqrt(12)

export const seriesSum = (term, begin, end) => R.compose(
  R.sum,
  R.map(index => term(index)),
  R.range(begin)
)(end)

const pow = Math.pow
const sqrt = Math.sqrt

const defaultValueCalculator = ({ balance, delta, er, k, n, previousValue,
  stdev, zScore }) => R.equals(n, 0)
  ? balance
  : previousValue + pow(er, n) * (pow(er, k) - 1) * (balance + delta / (er - 1)) +
    zScore * stdev * balance * (sqrt(n + k) - sqrt(n)) +
    zScore * stdev * delta * seriesSum(m => sqrt(n + m), 0, k - 1)

const getProbabilisticReturns = R.curry((params, plot) => {
  const { balance, delta, er, indexes, startDate, stdev } = params
  const { zScore } = plot
  const finalValueCalculator = plot.valueCalculator || defaultValueCalculator
  const calculatorParams = { balance, delta, er, stdev, zScore }
  let value

  return {
    ...plot,
    values: R.compose(
      R.last,
      R.mapAccum(
        (previousValue, { n, k }) => {
          value = finalValueCalculator({ ...calculatorParams, k, n,
            previousValue })
          return [value, {
            x: moment(startDate).add(moment.duration(n, 'months')).valueOf(),
            y: value
          }]
        },
        balance
      )
    )(indexes)
  }
})

const difference = (plot, index, finalPlots) => {
  const { previousId, values } = plot
  const previousPlot = previousId && findPlotById(previousId)(finalPlots)
  const finalValues = previousPlot
    ? mapIndexed((value, valueIndex) =>
        R.assoc('y', value.y - previousPlot.values[valueIndex].y, value)
      , values)
    : values
  return R.assoc('values', finalValues, plot)
}

const findPlotById = R.compose(R.find, R.propEq('id'))

export const project = ({ values, plots, numberOfPoints = 48 }) => {
  const startDate = moment()
  const { balance } = values
  const delta = getPeriodDelta(values)
  const numberOfperiods = getNumberOfperiods(startDate, values)
  const er = getPortEr(values)
  const stdev = getPortVol(values)
  const beginIndex = 0

  const indexes = R.compose(
    R.last,
    R.mapAccum((acc, index) => ([
      index,
      {
        n: index,
        k: index - acc
      }
    ]), beginIndex),
    R.unless(
      R.compose(R.equals(numberOfperiods), R.last),
      R.append(numberOfperiods)
    ),
    R.map(R.head),
    R.splitEvery(Math.floor(numberOfperiods / numberOfPoints) || 1)
  )(R.range(beginIndex, numberOfperiods))

  return R.compose(
    mapIndexed(difference),
    R.map(
      getProbabilisticReturns({
        balance,
        delta,
        er,
        indexes,
        startDate,
        stdev
      })
    )
  )(plots)
}

// ------------------------------------
// Serialize/Deserialize
// ------------------------------------
export const allSettings = [
  { key: 'active_settings', label: 'Active settings' },
  { key: 'approved_settings', label: 'Approved settings' },
  { key: 'selected_settings', label: 'Selected settings' }
]

const getAvailableSettings = (goal = {}) => R.compose(
  R.reject(R.compose(R.isNil, R.prop('value'))),
  R.map((settings) => R.assoc('value', R.prop(settings.key, goal), settings)),
)(allSettings)

export const getUniqueSettings = R.compose(
  R.uniqBy(R.compose(
    R.ifElse(R.is(Object), R.prop('id'), R.identity),
    R.prop('value')
  )),
  getAvailableSettings
)

const recurringTransactions = (settings, { isWithdraw, monthlyTransactionAmount,
  monthlyTransactionEnabled, monthlyTransactionDayOfMonth }) => {
  const set = new RRule.RRuleSet()
  const rule = new RRule({
    freq: RRule.MONTHLY,
    bymonthday: monthlyTransactionDayOfMonth
  })
  set.rrule(rule)

  const amount = monthlyTransactionAmount
    ? parseFloat(monthlyTransactionAmount)
    : 0
  const finalAmount = isWithdraw ? -amount : amount

  return R.append({
    amount: finalAmount,
    schedule: set.valueOf()[0],
    enabled: monthlyTransactionEnabled
  }, getNotMonthlyTransactions(settings, isWithdraw))
}

export const getTransactions = R.compose(
  R.defaultTo([]),
  R.prop('recurring_transactions'),
  R.defaultTo({})
)

export const getCompletion = ({ duration }) =>
  moment().add(duration, 'months').format('YYYY-MM-DD')

export const getMetrics = R.compose(
  R.defaultTo([]),
  R.path(['metric_group', 'metrics'])
)

export const getConstraints = R.compose(
  R.filter(R.propEq('type', 0)),
  getMetrics
)

export const getValidConstraints = R.filter(
  R.compose(R.isEmpty, validateConstraint)
)

export const getAllocation = R.compose(
  R.defaultTo({}),
  R.find(R.propEq('type', 1)),
  getMetrics
)

export const getTarget = R.prop('target')

export const formatRisk = value => Math.round(value * 100) / 100

export const getRisk = R.compose(
  formatRisk,
  R.prop('configured_val'),
  getAllocation
)

export const getRebalance = R.prop('rebalance')

export const getRebalanceThreshold = R.compose(
  R.prop('rebalance_thr'),
  getAllocation
)

export const getDriftScore = R.prop('drift_score')

const isWithdrawTransaction = R.compose(
  R.gt(0),
  R.prop('amount')
)

export const getMonthlyTransactions = (settings, withdrawTransactions = false) =>
  R.compose(
    R.filter(R.compose(R.equals(withdrawTransactions), isWithdrawTransaction)),
    R.filter(transaction => {
      return RRule.rrulestr(transaction.schedule).options.freq === RRule.MONTHLY
    }),
    getTransactions
  )(settings)

const getNotMonthlyTransactions = (settings, withdrawTransactions = false) =>
  R.converge(R.without, [
    (settings) => getMonthlyTransactions(settings, withdrawTransactions),
    getTransactions
  ])(settings)

export const getMonthlyTransactionAmount = R.compose(
  (amount) => amount ? Math.abs(amount) : amount,
  R.prop('amount'),
  R.defaultTo({}),
  R.head,
  getMonthlyTransactions
)

export const getMonthlyTransactionRecurrence = R.compose(
  R.prop('schedule'),
  R.defaultTo({}),
  R.head,
  getMonthlyTransactions
)

export const getMonthlyTransactiontDayOfMonth = R.compose(
  R.defaultTo(1),
  ({ schedule }) =>
    schedule && RRule.rrulestr(schedule).options.bymonthday[0],
  R.defaultTo({}),
  R.head,
  getMonthlyTransactions
)

export const getAutoTransactionEnabled = R.compose(
  R.any(R.prop('enabled')),
  getMonthlyTransactions
)

export const getOneTimeDeposit = R.path(['invested', 'net_pending'])

export const getDuration = (settings, _in) => {
  const today = moment().format()
  const completion = settings.completion || moment().format()
  return moment(completion).diff(today, _in)
}

export const getHedgeFx = R.prop('hedge_fx')

export const prettyDuration = value => {
  const finalValue = value || 0
  const years = Math.floor(finalValue / 12)
  const months = value % 12
  let finalYears
  let finalMonths

  if (R.equals(years, 0)) {
    finalYears = null
  } else if (R.equals(years, 1)) {
    finalYears = `${years} year`
  } else {
    finalYears = `${years} years`
  }

  if (R.equals(months, 0)) {
    finalMonths = null
  } else if (R.equals(months, 1)) {
    finalMonths = `${months} month`
  } else {
    finalMonths = `${months} months`
  }

  return R.compose(
    R.when(R.isEmpty, R.always('0')),
    R.join(', '),
    R.reject(R.isNil)
  )([finalYears, finalMonths])
}

export const deserializeSettings = (settings) => ({
  constraints: getConstraints(settings),
  constraintsEnabled: true,
  duration: getDuration(settings, 'months'),
  durationEnabled: true,
  goalId: settings.goalId,
  hedgeFx: getHedgeFx(settings),
  hedgeFxEnabled: true,
  monthlyTransactionAmount: getMonthlyTransactionAmount(settings),
  monthlyTransactionDayOfMonth: getMonthlyTransactiontDayOfMonth(settings),
  monthlyDepositEnabled: true,
  oneTimeDepositEnabled: true,
  rebalance: getRebalance(settings),
  rebalanceEnabled: true,
  rebalanceThreshold: getRebalanceThreshold(settings),
  risk: getRisk(settings),
  riskEnabled: true
})

export const buildAllocationMetric = ({ settings, rebalanceThreshold, risk }) =>
  R.compose(
    R.assoc('rebalance_thr', rebalanceThreshold),
    R.assoc('configured_val', risk),
    getAllocation
  )(settings)

export const buildConstraintMetrics = ({ constraints, rebalanceThreshold }) =>
  R.map(metric => ({
    ...metric,
    type: 0,
    rebalance_type: 0,
    rebalance_thr: rebalanceThreshold
  }), getValidConstraints(constraints))

const serializeMetrics = (settings, { constraints, constraintsEnabled,
  rebalanceThreshold, risk, riskEnabled }) => {
  const allocationMetric = riskEnabled
    ? buildAllocationMetric({ settings, rebalanceThreshold, risk })
    : getAllocation(settings)

  const constraintMetrics = constraintsEnabled
    ? buildConstraintMetrics({ constraints, rebalanceThreshold })
    : getConstraints(settings)

  return R.prepend(allocationMetric, constraintMetrics)
}

export const serializeSettings = ({ settings, values }, pick) => {
  const finalPick = pick || ['completion', 'hedge_fx', 'metric_group',
    'rebalance', 'recurring_transactions', 'target']

  return R.pick(finalPick, {
    completion: getCompletion(values),
    event_memo: values.eventMemo,
    hedge_fx: values.hedgeFx,
    metric_group: {
      metrics: serializeMetrics(settings, values)
    },
    rebalance: values.rebalance,
    recurring_transactions: recurringTransactions(settings, values),
    target: getTarget(settings)
  })
}
