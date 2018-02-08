import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { Col, Row } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import classNames from 'classnames'
import classes from './PositionListFooter.scss'

const getTotal = propName => R.compose(
  R.sum,
  R.map(R.prop(propName)),
  R.prop('positions')
)

const getTotalCurrentWeight = getTotal('currentWeight')

const getTotalTargetValue = getTotal('targetValue')

const getTotalCurrentValue = getTotal('value')

export default class PositionListFooter extends Component {
  static propTypes = {
    positions: PropTypes.array
  };

  render () {
    const { props } = this

    return (
      <div className={classes.positionListFooter}>
        <Row>
          <Col xs={4} className={classes.total}>Total</Col>
          <Col xs={6} className={classes.percentage}>
            <Row>
              <Col xs={2} className={classes.labels}>
                <div className={classes.smallText}>Target</div>
                <div className={classes.smallText}>Current</div>
              </Col>
              <Col xs={10} className={classes.values}>
                <div>
                  <FormattedNumber value={1} format='percent' />
                </div>
                <div>
                  <FormattedNumber value={getTotalCurrentWeight(props)}
                    format='percent' />
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={2} className={classNames(classes.amount, 'text-right')}>
            <div>
              <FormattedNumber value={getTotalTargetValue(props)}
                style='currency' currency='USD' />
            </div>
            <div>
              <FormattedNumber value={getTotalCurrentValue(props)}
                style='currency' currency='USD' />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
