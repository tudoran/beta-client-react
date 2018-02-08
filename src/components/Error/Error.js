import React, { Component } from 'react'
import classes from './Error'

export default class Error extends Component {
  render () {
    return (
      <div className={classes.error}>
        Loading error, try again
      </div>
    )
  }
}
