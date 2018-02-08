import React, { Component, PropTypes } from 'react'
import { Panel, Row, Col } from 'react-bootstrap/lib'
import classNames from 'classnames'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'helpers/icons'
import classes from './PositionListItemDescription.scss'

export default class PositionListItemDescription extends Component {
  static propTypes = {
    position: PropTypes.object
  };

  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
  }

  onClick = (e) => {
    e.stopPropagation()
    this.setState({ open: !this.state.open })
  }

  get header () {
    const { open } = this.state
    const className = classNames({
      header: true,
      [classes.header]: true,
      [classes.opened]: open,
      [classes.collapsed]: !open
    })

    return (
      <div className={className} onClick={this.onClick}>
        {open
          ? <MdKeyboardArrowDown className={classes['chevron-down']} />
          : <MdKeyboardArrowRight className={classes['chevron-right']} />}
        <span>why this asset class and these etfs</span>
      </div>
    )
  }

  render () {
    const { position } = this.props
    const { open } = this.state
    const className = classNames({
      'position-list-item-description': true,
      [classes['position-list-item-description']]: true,
      [classes['position-list-item-description--opened']]: open
    })

    return (
      <Panel header={this.header} className={className} expanded={open}
        collapsible>
        <Row>
          <Col xs={6}>
            {position && position.assetClass &&
              position.assetClass.asset_class_explanation}
          </Col>
          <Col xs={6}>
            {position && position.assetClass &&
              position.assetClass.tickers_explanation}
          </Col>
        </Row>
      </Panel>
    )
  }
}
