import React, { Component, PropTypes } from 'react'
import { FormGroup as BootstrapFormGroup } from 'react-bootstrap'
import classNames from 'classnames'
import classes from './FormGroup.scss'

export class FormGroup extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.array
    ]),
    className: PropTypes.string
  };

  render () {
    const { children, className } = this.props

    return (
      <BootstrapFormGroup className={classNames([classes.formGroup, className])}>
        {children}
      </BootstrapFormGroup>
    )
  }
}

export default FormGroup
