import React, { Component } from 'react'
import Row from 'react-bootstrap/lib/Row'
import { OverlayTrigger, Col } from 'react-bootstrap'
import Tooltip from 'components/Tooltip/Tooltip'
import { MdHelp } from 'helpers/icons'
import classes from './PositionListHeader.scss'

const tooltipTitle = (
  <Tooltip id='currentWeightTooltip'>
    This table shows how much you currently hold in each asset class.
    Expand the asset classes for more detail and see the exact ETFs and shares you own.
  </Tooltip>
)

export default class PositionListHeader extends Component {
  render () {
    return (
      <Row className={classes.positionListHeader}>
        <Col xs={4} className={classes.holding}>
          Holdings
        </Col>
        <Col xs={6} className={classes.weight}>
          Weight
          <OverlayTrigger placement='top' overlay={tooltipTitle}>
            <span className={classes['tooltip']}>
              <MdHelp size='18' />
            </span>
          </OverlayTrigger>
        </Col>
        <Col xs={2} className={classes.value}>
          <span className={classes.valueContent}>Value</span>
        </Col>
      </Row>
    )
  }
}
