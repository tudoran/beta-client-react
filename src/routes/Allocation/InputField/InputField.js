import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import classNames from 'classnames'
import { MdHighlightRemove } from 'helpers/icons'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './InputField.scss'

export default class InputField extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    helpText: PropTypes.element,
    input: PropTypes.element,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    savedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  }

  shouldComponentUpdate (nextProps) {
    return propsChanged(['field', 'helpText', 'input', 'label', 'savedValue'],
      this.props, nextProps)
  }

  reset = (event) => {
    const { field: { onChange }, savedValue } = this.props
    event.preventDefault()
    onChange(savedValue)
  }

  render () {
    const { field: { dirty }, helpText, input, label } = this.props
    const componentClasses = classNames({
      [classes.controlWrap]: true,
      [classes.dirty]: dirty
    })

    return (
      <Row className={componentClasses}>
        <Col xs={12}>
          <h5 className={classes.title}>{label}</h5>
        </Col>
        <Col xs={12}>
          <Row>
            <Col xs={10} className={classes.input}>
              {input}
            </Col>
            <Col xs={2} className={classes.reset}>
              {dirty &&
                <a onClick={this.reset}>
                  <MdHighlightRemove size='24' />
                </a>}
            </Col>
          </Row>
        </Col>
        <Col xs={12} className={classes.currentValue}>
          {helpText}
        </Col>
      </Row>
    )
  }
}
