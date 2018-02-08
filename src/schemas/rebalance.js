import buildSchema from 'redux-form-schema'

export const thresholdOptions = [0.03, 0.05, 0.1]

export default buildSchema({
  rebalance: {
    label: 'Rebalance',
    type: 'boolean',
    required: true
  },
  rebalance_thr: {
    label: 'Threshold',
    required: true,
    validate: {
      in: thresholdOptions
    }
  }
})
