import React, { Component, PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import classNames from 'classnames'
import classes from './NarrowComponents.scss'

export default class NarrowCol extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render () {
    const { props } = this
    const newClasses = [classes.narrowCol]
    if (props.className) newClasses.push(props.className)
    return (
      <Col {...props} className={classNames(newClasses)} />
    )
  }
}
