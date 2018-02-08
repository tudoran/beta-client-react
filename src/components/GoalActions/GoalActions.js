import React, { Component, PropTypes } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router'
import { MdSettings } from 'helpers/icons'
import classNames from 'classnames'
import R from 'ramda'
import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalActions.scss'

const renderClient = ({ active, editName, editTarget, goal, show,
  showEditNameAction }, { accountId, clientId }) => active ? (
    <DropdownButton noCaret pullRight title={<MdSettings size={24} />}
      id={`goalActions-${goal.id}`}
      className={classNames(classes['btn-goalaction'], 'btn-circle')}>
      {showEditNameAction &&
        <MenuItem onClick={editName}>Change goal name</MenuItem>}
      <MenuItem onClick={editTarget}>Change goal target</MenuItem>
      <li>
        <Link
          to={`/${clientId}/account/${accountId}/goal/${goal.id}/update-goal`}>
          Change goal type
        </Link>
      </li>
      <li><Link
        to={`/${clientId}/account/${accountId}/goal/${goal.id}/allocation`}
        role='menuItem'>Change allocation</Link></li>
      <li>
        <Link
          to={`/${clientId}/account/${accountId}/goal/${goal.id}/transfer`}>
          Deposit/withdraw
        </Link>
      </li>
      <MenuItem onClick={function () { show('autoTransaction', { goal }) }}>
        Auto deposit settings
      </MenuItem>
      <MenuItem onClick={function () { show('confirmDeleteGoal', { goal }) }}>
        Delete goal
      </MenuItem>
    </DropdownButton>
  ) : false

renderClient.propTypes = {
  active: PropTypes.bool,
  editName: PropTypes.func,
  editTarget: PropTypes.func,
  goal: PropTypes.object,
  show: PropTypes.func,
  showEditNameAction: PropTypes.bool,
  accountId: PropTypes.string,
  clientId: PropTypes.string
}

const renderAdvisor = ({ goal, reactivateGoal, show }) =>
  <DropdownButton noCaret pullRight title={<MdSettings size={24} />}
    id={`goalActions-${goal.id}`}
    className={classNames(classes['btn-goalaction'], 'btn-circle')}>
    <MenuItem onClick={function () { show('confirmDeleteGoal', { goal }) }}>
      Delete goal
    </MenuItem>
    <MenuItem onClick={function () { reactivateGoal({ body: { state: 0 } }) }}>
      Reactivate goal
    </MenuItem>
  </DropdownButton>

renderAdvisor.propTypes = {
  goal: PropTypes.object,
  reactivateGoal: PropTypes.func,
  show: PropTypes.func
}

class GoalActions extends Component {
  static propTypes = {
    editName: PropTypes.func,
    editTarget: PropTypes.func,
    goal: PropTypes.object,
    reactivateGoal: PropTypes.func,
    show: PropTypes.func,
    showEditNameAction: PropTypes.bool,
    user: PropTypes.object
  };

  static defaultProps = {
    showEditNameAction: true
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goal'], this.props, nextProps)
  }

  render () {
    const { context, props } = this
    const { goal, user } = props
    const active = R.equals(goal && goal.state, 0)
    const finalProps = R.merge(props, { active })
    return (user && user.role === 'client') || active
      ? renderClient(finalProps, context)
      : renderAdvisor(finalProps, context)
  }
}

const requests = ({ goal, goal: { id } }) => ({
  reactivateGoal: ({ update }) => update({
    type: 'goals',
    id
  }),
  user: getProfile
})

export default connect(requests)(GoalActions)
