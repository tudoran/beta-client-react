import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import R from 'ramda'
import ReactSlider from 'react-slider'
import classes from './Slider.scss'

export default class Slider extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    hideLabels: PropTypes.bool,
    label: PropTypes.string,
    labelMax: PropTypes.string,
    labelMin: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func
  }

  get labelMin () {
    const { labelMin, min } = this.props
    return labelMin || min
  }

  get labelMax () {
    const { labelMax, max } = this.props
    return labelMax || max
  }

  render () {
    const { className, children, hideLabels, label } = this.props

    return (
      <div className={classNames(classes.sliderWrap, className)}>
        {children}
        <ReactSlider {...(R.omit(['children'], this.props))}
          className={classes.slider} onSliderClick={this.props.onChange}
          handleClassName={classes.handle} />
        {!hideLabels &&
          <div className={classNames(classes.labels, 'clearfix')}>
            <div className={classes.labelMin}>{this.labelMin}</div>
            <div className={classes.labelMax}>{this.labelMax}</div>
            <div className={classes.label}>{label}</div>
          </div>}
      </div>
    )
  }
}
