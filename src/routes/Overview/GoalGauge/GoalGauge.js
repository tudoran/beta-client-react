import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'
import ArcGauge from 'components/ArcGauge/ArcGauge'
import classes from './GoalGauge.scss'

export default class GoalGauge extends Component {
  static propTypes = {
    label: PropTypes.string,
    riskScore: PropTypes.number
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['bondsBalance', 'stocksBalance'],
      this.props, nextProps)
  }

  render () {
    const { label, riskScore } = this.props
    const finalRiskScore = R.isNil(riskScore) ? 0 : riskScore

    return (
      <div className={classes.allocation}>
        <div className={classes.bonds}>
          <span>Bonds</span>
          <span className={classes.percentage}>
            <FormattedNumber value={1 - finalRiskScore}
              format='percent' />
          </span>
        </div>
        <div className={classes.gauge}>
          <ArcGauge value={finalRiskScore}
            size={4}
            radius={70}
            width={150}
            sections={['#36a838', '#36a838', '#36a838', '#36a838',
              '#f9221d', '#f9221d', '#f9221d', '#f9221d']}
            arrow={{height: 60, width: 3, color: '#333'}} />
          <div className={classes.label}>{label}</div>
        </div>
        <div className={classes.stocks}>
          <span>Stocks</span>
          <span className={classes.percentage}>
            <FormattedNumber value={finalRiskScore}
              format='percent' />
          </span>
        </div>
      </div>
    )
  }
}
