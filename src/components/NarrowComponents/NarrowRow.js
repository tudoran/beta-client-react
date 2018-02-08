import React, { Component, PropTypes } from 'react'
import { Row } from 'react-bootstrap'
import classNames from 'classnames'
import classes from './NarrowComponents.scss'

export default class NarrowRow extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render () {
    const { props } = this
    const newClasses = [classes.narrowRow]
    if (props.className) newClasses.push(props.className)
    return (
      <Row {...props} className={classNames(newClasses)} />
    )
  }
}
