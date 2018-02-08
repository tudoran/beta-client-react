import React, { Component, PropTypes } from 'react'
import { FormControl } from 'react-bootstrap'
import { injectIntl, intlShape } from 'react-intl'
import R from 'ramda'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import classes from './CurrencyInput.scss'

const getDOMInput = R.compose(
  ReactDOM.findDOMNode,
  R.path(['refs', 'focusedInput', 'refs', 'input'])
)

const getValue = event => {
  const { value } = event.target
  return R.isNil(value) || R.isEmpty(value)
    ? value
    : parseFloat(value)
}

class CurrencyInput extends Component {
  static propTypes = {
    format: PropTypes.string,
    intl: intlShape,
    min: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    className: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };

  static defaultProps = {
    format: 'currency',
    min: '0',
    onBlur: () => {},
    onFocus: () => {},
    step: 'any'
  };

  constructor (props) {
    super(props)
    this.state = {
      isFocused: false,
      value: props.value
    }
  }

  componentWillReceiveProps ({ value }) {
    this.setState({ value })
  }

  componentDidUpdate () {
    const DOMInput = getDOMInput(this)
    setTimeout(function () {
      DOMInput && DOMInput.focus()
    }, 1)
  }

  get formattedValue () {
    const { format, intl: { formatNumber } } = this.props
    const { value } = this.state
    const finalValue = R.isNil(value) || R.isEmpty(value) ? 0 : value

    return formatNumber(finalValue, { format })
  }

  handleFocus = (event) => {
    this.props.onFocus(getValue(event))
    this.setState({
      isFocused: true
    })
  }

  handleBlur = (event) => {
    this.props.onBlur(getValue(event))
    this.setState({
      isFocused: false
    })
  }

  render () {
    const { isFocused, value } = this.state
    const { props } = this
    const { className } = props
    const finalProps = R.omit(['intl'], props)
    const inputClass = classNames([
      classes.currencyInput,
      className
    ])

    if (isFocused) {
      return (
        <FormControl {...finalProps}
          type='number'
          key='number'
          className={inputClass}
          value={value}
          onBlur={this.handleBlur}
          autoFocus
          ref='focusedInput'
        />
      )
    } else {
      return (
        <FormControl {...finalProps}
          type='text'
          key='text'
          className={inputClass}
          value={this.formattedValue || '$'}
          onFocus={this.handleFocus}
          readOnly
        />
      )
    }
  }
}

export default injectIntl(CurrencyInput)
