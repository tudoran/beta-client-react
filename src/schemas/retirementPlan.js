import buildSchema from 'redux-form-schema'

export default buildSchema({
  name: {
    label: 'Name',
    required: true,
    error: 'Retirement plan name is required.'
  },
  description: {
    label: 'Description',
    required: false
  }
})
