import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router'

export default class Link extends Component {
  render () {
    return <RouterLink activeClassName='active' {...this.props} />
  }
}
