import buildSchema from 'redux-form-schema'
import R from 'ramda'

export const rebalanceThresholdOptions = [0.03, 0.05, 0.1]

const schema = buildSchema({
  goalId: {
    label: 'Goal ID',
    required: true
  },
  monthlyTransactionAmount: {
    label: 'Monthly Auto-Deposit'
  },
  risk: {
    label: 'Risk Appetite',
    required: true
  },
  'constraints[].id': {
    label: 'ID'
  },
  'constraints[].comparison': {
    label: 'Comparison'
  },
  'constraints[].feature': {
    label: 'Feature'
  },
  'constraints[].configured_val': {
    label: 'Value'
  },
  eventMemo: {
    label: 'Memo'
  },
  'hedgeFx': {
    label: 'Hedge FX Exposure'
  },
  monthlyTransactionDayOfMonth: {
    label: 'Day'
  },
  duration: {
    label: 'Duration',
    required: true
  },
  rebalance: {
    label: 'Rebalance',
    type: 'boolean',
    required: true
  },
  rebalanceThreshold: {
    label: 'Threshold',
    required: true,
    validate: {
      in: rebalanceThresholdOptions
    }
  },
  riskEnabled: {
    label: 'Change Risk'
  },
  rebalanceEnabled: {
    label: 'Change Rebalancing'
  },
  hedgeFxEnabled: {
    label: 'Change Hedge FX Exposure'
  },
  constraintsEnabled: {
    label: 'Change Constraints'
  },
  monthlyDepositEnabled: {
    label: 'Change Monthly Deposit'
  },
  oneTimeDepositEnabled: {
    label: 'One-time deposit'
  },
  durationEnabled: {
    label: 'Time'
  }
})

// redux-form-schema does not work with array fields,
// therefore validating constraints[] manually.
export const validateConstraint = constraint => {
  const errors = {}
  if (R.isNil(constraint.comparison)) {
    errors.comparison = 'Required'
  }
  if (R.isNil(constraint.feature) && constraint.type !== 1) {
    errors.feature = 'Required'
  }
  if (R.isNil(constraint.configured_val)) {
    errors.configured_val = 'Required'
  }
  return errors
}

const validate = values => {
  const constraints = R.compose(
    R.reject(R.isEmpty),
    R.map(validateConstraint)
  )(values.constraints)
  return R.compose(
    R.reject(R.either(R.isEmpty, R.isNil)),
    R.merge(schema.validate(values))
  )({ constraints })
}

export default R.merge(schema, { validate })
