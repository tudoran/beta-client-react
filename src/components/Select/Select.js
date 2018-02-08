import React, { Component } from 'react'
import ReactSelect from 'react-select-plus'
import './Select.scss'

export default class Select extends Component {
  render () {
    return <ReactSelect {...this.props} />
  }
}
