import { connect } from 'redux/api'
import { connectModal } from 'redux-modal'
import { reduxForm } from 'redux-form'
import R from 'ramda'
import ChangePasswordModal from '../components/ChangePasswordModal'
import changePasswordSchema from 'schemas/changePasswordSchema'

const requests = () => ({
  changePassword: ({ create }) => create({
    type: 'changePassword',
    url: '/me/password/'
  })
})

export default R.compose(
  connect(requests),
  reduxForm({
    form: 'changePassword',
    ...changePasswordSchema
  }, (state, props) => ({
    initialValues: {
      question: R.defaultTo('', R.path(['question'], props.securityQuestion))
    }
  })),
  connectModal({ name: 'changePasswordModal' }),
)(ChangePasswordModal)
