import buildSchema from 'redux-form-schema'

const schemaProperties = {
  'employment_status': {
    label: 'Employment Status',
    required: true
  },
  'occupation': {
    label: 'Occupation',
  },
  'employer': {
    label: 'Employer',
    required: true
  },
  'income': {
    label: 'Annual Income',
    required: true
  }
}

export default buildSchema(schemaProperties)
