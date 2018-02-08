import React, { Component, PropTypes } from 'react'
import { Button, Col, ControlLabel, Form, FormControl, FormGroup }
  from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { reduxForm } from 'redux-form'
import Modal from 'react-bootstrap/lib/Modal'
import R from 'ramda'
import { connect } from 'redux/api'
import { getAutoTransactionEnabled, getMonthlyTransactionAmount,
  getMonthlyTransactiontDayOfMonth,
  serializeSettings } from 'routes/Allocation/helpers'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import FieldError from 'components/FieldError/FieldError'
import schema from 'schemas/autoTransaction'
import Switch from 'components/Switch/Switch'
import Tip from 'components/Tip/Tip'

const frequencies = [
  {
    label: 'Monthy',
    value: 'MONTHLY'
  },
  {
    label: 'Twice a month',
    value: 'TWICE_A_MONTH'
  },
  {
    label: 'Every Other Week',
    value: 'EVERY_OTHER_WEEK'
  },
  {
    label: 'Weekly',
    value: 'WEEKLY'
  }
]

const type = ({ isWithdraw }) => isWithdraw ? 'withdraw' : 'deposit'

const capitalizedType = R.compose(
  (str) => str.charAt(0).toUpperCase() + str.slice(1),
  type
)

const frequencyOptions = R.map(frequency => (
  <option key={frequency.value} value={frequency.value}>
    {frequency.label}
  </option>
), frequencies)

class AutoTransactionModal extends Component {
  static propTypes = {
    createSettings: PropTypes.func,
    fields: PropTypes.object,
    goal: PropTypes.object,
    handleHide: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    isWithdraw: PropTypes.bool,
    save: PropTypes.func,
    show: PropTypes.bool,
    values: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.save = this.save.bind(this)
  }

  save () {
    const { goal: { selected_settings }, handleHide, save, values } = this.props
    const pick = ['recurring_transactions']
    const body = serializeSettings({ settings: selected_settings, values }, pick)
    save({ body })
    handleHide()
  }

  render () {
    const { props } = this
    const { fields: { frequency, monthlyTransactionAmount,
      monthlyTransactionEnabled, monthlyTransactionDayOfMonth }, handleSubmit,
      handleHide, show } = props

    return (
      <Modal show={show} onHide={handleHide} aria-labelledby='ModalHeader'>
        <Modal.Header>
          <Modal.Title id='ModalHeader'>
            Auto {capitalizedType(props)} Settings
            <div className='pull-right'>
              <Switch {...monthlyTransactionEnabled} />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Form horizontal onSubmit={handleSubmit(this.save)}>
          <Modal.Body>
            {monthlyTransactionEnabled && monthlyTransactionEnabled.value
              ? <div>
                <FormGroup controlId='autoTransactionAmount'>
                  <Col componentClass={ControlLabel} xs={4}>
                    {capitalizedType(props)}
                  </Col>
                  <Col xs={8}>
                    <CurrencyInput placeholder='Enter an amount'
                      {...monthlyTransactionAmount} />
                    <FieldError for={monthlyTransactionAmount} />
                  </Col>
                </FormGroup>
                <FormGroup controlId='autoTransactionFrequency'>
                  <Col componentClass={ControlLabel} xs={4}>
                    Select frequency
                  </Col>
                  <Col xs={8}>
                    <FormControl componentClass='select' disabled
                      {...frequency}>
                      <option value=''>Select a frequency</option>
                      {frequencyOptions}
                    </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup controlId='autoTransactionDayOfMonth'>
                  <Col componentClass={ControlLabel} xs={4}>
                    Choose a day
                  </Col>
                  <Col xs={8}>
                    <FormControl type='text'
                      {...monthlyTransactionDayOfMonth} />
                    <FieldError for={monthlyTransactionDayOfMonth} />
                  </Col>
                </FormGroup>
              </div>
              : <div>
                <div>
                  Your automatic {type(props)} is currently off.
                </div>
                <Tip arrow>
                  Turning on automatic {type(props)} helps you reach your goal
                  faster, and also <a target='_blank'
                    href='http://support.betasmartz.com/customer/portal\
                    /articles/987453-how-and-when-is-my-portfolio-rebalanced-'>
                  rebalances your portfolio</a> in a tax effiecient way.
                </Tip>
              </div>}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleHide}>Cancel</Button>
            <Button type='submit' bsStyle='primary'>
              Set Auto {capitalizedType(props)}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

const requests = ({ goal, handleHide }) => ({
  save: ({ update }) => update({
    type: 'goals',
    url: `/goals/${goal && goal.id}/selected-settings`,
    deserialize: selectedSettings => R.merge(goal,
      { selected_settings: selectedSettings })
  })
})

export default R.compose(
  connectModal({ name: 'autoTransaction' }),
  reduxForm({
    form: 'autoTransaction',
    ...schema
  }, (state, { goal, isWithdraw }) => ({
    initialValues: goal && {
      frequency: 'MONTHLY',
      isWithdraw,
      monthlyTransactionAmount:
        getMonthlyTransactionAmount(goal.selected_settings, isWithdraw),
      monthlyTransactionEnabled:
        getAutoTransactionEnabled(goal.selected_settings, isWithdraw),
      monthlyTransactionDayOfMonth:
        getMonthlyTransactiontDayOfMonth(goal.selected_settings, isWithdraw)
    }
  })),
  connect(requests)
)(AutoTransactionModal)
