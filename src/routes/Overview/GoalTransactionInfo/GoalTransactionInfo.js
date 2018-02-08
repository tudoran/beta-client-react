import React, { Component, PropTypes } from 'react'
import { Col, OverlayTrigger, Row } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import { MdRefresh } from 'helpers/icons'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalTransactionInfo.scss'

const overlayInner = ({ date, enabled, label }) =>
  <div className={classes.inlineBlock}>
    <span className={classes.iconLeft}>
      <MdRefresh size='18' />
    </span>
    <span className={classes.inlineBlock}>
      {enabled
        ? <span>
          {label} on&nbsp;
          {date}
        </span>
        : <span>{label} off</span>}
    </span>
  </div>

overlayInner.propTypes = {
  date: PropTypes.element,
  enabled: PropTypes.bool,
  label: PropTypes.string
}

export default class GoalTransactionInfo extends Component {
  static propTypes = {
    amount: PropTypes.number,
    date: PropTypes.element,
    enabled: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    tooltip: PropTypes.node
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['amount', 'date', 'enabled', 'label', 'tooltip'],
      this.props, nextProps)
  }

  render () {
    const { amount, date, enabled, label, onClick, tooltip } = this.props

    return (
      <Row className={classes.transactionInfo} onClick={onClick}>
        <Col xs={8} className={enabled ? classes.on : classes.off}>
          {tooltip
            ? <OverlayTrigger placement='top'
              overlay={tooltip}>
              {overlayInner({ date, enabled, label })}
            </OverlayTrigger>
            : <div>
              {overlayInner({ date, enabled, label })}
            </div>
          }
        </Col>
        {enabled && amount &&
          <Col xs={4} className={classes.amount}>
            <FormattedNumber value={amount} format='currency' />
          </Col>}
      </Row>
    )
  }
}
