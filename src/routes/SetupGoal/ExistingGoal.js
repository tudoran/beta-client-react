import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'redux/api'
import { Link } from 'react-router'
import { reduxForm } from 'redux-form'
import moment from 'moment'
import R from 'ramda'
import { goTo } from 'redux/modules/router'
import { show } from 'redux-modal'
import createSchema from 'schemas/createGoal'
import SetupGoal from './SetupGoal'
import classes from './SetupGoal.scss'

class ExistingGoal extends Component {
  static contextTypes = {
    clientId: PropTypes.string
  };

  render () {
    const { clientId } = this.context

    return (
      <SetupGoal {...this.props}>
        <div className={classes['next-step-btn']}>
          <Button bsStyle='primary' type='submit' block>Update</Button>
        </div>
        <div className={classes['next-step-btn']}>
          <Link to={`/${clientId}`} className='btn btn-default'>Cancel</Link>
        </div>
      </SetupGoal>
    )
  }
}

const schema = createSchema()

const requests = ({ goTo, params: { accountId, clientId, goalId } }) => {
  const requests = {
    goals: ({ findQuery }) => findQuery({
      type: 'goals',
      url: `/accounts/${accountId}/goals`,
      query: {
        account: parseInt(accountId, 10)
      }
    }),
    goalTypes: ({ findAll }) => findAll({
      type: 'goalTypes',
      url: '/goals/types'
    })
  }

  if (goalId) {
    requests.goal = ({ findOne }) => findOne({
      type: 'goals',
      id: goalId
    })
    requests.save = ({ update }) => update({
      type: 'goals',
      id: goalId,
      success: ({ value }) =>
        goTo(`/${clientId}/account/${accountId}/goal/${goalId}/activity`)
    })
  }

  return requests
}

export default R.compose(
  connect(requests, null, { goTo, show }),
  reduxForm({
    form: 'updateGoal',
    ...schema
  }, (state, { goal, goalTypes }) => {
    return {
      initialValues: goal && {
        amount: goal.selected_settings.target,
        duration: moment(goal.selected_settings.completion)
          .diff(moment(), 'years'),
        initialDeposit: goal.balance,
        name: goal.name,
        selectedGoalType: R.find(R.propEq('id', goal.type), goalTypes)
      }
    }
  })
)(ExistingGoal)
