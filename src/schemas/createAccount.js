import R from 'ramda'
import buildSchema from 'redux-form-schema'

const schemaProperties = {
  selectedAccountType: {
    label: 'Account Type',
    required: true
  },
  name: {
    label: 'Name',
    required: true
  }
}

const getNameErrors = R.compose(
  R.defaultTo([]),
  R.prop('name')
)

export default () => {
  const schema = buildSchema(schemaProperties)

  const validate = (values, props) => {
    const { accounts } = props
    const names = R.map(R.prop('account_name'), accounts || [])
    const schemaValidation = schema.validate(values, props)
    const nameErrors = getNameErrors(schemaValidation)
    const finalNameErrors = R.contains(values.name, names)
      ? R.append('This account name already exists', nameErrors)
      : nameErrors

    return R.merge(schemaValidation, { name: finalNameErrors })
  }

  return R.merge(schema, { validate })
}
