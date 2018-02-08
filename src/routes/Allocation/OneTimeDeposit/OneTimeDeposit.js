import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Form, InputGroup } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import { reduxForm } from 'redux-form'
import { show } from 'redux-modal'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'
import Button from 'components/Button/Button'
import ConfirmDepositModal
  from 'containers/ConfirmDepositModal/ConfirmDepositModal'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import InputField from '../InputField/InputField'
import schema from 'schemas/oneTimeDeposit'

const input = ({ fields: { amount }, values: { amount: amountValue } }) => // eslint-disable-line react/prop-types
  <InputGroup>
    <CurrencyInput {...amount} />
    <InputGroup.Button>
      <Button bsStyle='primary' type='submit' disabled={!R.gt(amountValue, 0)}>
        Deposit
      </Button>
    </InputGroup.Button>
  </InputGroup>

const getPendingDeposit = R.compose(
  R.when(R.gt(0), R.always(0)),
  R.defaultTo(0),
  R.path(['goal', 'invested', 'net_pending'])
)

class OneTimeDeposit extends Component {
  static propTypes = {
    fields: PropTypes.object,
    goal: PropTypes.object,
    handleSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    show: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['fields', 'goal'], this.props, nextProps)
  }

  render () {
    const { props } = this
    const { fields: { amount }, goal, handleSubmit, resetForm, show } = props
    const savedOneTimeDeposit = getPendingDeposit(props)

    return (
      <Form inline onSubmit={handleSubmit(({ amount }) =>
          show('confirmDeposit', { amount, resetForm }))}>
        <InputField
          field={amount}
          label='One-time Deposit'
          input={input(props)}
          helpText={(<span><FormattedNumber value={savedOneTimeDeposit}
            format='currency' /> pending</span>)}
        />
        <ConfirmDepositModal goal={goal} />
      </Form>
    )
  }
}

const actions = {
  show
}

export default R.compose(
  connect(null, actions),
  reduxForm({
    form: 'oneTimeDeposit',
    ...schema
  })
)(OneTimeDeposit)
