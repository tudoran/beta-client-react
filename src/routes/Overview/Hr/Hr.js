import React, { Component } from 'react'
import classes from './Hr.scss'

export default class Hr extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <hr className={classes.hr} />
    )
  }
}
