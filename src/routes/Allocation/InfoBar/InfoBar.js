import React, { Component, PropTypes } from 'react'
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router'
import R from 'ramda'
import { allSettings, getUniqueSettings } from '../helpers'
import { propsChanged } from 'helpers/pureFunctions'
import Button from 'components/Button/Button'
import classes from './InfoBar.scss'
import InlineList from 'components/InlineList'

const getSetting = (key) =>
  R.find(R.propEq('key', key), allSettings)

const getUniqueSettingsKeys = R.compose(
  R.map(R.prop('key')),
  getUniqueSettings,
  R.prop('goal')
)

const setBtnTooltip =
  <Tooltip id='setBtnTooltip'>
    Save current settings
  </Tooltip>

const resetBtnTooltip =
  <Tooltip id='resetBtnTooltip'>
    Revert to last saved settings
  </Tooltip>

const revertBtnTooltip = ({ active_settings: activeSettings }) => // eslint-disable-line react/prop-types
  <Tooltip id='revertBtnTooltip'>
    Revert to {activeSettings ? 'currently active' : 'last approved'} settings
  </Tooltip>

const canApprove = ({ active_settings: active, approved_settings: approved,
  selected_settings: selected }) =>
  selected && approved && !R.equals(approved, selected.id)

const canRevert = ({ active_settings: active, approved_settings: approved,
  selected_settings: selected }) =>
  selected &&
  ((active && !R.equals(active, selected.id)) ||
  (approved && !R.equals(approved, selected.id)))

const getIsViewingExperimentalSettings = R.compose(
  R.equals('experimental_settings'),
  R.path(['params', 'viewedSettings'])
)

const getAllocationPath = ({ params: { accountId, clientId, goalId } }) =>
  `/${clientId}/account/${accountId}/goal/${goalId}/allocation`

const render = (_props) => {
  const { resetForm, viewedSettings } = _props
  const allocationPath = getAllocationPath(_props)
  const uniqueSettingsKeys = getUniqueSettingsKeys(_props)

  if (R.equals(viewedSettings, 'experimental_settings')) {
    return (
      <span>
        You are currently viewing experimental changes. Press <a href='#' onClick={resetForm}>
        Reset</a> to revert to your last saved settings.
      </span>
    )
  }

  if (R.equals(viewedSettings, 'selected_settings')) {
    const linkedSettingsKey = R.contains('approved_settings', uniqueSettingsKeys)
      ? 'approved_settings'
      : 'active_settings'

    return (
      <span>
        You are currently viewing your Selected Settings. These are not yet
        active in the market. View your <Link to={`${allocationPath}/${linkedSettingsKey}`}>
        {getSetting(linkedSettingsKey).label}</Link> instead.
      </span>
    )
  }

  if (R.equals(viewedSettings, 'approved_settings')) {
    const linkedSettingsKey = R.contains('selected_settings', uniqueSettingsKeys)
      ? 'selected_settings'
      : 'active_settings'

    return (
      <span>
        You are currently viewing your Approved Settings. These are not yet
        active in the market. View your <Link to={`${allocationPath}/${linkedSettingsKey}`}>
        {getSetting(linkedSettingsKey).label}</Link> instead.
      </span>
    )
  }

  if (R.equals(viewedSettings, 'active_settings')) {
    const linkedSettingsKey = R.contains('selected_settings', uniqueSettingsKeys)
      ? 'selected_settings'
      : 'approved_settings'

    return (
      <span>
        You are currently viewing your Active Settings. You have pending
        changes. View your <Link to={`${allocationPath}/${linkedSettingsKey}`}>
        {getSetting(linkedSettingsKey).label}</Link> instead.
      </span>
    )
  }
}

export default class InfoBar extends Component {
  static propTypes = {
    approve: PropTypes.func.isRequired,
    deleteExperimentalSettings: PropTypes.func.isRequired,
    goal: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    revert: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    viewedSettings: PropTypes.string.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goal', 'viewedSettings'], this.props,
      nextProps)
  }

  render () {
    const { props } = this
    const { approve, deleteExperimentalSettings, goal, replace, revert, show, user,
      viewedSettings } = props
    const allocationPath = getAllocationPath(props)
    const isViewingExperimentalSettings = getIsViewingExperimentalSettings(props)

    if (R.equals(getUniqueSettingsKeys(props), ['selected_settings']) &&
      !R.equals(viewedSettings, 'experimental_settings')) {
      return false
    } else {
      return (
        <Row className={classes.infoBar}>
          <Col xs={10} className={classes.content}>
            {viewedSettings && render(props)}
          </Col>
          <Col xs={2} className='text-right'>
            <InlineList>
              {isViewingExperimentalSettings &&
                <OverlayTrigger placement='top' overlay={setBtnTooltip}>
                  <Button onClick={function () { show('confirmGoalSettings') }}
                    className={classes.btnHeading}>Set</Button>
                </OverlayTrigger>}
              {isViewingExperimentalSettings &&
                <OverlayTrigger placement='top' overlay={resetBtnTooltip}>
                  <Button onClick={function () {
                    deleteExperimentalSettings({ id: goal.id })
                    replace(`${allocationPath}/selected_settings`)
                  }} className={classes.btnHeading}>Reset</Button>
                </OverlayTrigger>}
              {R.equals(user && user.role, 'advisor') && canApprove(goal)
                ? <div className={classes.headingActions}>
                  <Button bsStyle='primary' className={classes.btnHeading}
                    onClick={function () { approve() }}>
                    Approve
                  </Button>
                </div>
                : false}
              {canRevert(goal)
                ? <div className={classes.headingActions}>
                  <OverlayTrigger placement='top' overlay={revertBtnTooltip(goal)}>
                    <Button className={classes.btnHeading} onClick={function () { revert() }}>
                      Revert
                    </Button>
                  </OverlayTrigger>
                </div>
                : false}
            </InlineList>
          </Col>
        </Row>
      )
    }
  }
}
