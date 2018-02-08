import React, { Component, PropTypes } from 'react'
import { FormControl } from 'react-bootstrap'
import R from 'ramda'
import ReactDOM from 'react-dom'

const moveCursorToEnd = (DOMInput) => {
  if (DOMInput) {
    const value = DOMInput.value
    DOMInput.focus()
    DOMInput.value = ''
    DOMInput.value = value
  }
}

export default class InlineEdit extends Component {
  static propTypes = {
    children: PropTypes.element,
    isEditing: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func,
    onEnd: PropTypes.func,
    setIsEditing: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {}
    this.handleDocumentMousedown = this.handleDocumentMousedown.bind(this)
  }

  componentWillUpdate ({ isEditing }) {
    const { isEditing: currentIsEditing, value } = this.props

    if (currentIsEditing && !isEditing) {
      this.setState({
        savedValue: value
      })
    }

    if (currentIsEditing) {
      this.registerDocumentClickEvent()
    } else {
      this.teardownDocumentClickEvent()
    }
  }

  componentDidUpdate ({ isEditing }) {
    const { isEditing: currentIsEditing } = this.props

    if (currentIsEditing && !isEditing) {
      const { input } = this.refs
      const DOMInput = ReactDOM.findDOMNode(input)
      setTimeout(() => moveCursorToEnd(DOMInput), 100)
    }
  }

  registerDocumentClickEvent () {
    document.addEventListener('mousedown', this.handleDocumentMousedown, false)
  }

  teardownDocumentClickEvent () {
    document.removeEventListener('mousedown',
      this.handleDocumentMousedown, false)
  }

  handleDocumentMousedown (event) {
    if (R.not(this.isMouseDownInsideComponent)) {
      this.endEditing()
    }
  }

  handleKeyPress = (event) => {
    const { key } = event
    if (R.equals(key, 'Enter')) {
      this.endEditing()
    } else if (R.equals(key, 'Escape')) {
      const { onChange } = this.props
      const { savedValue } = this.state
      onChange(savedValue)
      this.cancelEditing()
    }
  }

  endEditing () {
    const { onEnd, setIsEditing } = this.props
    setIsEditing(false)
    onEnd()
  }

  cancelEditing () {
    const { setIsEditing } = this.props
    setIsEditing(false)
  }

  render () {
    const { children, isEditing, value, onChange } = this.props
    const self = this

    if (isEditing) {
      return <FormControl type='text' ref='input' value={value}
        onChange={function (event) { onChange(event.target.value) }}
        onKeyUp={this.handleKeyPress}
        onMouseDown={function () { self.isMouseDownInsideComponent = true }}
        onMouseUp={function () { self.isMouseDownInsideComponent = false }} />
    } else {
      return <span>{children || value}</span>
    }
  }
}
