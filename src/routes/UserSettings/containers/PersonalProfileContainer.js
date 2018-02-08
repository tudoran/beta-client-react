import { connect } from 'redux/api'
import { reduxForm } from 'redux-form'
import R from 'ramda'
import PersonalProfile from '../components/PersonalProfile'
import personalProfileSchema from 'schemas/personalProfileSchema'

const requests =  ({ user }) => ({
  updateUser: ({ update }) => update({
    type: 'me',
    url: '/me'
  }),
  updateClient: user && (({ update }) => update({
    type: 'clients',
    id: user.client.id
  }))
})

const addressFields = (user) => {
  if (user) {
    const residentialAddress = R.path(['client', 'residential_address'], user)
    const addressArray = R.split('\n', residentialAddress.address)
    return {
      address1: R.defaultTo('', addressArray[0]),
      address2: R.defaultTo('', addressArray[1]),
      city: R.defaultTo('', addressArray[2]),
      post_code: residentialAddress.post_code,
      state: R.path(['region', 'name'], residentialAddress),
      country: R.path(['region', 'country'], residentialAddress)
    }
  } else {
    return {}
  }
}

const initialValuesFromUser = (user) => R.reduce(
  (initialValues, fieldName) => (
    R.merge(initialValues, {[fieldName]: R.defaultTo('', initialValues[fieldName])})
  ),
  R.pick(
    personalProfileSchema.fields,
    (user ? R.mergeAll([user, user.client, addressFields(user)]) : {})
  ),
  personalProfileSchema.fields
)

export default R.compose(
  connect(requests),
  reduxForm({
    form: 'userProfileSettings',
    ...personalProfileSchema
  }, (state, props) => ({
    initialValues: initialValuesFromUser(props.user)
  }))
)(PersonalProfile)
