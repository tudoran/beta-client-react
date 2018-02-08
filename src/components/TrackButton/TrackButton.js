import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import { OverlayTrigger } from 'react-bootstrap'
import Tooltip from 'components/Tooltip/Tooltip'
import classes from './TrackButton.scss'

const tooltipOnTrack = id =>
  <Tooltip id={id}>
    <strong className={classes.success}>On Track</strong>
    <div>
      You have at <strong>least a 50% chance</strong> of meeting your target.
      This is based on assumptions which may or may not hold true in the future,
      so it is still possible you will not meet this target.
    </div>
  </Tooltip>

const tooltipOffTrack = id =>
  <Tooltip id={id}>
    <strong className={classes.danger}>Off Track</strong>
    <div>
      You have <strong>less than a 50%</strong> chance
      of meeting your target. Keep in mind that this is based on
      assumptions which may or may not hold true in the future
      about our advice calculations and assumptions.
    </div>
  </Tooltip>

export default class TrackButton extends Component {
  static propTypes = {
    goal: PropTypes.object.isRequired
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  render () {
    const { id, on_track: onTrack } = this.props.goal
    const { accountId, clientId } = this.context
    const tooltipId = `track-btn-tooltip-${id}`
    const tooltip = onTrack
      ? tooltipOnTrack(tooltipId)
      : tooltipOffTrack(tooltipId)
    const buttonClasses = classNames({
      'btn': true,
      'btn-round': true,
      'btn-danger': !onTrack
    })

    return (
      <OverlayTrigger placement='top' overlay={tooltip}>
        <Link to={`/${clientId}/account/${accountId}/goal/${id}/allocation`}
          className={buttonClasses}>
          {onTrack
            ? <span className={classes.success}>On Track</span>
            : <span className={classes.danger}>Off Track</span>}
        </Link>
      </OverlayTrigger>
    )
  }
}
