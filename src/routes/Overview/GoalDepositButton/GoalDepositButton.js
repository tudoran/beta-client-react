import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalDepositButton.scss'

export default class GoalDepositButton extends Component {
  static propTypes = {
    goalId: PropTypes.number
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goalId'], this.props, nextProps)
  }

  render () {
    const { goalId } = this.props
    const { accountId, clientId } = this.context

    return (
      <Link to={`/${clientId}/account/${accountId}/goal/${goalId}/transfer`}
        className={classNames('btn', 'btn-xs', classes.btnDeposit)}>
        Deposit
      </Link>
    )
  }
}
