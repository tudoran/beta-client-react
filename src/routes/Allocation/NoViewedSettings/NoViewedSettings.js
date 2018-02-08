import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import R from 'ramda'
import { allocation } from 'redux/selectors'
import { replace } from 'redux/modules/router'
import Spinner from 'components/Spinner/Spinner'

const getExperimentalSettings = ({ allocationState, params: { goalId } }) =>
  R.path([parseInt(goalId, 10), 'experimentalSettings'], allocationState)

class NoViewedSettings extends Component {
  static propTypes = {
    allocationState: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    replace: PropTypes.func
  };

  componentWillMount () {
    const { props } = this
    const { location, replace } = props
    const settingsKey = getExperimentalSettings(props)
      ? 'experimental_settings'
      : 'selected_settings'
    replace(`${location.pathname}/${settingsKey}`)
  }

  render () {
    return (
      <Spinner />
    )
  }
}

const selectors = createStructuredSelector({
  allocationState: allocation
})

const actions = {
  replace
}

export default R.compose(
  connect(selectors, actions)
)(NoViewedSettings)
