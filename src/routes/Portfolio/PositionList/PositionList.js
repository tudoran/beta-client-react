import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import R from 'ramda'
import PositionListItem from '../PositionListItem/PositionListItem'
import PositionListHeader from '../PositionListHeader/PositionListHeader'
import PositionListFooter from '../PositionListFooter/PositionListFooter'
import classes from './PositionList.scss'

export default class PositionList extends Component {
  static propTypes = {
    positions: PropTypes.array
  };

  render () {
    const { positions } = this.props
    const rows = R.map(position =>
      <PositionListItem position={position} key={position.id} />
    , positions)
    const isEmpty = R.isEmpty(rows)

    return (
      <div>
        <PositionListHeader />
        <div>
          {isEmpty
            ? <Row>
              <Col xs={12} className={classes.emptyText}>
                No data<br />
              </Col>
            </Row>
            : rows}
        </div>
        {!isEmpty && <PositionListFooter positions={positions} />}
      </div>
    )
  }
}
