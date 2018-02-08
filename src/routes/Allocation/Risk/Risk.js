import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'redux/api'
import { formatRisk, getRisk } from '../helpers'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './Risk.scss'
import InputField from '../InputField/InputField'
import Slider from 'components/Slider/Slider'

const label = ({ risk: { value } }) =>
  <span>Risk appetite:&nbsp;{Math.round(value * 100)}</span>

label.propTypes = {
  risk: PropTypes.object
}

const getRecValues = R.compose(
  R.uniq,
  R.map(formatRisk),
  R.prop('values')
)

const input = ({ recommended, risk }) => // eslint-disable-line react/prop-types
  <Slider min={0} max={1} step={0.01} className={classes.slider} {...risk}
    labelMin='Protective' labelMax='Dynamic'>
    {R.map(recValue =>
      <span key={recValue} className={classes.recommended}
        style={{ left: `${100 * recValue}%` }} />
      , getRecValues(recommended))}
  </Slider>

class Risk extends Component {
  static propTypes = {
    goalId: PropTypes.string,
    recommended: PropTypes.object,
    risk: PropTypes.object,
    settings: PropTypes.object,
    years: PropTypes.number
  };

  static defaultProps = {
    recommended: {
      values: []
    }
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['goalId', 'recommended', 'risk', 'settings', 'years'],
      this.props, nextProps)
  }

  render () {
    const { risk, settings } = this.props
    const savedRisk = getRisk(settings)

    return (
      <InputField field={risk} savedValue={savedRisk} label={label(this.props)}
        input={input(this.props)} />
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

export default connect(requests)(Risk)
