import React, { Component, PropTypes } from 'react'
import { Col, OverlayTrigger, Panel, Row } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import classNames from 'classnames'
import { MdKeyboardArrowRight, MdKeyboardArrowDown, MdKeyboardArrowUp,
  MdOpenInNew } from 'helpers/icons'
import BulletChart from '../BulletChart/BulletChart'
import classes from './PositionListItem.scss'
import PositionListItemDescription
  from '../PositionListItemDescription/PositionListItemDescription'
import Tooltip from 'components/Tooltip/Tooltip'

export default class PositionListItem extends Component {
  static propTypes = {
    position: PropTypes.object
  };

  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
  }

  onClick = () => {
    this.setState({ open: !this.state.open })
  }

  get header () {
    const { position } = this.props
    const { open } = this.state
    const assetClass = position.assetClass

    const tooltip = (
      <Tooltip id={`risk-poisition-item-${position.id}`}>
        <Row>
          <Col xs={4} className={classes.tooltipPercent}>
            <FormattedNumber value={position.targetValue || 0}
              format='currency' />
          </Col>
          <Col xs={8} className={classes.tooltipTitle}> Target Value</Col>
        </Row>
        <Row>
          <Col xs={4} className={classes.tooltipPercent}>
            <FormattedNumber value={position.value || 0} format='currency' />
          </Col>
          <Col xs={8} className={classes.tooltipTitle}> Current Value</Col>
        </Row>
      </Tooltip>
    )

    return (
      <Row className={classNames('header', classes.header)}
        onClick={this.onClick}>
        <Col xs={4} className={classes.cell}>
          {open
            ? <MdKeyboardArrowDown className={classes['chevron-down']} />
            : <MdKeyboardArrowRight className={classes['chevron-right']} />}
          <span>{assetClass.display_name}</span>
        </Col>
        <Col xs={6} className={classes.cell}>
          <BulletChart position={position} />
        </Col>
        <Col xs={2} className={classes.cell}>
          <OverlayTrigger placement='left' overlay={tooltip}>
            <div className={classes.targetValue}>
              <FormattedNumber value={position.targetValue || 0}
                format='currency' />
              <div className={classes.currentValue}>
                <FormattedNumber value={position.value || 0}
                  format='currency' />
              </div>
            </div>
          </OverlayTrigger>
        </Col>
      </Row>
    )
  }

  render () {
    const { position } = this.props
    const ticker = position.ticker
    const { open } = this.state
    const className = classNames({
      [classes['position-list-item']]: true,
      [classes['position-list-item--opened']]: open,
      [classes['position-list-item--collapsed']]: !open
    })

    return (
      <Panel header={this.header}
        className={className}
        collapsible
        expanded={open}>
        <Row>
          <Col xs={5}>
            <a href={ticker.url} target='_blank'
              className={classes['file-name']}>
              <MdOpenInNew className={classes['file-icon']} />
              {ticker.symbol}: {ticker.display_name}
            </a>
          </Col>
          <Col xs={5}>
            {Math.floor(position.position.share || 0)} shares
          </Col>
          <Col xs={2}>
            <span className={classes['value-content-inner']}>
              <FormattedNumber value={position.value || 0} style='currency'
                currency='USD' />
            </span>
          </Col>
        </Row>
        <PositionListItemDescription position={position} />
        <div className={classes['chevron-up-wrapper']}
          onClick={this.onClick}>
          <MdKeyboardArrowUp className={classes['chevron-up']} />
        </div>
      </Panel>
    )
  }
}
