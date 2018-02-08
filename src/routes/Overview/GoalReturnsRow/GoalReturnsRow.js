import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalReturnsRow.scss'

export default class GoalReturnsRow extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['children'], this.props, nextProps)
  }

  render () {
    const { children } = this.props
    return (
      <Row className={classes.row}>
        <Col xs={8} className={classes.firstColumn}>
          {children[0]}
        </Col>
        <Col xs={4} className='text-right'>
          {children[1]}
        </Col>
      </Row>
    )
  }
}
