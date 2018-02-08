import { connect } from 'redux/api'
import { reduxForm } from 'redux-form'
import R from 'ramda'
import FinancialProfile from '../components/FinancialProfile'
import financialProfileSchema from 'schemas/financialProfileSchema'

const requests =  ({ user }) => ({
  updateClient: user && (({ update }) => update({
    type: 'clients',
    id: user.client.id
  })),
})

const initialValuesFromUser = (user) => R.reduce(
  (initialValues, fieldName) => (
    R.merge(initialValues, {[fieldName]: R.defaultTo('', initialValues[fieldName])})
  ),
  R.pick(financialProfileSchema.fields, user ? user.client : {}),
  financialProfileSchema.fields
)

export default R.compose(
  connect(requests),
  reduxForm({
    form: 'financialProfileSettings',
    ...financialProfileSchema
  }, (state, props) => ({
    initialValues: initialValuesFromUser(props.user)
  }))
)(FinancialProfile)
