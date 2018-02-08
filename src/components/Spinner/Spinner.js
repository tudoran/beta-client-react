import React, { Component } from 'react'
import classes from './Spinner.scss'

export default class Spinner extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div className={classes.spinnerWrapper}>
        <svg className={classes.spinner} width='65px' height='65px'
          viewBox='25 25 50 50'
          xmlns='http://www.w3.org/2000/svg'>
          <circle className={classes.path} cx='50' cy='50' r='20' fill='none'
            strokeWidth='4' strokeMiterlimit='10' />
        </svg>
      </div>
    )
  }
}
