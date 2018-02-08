import React, { Component, PropTypes } from 'react'
import { Col, OverlayTrigger, Row } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import { Motion, spring } from 'react-motion'
import classes from './BulletChart.scss'
import Tooltip from 'components/Tooltip/Tooltip'

const targetWeightStyle = ({ position: { assetClass } }, width) => ({
  backgroundColor: assetClass.primary_color,
  width: `${width}%`
})

const currentWeightStyle = left => ({
  left: `${left}%`
})

export default class BulletChart extends Component {
  static propTypes = {
    position: PropTypes.object
  };

  render () {
    const { props } = this
    const { position: { currentWeight, id, usedWeight } } = props

    const tooltip = (
      <Tooltip id={`risk-poisition-item-${id}`}>
        <Row>
          <Col xs={4} className={classes.tooltipPercent}>
            <FormattedNumber value={usedWeight} format='percent' />
          </Col>
          <Col xs={8} className={classes.tooltipTitle}> Target Weight</Col>
        </Row>
        <Row>
          <Col xs={4} className={classes.tooltipPercent}>
            <FormattedNumber value={currentWeight} format='percent' />
          </Col>
          <Col xs={8} className={classes.tooltipTitle}> Current Weight</Col>
        </Row>
      </Tooltip>
    )

    return (
      <OverlayTrigger placement='right' overlay={tooltip}>
        <div>
          <Row>
            <Col xs={2} className={classes.labels}>
              <div className={classes.text}>Target</div>
              <div className={classes.text}>Current</div>
            </Col>
            <Col xs={10} className={classes.values}>
              <Motion defaultStyle={{ currentWeight: 0, usedWeight: 0 }}
                style={{ currentWeight: spring(currentWeight),
                  usedWeight: spring(usedWeight)}}>
                {({ currentWeight, usedWeight }) =>
                  <div className={classes.bulletChart}>
                    <div className={classes.targetWeight}
                      style={targetWeightStyle(props, usedWeight * 100)}>
                      <span className={classes.targetWeightValue}>
                        <FormattedNumber value={usedWeight}
                          format='percent' />
                      </span>
                    </div>
                    <div className={classes.currentWeight}
                      style={currentWeightStyle(currentWeight * 100)}>
                      <span className={classes.currentWeightValue}>
                        <FormattedNumber value={currentWeight}
                          format='percent' />
                      </span>
                    </div>
                  </div>}
              </Motion>
            </Col>
          </Row>
        </div>
      </OverlayTrigger>
    )
  }
}
