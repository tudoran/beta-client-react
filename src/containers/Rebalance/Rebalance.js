import React, { Component, PropTypes } from 'react'
import { MdHelp } from 'helpers/icons'
import { Col, OverlayTrigger, Row } from 'react-bootstrap'
import classNames from 'classnames'
import R from 'ramda'
import './Select.scss'
import { propsChanged } from 'helpers/pureFunctions'
import { thresholdOptions } from 'schemas/rebalance'
import classes from './Rebalance.scss'
import Select from 'components/Select/Select'
import Switch from 'components/Switch/Switch'
import Tooltip from 'components/Tooltip/Tooltip'

const driftStates = [
  {
    maxValue: 0.1,
    label: 'Normal',
    className: 'text-success'
  },
  {
    maxValue: 1,
    label: 'High',
    className: 'text-danger'
  }
]

const tooltipTitleDrift = (
  <Tooltip id='tooltipTitleDrift'>
    Drift of your portfolio is the total amount that your current weight
    differs from your target weight for each asset class in this goal.
    Drift from your target allocation occurs with normal market movements
    and transactions that avoid short-term capital gains.
  </Tooltip>
)

const getDriftState = ({ driftScore }) => R.find(
  driftState => R.lte(driftScore, driftState.maxValue),
  driftStates
)

const getThresholdOptions = formatNumber => (
  R.map((value) => ({
    value: value,
    label: formatNumber(value, { format: 'percent' })
  }), thresholdOptions)
)

export default class Rebalance extends Component {
  static propTypes = {
    driftScore: PropTypes.number,
    fields: PropTypes.object,
    values: PropTypes.object,
    viewOnly: PropTypes.bool
  };

  static defaultProps = {
    fields: {},
    values: {}
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['fields', 'values'], this.props, nextProps)
  }

  render () {
    const { props } = this
    const { driftScore, fields: { rebalance, rebalanceThreshold }, values,
      viewOnly } = props
    const { intl: { formatNumber } } = this.context
    const driftState = getDriftState(props)
    const thresholdOptions = getThresholdOptions(formatNumber)

    return (
      <form className={classes.rebalancing}>
        <Row className={classes.titleWrapper}>
          <Col md={8} sm={12} xs={9} className={classes.title}>
            Rebalancing
          </Col>
          <Col md={4} sm={12} xs={3} className={classes.status}>
            {viewOnly
              ? <span>{values.rebalance ? 'ON' : 'OFF'}</span>
              : <Switch {...rebalance} />}
          </Col>
        </Row>
        <Row className={classes.text}>
          <Col xs={12}>
            Your portfolio drifts due to normal price fluctuations.
            We rebalance if it reaches&nbsp;
            {viewOnly
              ? <span>
                {formatNumber(values.rebalanceThreshold,
                  { format: 'percent' })}.
              </span>
              : <div className='inline-select-small'>
                <Select {...rebalanceThreshold} options={thresholdOptions}
                  searchable={false} clearable={false} />
              </div>
            }
          </Col>
        </Row>
        <Row className={classes.driftWrapper}>
          <Col className={classes.driftLabel}>
            DRIFT
            <OverlayTrigger placement='top' overlay={tooltipTitleDrift}>
              <span className={classes['tooltip']}>
                <MdHelp size='18' />
              </span>
            </OverlayTrigger>
          </Col>
          <Col className={classNames(classes.driftState, driftState.className)}>
            {driftState.label}
          </Col>
        </Row>
        <div className={classes.barRegion}>
          <div className={classes.barLabel}>
            <div className={driftState.className}>
              {formatNumber(driftScore, { format: 'percent' })}
            </div>
          </div>
          <div className={classes.driftBarWrapper}>
            <div className={classes.driftBar}
              style={{ width: driftScore }} />
          </div>
        </div>
      </form>
    )
  }
}
