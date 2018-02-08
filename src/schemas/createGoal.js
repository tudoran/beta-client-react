import R from 'ramda'
import buildSchema from 'redux-form-schema'

const notGrowWealth = R.compose(
  R.not,
  R.equals('Grow Wealth'),
  R.path(['selectedGoalType', 'name'])
)

const schemaProperties = {
  selectedGoalType: {
    label: 'Goal Type',
    required: true
  },
  name: {
    label: 'Name',
    required: true
  },
  ethicalInvestments: {
    label: 'Ethical Investments',
    type: 'boolean'
  },
  amount: {
    label: 'Amount',
    required: notGrowWealth,
    validate: {
      float: {
        min: 0
      }
    }
  },
  duration: {
    label: 'Duration',
    required: notGrowWealth,
    validate: {
      float: {
        min: 0
      }
    }
  },
  initialDeposit: {
    label: 'Initial Deposit',
    validate: {
      float: {
        min: 0
      }
    }
  }
}

const getNameErrors = R.compose(
  R.defaultTo([]),
  R.prop('name')
)

export default propNames => {
  const schema = buildSchema(
    propNames ? R.pick(propNames, schemaProperties) : schemaProperties
  )

  // It's on the to_do list: https://github.com/Lighthouse-io/redux-form-schema#todo
  // until then ...
  const initialValues = {
    ethicalInvestments: false
  }

  const validate = (values, props) => {
    const { goals } = props
    const names = R.map(R.prop('name'), goals || [])
    const schemaValidation = schema.validate(values, props)
    const nameErrors = getNameErrors(schemaValidation)
    const finalNameErrors = R.contains(values.name, names)
      ? R.append('This goal name already exists', nameErrors)
      : nameErrors

    return R.merge(schemaValidation, { name: finalNameErrors })
  }

  return R.merge(schema, { initialValues, validate })
}
