import React, { Component, PropTypes } from 'react'
import { Col, MenuItem, Row } from 'react-bootstrap'
import { goTo } from 'redux/modules/router'
import { show } from 'redux-modal'
import R from 'ramda'
import { connect } from 'redux/api'
import GoalNavigation from 'components/GoalNavigation'

export class RetireSmartz extends Component {
  static propTypes = {
    goals: PropTypes.array.isRequired,
    goTo: PropTypes.func.isRequired,
    children: PropTypes.object,
    params: PropTypes.object.isRequired,
    show: PropTypes.func.isRequired
  };

  render () {
    const { goals, goTo, children, params: { accountId, clientId }, show } = this.props

    return (
      <div className='container'>
        <div className='panel'>
          <div className='panel-heading'>
            <Row>
              <Col xs={3}>
                <GoalNavigation goals={goals} label='RetireSmartz' onSelect={function (goal) {
                  goTo(`/${clientId}/account/${accountId}/goal/${goal.id}/portfolio`)
                }}>
                  <MenuItem key='retiresmartz' onClick={function () {
                      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup`)
                  }}>
                    RetireSmartz
                  </MenuItem>
                  <MenuItem key='addGoal' onClick={function () {
                    show('createGoal', { saveButtonLabel: 'Add Goal' })
                  }}>
                    Add Goal
                  </MenuItem>
                </GoalNavigation>
              </Col>
            </Row>
          </div>
          {children}
        </div>
      </div>
    )
  }
}

const requests = ({ goal, params, params: { accountId, goalId, viewedSettings } }) => ({
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  })
})

const actions = {
  goTo,
  show
}

export default R.compose(
  connect(requests, null, actions)
)(RetireSmartz)
