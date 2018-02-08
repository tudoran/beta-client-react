import React, { Component, PropTypes } from 'react'
import { Col, OverlayTrigger, Row } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import { MdHelp } from 'helpers/icons'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalReturnsFooterRow.scss'

export default class GoalReturnsFooterRow extends Component {
  static propTypes = {
    title: PropTypes.string,
    tooltip: PropTypes.element,
    value: PropTypes.number
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['title', 'tooltip', 'value'], this.props, nextProps)
  }

  render () {
    const { title, tooltip, value } = this.props

    return (
      <Row className={classes.row}>
        <Col xs={8}>
          {title}
          <OverlayTrigger placement='right' overlay={tooltip}>
            <span className={classes.tooltip}>
              <MdHelp size='18' />
            </span>
          </OverlayTrigger>
        </Col>
        <Col xs={4} className='text-right'>
          <FormattedNumber value={value} format='percent' />
        </Col>
      </Row>
    )
  }
}
