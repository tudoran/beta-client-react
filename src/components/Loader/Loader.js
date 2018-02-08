import React, { Component } from 'react'
import classes from './Loader'

export default class Loader extends Component {
  render () {
    return (
      <div className={classes.loader}>
        Loading, please wait
      </div>
    )
  }
}
