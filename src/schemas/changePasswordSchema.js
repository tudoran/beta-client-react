import buildSchema from 'redux-form-schema'

const schemaProperties = {
  'old_password': {
    label: 'Old Password',
    required: true
  },
  'new_password': {
    label: 'New Password',
    required: true
  },
  'question': {
    label: 'Question',
    required: true
  },
  'answer': {
    label: 'Answer',
    required: true
  }
}

export default buildSchema(schemaProperties)
