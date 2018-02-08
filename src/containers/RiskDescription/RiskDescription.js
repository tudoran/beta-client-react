import React, { Component, PropTypes } from 'react'
import { MdHelp } from 'helpers/icons'
import { OverlayTrigger } from 'react-bootstrap'
import R from 'ramda'
import { connect } from 'redux/api'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './RiskDescription.scss'
import config from 'config'
import Tooltip from 'components/Tooltip/Tooltip'

const { riskDescriptions } = config

const getRiskDescription = ({ recommended: { values }, risk }) => {
  const minRec = R.reduce(R.min, Infinity, values)
  const maxRec = R.reduce(R.max, -Infinity, values)

  return R.compose(
    R.defaultTo({}),
    R.find(({ when }) => when({ maxRec, minRec, value: risk }))
  )(riskDescriptions)
}

const riskTooltip = ({ years }) =>
  <Tooltip id='riskTooltip'>
    This is the relative risk level of your target allocation considering
    your time horizon of {years} years.
    You can adjust this risk level by updating your time horizon or target
    allocation.
  </Tooltip>

riskTooltip.propTypes = {
  years: PropTypes.number
}

class RiskDescription extends Component {
  static propTypes = {
    goalId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    recommended: PropTypes.object,
    risk: PropTypes.number,
    years: PropTypes.number,
    withRiskScore: PropTypes.bool
  };

  static defaultProps = {
    recommended: {
      values: []
    }
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goalId', 'recommended', 'risk', 'years'], this.props,
      nextProps)
  }

  render () {
    const { props } = this
    const { risk, withRiskScore } = props
    const riskDescription = getRiskDescription(props)

    return (
      <span className={riskDescription.className}>
        {withRiskScore && <span>({Math.round(risk * 100)})&nbsp;</span>}
        {riskDescription.label}
        <OverlayTrigger placement='top' overlay={riskTooltip(props)}>
          <span className={classes.tooltip}>
            <MdHelp size='18' />
          </span>
        </OverlayTrigger>

      </span>
    )
  }
}

const requests = ({ goalId, years }) => ({
  recommended: years && (({ findSingle }) => findSingle({
    url: `/goals/${goalId}/recommended-risk-scores?years=${years}`,
    type: 'recommendedRiskScores',
    footprint: R.pick(['goal', 'years']),
    deserialize: values => ({
      goal: goalId,
      values,
      years
    })
  }))
})

export default connect(requests)(RiskDescription)
