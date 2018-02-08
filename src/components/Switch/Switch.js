import React, { Component } from 'react'
import uuid from 'uuid'
import classes from './Switch.scss'

export default class Switch extends Component {
  componentWillMount () {
    this.id = uuid.v4()
  }

  render () {
    return (
      <div className={classes['cmn-switch']}>
        <input id={this.id} type='checkbox' {...this.props}
          className={classes['cmn-toggle']} />
        <label htmlFor={this.id} />
      </div>
    )
  }
}
