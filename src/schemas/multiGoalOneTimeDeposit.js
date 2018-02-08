import buildSchema from 'redux-form-schema'
import R from 'ramda'

export default buildSchema({
  amount: {
    label: 'Amount',
    required: true,
    validate: {
      validAmount: (values, fieldValue) =>
        (R.is(Number, fieldValue) && fieldValue > 0)
    },
    error: 'Amount should be greater than $0.00'
  },
  goalId: {
    label: 'Goal',
    required: true
  }
})
