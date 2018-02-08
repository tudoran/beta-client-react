import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'redux/api'
import { reduxForm } from 'redux-form'
import R from 'ramda'
import { goTo } from 'redux/modules/router'
import { show } from 'redux-modal'
import classes from './SetupGoal.scss'
import createSchema from 'schemas/createGoal'
import SetupGoal from './SetupGoal'

class NewGoal extends Component {
  static propTypes = {
    goTo: PropTypes.func,
    params: PropTypes.object,
    show: PropTypes.func
  };

  render () {
    return (
      <SetupGoal {...this.props}>
        <div className={classes['next-step-text']}>
          On the next screen, we'll give you advice on how to achieve your goal.
        </div>
        <div className={classes['next-step-btn']}>
          <Button bsStyle='primary' type='submit' block>Next</Button>
        </div>
      </SetupGoal>
    )
  }
}

const schema = createSchema()

const requests = ({ params: { accountId, clientId }, goTo, show }) => ({
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  }),
  goalTypes: ({ findAll }) =>
    findAll({ type: 'goalTypes', url: '/goals/types' }),
  save: ({ create }) => create({
    type: 'goals',
    success: ({ value }) => {
      goTo(`/${clientId}/account/${accountId}/goal/${value.id}/allocation`)
      show('createGoalSuccess')
    }
  })
})

export default R.compose(
  connect(requests, null, { goTo, show }),
  reduxForm({
    form: 'createGoal',
    ...schema
  })
)(NewGoal)
