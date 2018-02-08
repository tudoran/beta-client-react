import React, { Component, PropTypes } from 'react'
import { mapIndexed } from 'helpers/pureFunctions'
import classes from './ProgressNav.scss'

export default class ProgressNav extends Component {
  static propTypes = {
    step: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    progressSteps: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    step: 1,
    progressSteps: [
      'Personal Details',
      'Financial Picture',
      'Initial Deposits',
      'Retirement Income'
    ]
  }

  render () {
    let { step, progressSteps } = this.props
    step = parseInt(step, 10)
    const innerBarWidth = 100 * (step * 2 - 1) / (progressSteps.length * 2)

    return (
      <div className={classes.progressNavWrap}>
        <div className={classes.progressNav}>
          <ul className={`${classes.stepLabels} ${classes['items' + progressSteps.length]}`}>
            {mapIndexed((progressStep, idx) =>
              <li key={idx} className={idx < step
                ? `${classes.navItem} ${classes.active}`
                : classes.navItem}>
                {progressStep}
              </li>
            , progressSteps)}
          </ul>
          <div className={classes.progressBar}>
            <div className={classes.innerBar}
              style={{width: innerBarWidth + '%'}} />
          </div>
        </div>
      </div>
    )
  }
}
