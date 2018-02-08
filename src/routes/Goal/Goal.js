import React, { Component, PropTypes } from 'react'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import R from 'ramda'
import CreateGoalModal from 'containers/CreateGoalModal/CreateGoalModal'

class Goal extends Component {
  static propTypes = {
    assetsClasses: PropTypes.array,
    children: PropTypes.object,
    goal: PropTypes.object,
    goals: PropTypes.array,
    goTo: PropTypes.func,
    positions: PropTypes.array,
    selectedPortfolio: PropTypes.object,
    tickers: PropTypes.array
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  componentWillMount () {
    super.componentWillMount && super.componentWillMount()
    this.maybeRedirect()
  }

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps && super.componentWillReceiveProps(nextProps)
    this.maybeRedirect(nextProps)
  }

  maybeRedirect (props = this.props) {
    const { goal, goTo } = props
    const { accountId, clientId } = this.context

    if (goal && !R.equals(goal.state, 0)) {
      goTo(`/${clientId}/account/${accountId}`)
    }
  }

  render () {
    const { children } = this.props
    return (
      <div>
        {children}
        <CreateGoalModal />
      </div>
    )
  }
}

const requests = ({ routeParams: { goalId } }) => ({
  goal: ({ findOne }) => findOne({ type: 'goals', id: goalId })
})

const actions = {
  goTo
}

export default connect(requests, null, actions)(Goal)
