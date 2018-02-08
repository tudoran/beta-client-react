import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { show } from 'redux-modal'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './OneTimeDeposit.scss'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import FieldError from 'components/FieldError/FieldError'
import schema from 'schemas/multiGoalOneTimeDeposit'

class OneTimeDeposit extends Component {
  static propTypes = {
    destroyForm: PropTypes.func,
    fields: PropTypes.object,
    goals: PropTypes.array,
    hide: PropTypes.func,
    handleSubmit: PropTypes.func,
    resetForm: PropTypes.func,
    show: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['fields', 'goals'], this.props, nextProps)
  }

  get selectedGoal () {
    const { goals, fields: { goalId } } = this.props
    return goalId.value &&
      R.find(R.propEq('id', parseInt(goalId.value, 10)), goals)
  }

  render () {
    const { fields: { amount, goalId }, goals, handleSubmit, resetForm,
      show } = this.props
    const options = R.map(goal => (
      <option key={goal.id} value={goal.id}>{goal.name}</option>
    ), goals)
    const selectedGoal = this.selectedGoal
    const amountProps = R.pick(['onBlur', 'onChange', 'onFocus', 'value'],
      amount)
    const goalIdProps = R.pick(['onBlur', 'onChange', 'onFocus', 'value'],
      goalId)

    return (
      <form onSubmit={handleSubmit(({ amount }) =>
        show('confirmDeposit', { amount, goal: selectedGoal, resetForm }))}
        className={classes['deposit-form']}>
        <FormGroup controlId='oneTimeDepositAmount'
          className={classes['deposit-group']}>
          <ControlLabel className={classes['deposit-label']}>
            Deposit
          </ControlLabel>
          <div className={classes['deposit-input']}>
            <CurrencyInput name='amount' min='0' placeholder='Enter amount'
              {...amountProps} />
            <FieldError for={amount} />
          </div>
        </FormGroup>
        <FormGroup controlId='oneTimeDepositGoal'
          className={classes['deposit-group']}>
          <ControlLabel className={classes['deposit-label']}>
            To your goal
          </ControlLabel>
          <FormControl componentClass='select' {...goalIdProps}>
            <option value=''>Select a goal</option>
            {options}
          </FormControl>
          <FieldError for={goalId} />
        </FormGroup>
        <FormGroup controlId='oneTimeDepositSubmit'
          className={classes['deposit-group']}>
          <Button type='submit' bsStyle='danger' block>
            Deposit
          </Button>
        </FormGroup>
      </form>
    )
  }
}

export default R.compose(
  reduxForm({
    form: 'multiGoalOneTimeDeposit',
    ...schema
  }, () => ({
    initialValues: {
      amount: 0
    }
  })),
  connect(null, { show })
)(OneTimeDeposit)
