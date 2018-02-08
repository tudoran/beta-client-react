import buildSchema from 'redux-form-schema'
import R from 'ramda'

export default buildSchema({
  monthlyTransactionAmount: {
    label: 'Amount',
    required: values => values.monthlyTransactionEnabled,
    validate: {
      validAmount: (values, fieldValue) =>
        !values.monthlyTransactionEnabled ||
        (R.is(Number, fieldValue) && fieldValue > 0)
    },
    error: 'Amount should be greater than $0.00'
  },
  monthlyTransactionEnabled: {
    label: 'Automatic Deposit',
    required: true
  },
  monthlyTransactionDayOfMonth: {
    label: 'Day',
    required: values => values.monthlyTransactionEnabled
  },
  frequency: {
    label: 'Frequency',
    required: values => values.monthlyTransactionEnabled
  },
  isWithdraw: {
    label: 'Deposit/Withdraw'
  }
})
