import React, { Component, PropTypes } from 'react'
import { Col, Collapse, Row } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import { Link } from 'react-router'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalAllocation.scss'
import Hr from '../Hr/Hr'

export default class GoalAllocation extends Component {
  static propTypes = {
    bondsBalance: PropTypes.number,
    expanded: PropTypes.bool,
    goalId: PropTypes.number,
    stocksBalance: PropTypes.number
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['bondsBalance', 'expanded', 'goalId', 'stocksBalance'],
      this.props, nextProps)
  }

  render () {
    const { bondsBalance, expanded, goalId, stocksBalance } = this.props
    const { accountId, clientId } = this.context

    return (
      <Collapse in={expanded}>
        <div>
          <Row className={classes.row}>
            <Col xs={6}>Basket</Col>
            <Col xs={6} className='text-right'>
              <strong>Balance</strong>
            </Col>
          </Row>
          <Hr />
          <Row className={classes.row}>
            <Col xs={6}>Bonds</Col>
            <Col xs={6} className='text-right'>
              <strong>
                <FormattedNumber value={bondsBalance} format='currency' />
              </strong>
            </Col>
          </Row>
          <Row className={classes.row}>
            <Col xs={6}>Stocks</Col>
            <Col xs={6} className='text-right'>
              <strong>
                <FormattedNumber value={stocksBalance} format='currency' />
              </strong>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Link
                to={`/${clientId}/account/${accountId}/goal/${goalId}/allocation`}>
                <strong>Change Allocation</strong>
              </Link>
            </Col>
            <Col xs={6} className='text-right'>
              <Link
                to={`/${clientId}/account/${accountId}/goal/${goalId}/portfolio`}>
                <strong>Portfolio details</strong>
              </Link>
            </Col>
          </Row>
        </div>
      </Collapse>
    )
  }
}
