import React, { Component, PropTypes } from 'react'
import { FormGroup } from 'react-bootstrap'
import classNames from 'classnames'
import classes from './NarrowComponents.scss'

export default class NarrowFormGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render () {
    const { props } = this
    const newClasses = [classes.narrowRow]
    if (props.className) newClasses.push(props.className)
    return (
      <FormGroup {...props} className={classNames(newClasses)} />
    )
  }
}
