import React, { Component, PropTypes } from 'react'
import { Col, OverlayTrigger, Row } from 'react-bootstrap'
import { MdHelp } from 'helpers/icons'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './Hedge.scss'
import Switch from 'components/Switch/Switch'
import Tooltip from 'components/Tooltip/Tooltip'

const tooltip = (
  <Tooltip id='hedgeTooltip'>
    Hedge exposure to portfolio value fluctuations caused by changes in foreign
    currency exchange rates.
  </Tooltip>
)

export default class Hedge extends Component {
  static propTypes = {
    hedgeFx: PropTypes.object
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['hedgeFx'], this.props, nextProps)
  }

  render () {
    const { props } = this
    const { hedgeFx } = props

    return (
      <form className={classes.hedge}>
        <Row>
          <Col xs={9} className={classes.title}>
            Hedge FX Exposure
            <OverlayTrigger placement='top' overlay={tooltip}>
              <span className={classes.tooltip}>
                <MdHelp size='18' />
              </span>
            </OverlayTrigger>
          </Col>
          <Col xs={3} className={classes.status}>
            <Switch {...hedgeFx} />
          </Col>
        </Row>
      </form>
    )
  }
}
