import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './Text.scss'

export default class Text extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf(['small', 'normal', 'large', 'xlarge']).isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    size: 'normal'
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['children', 'className', 'size', 'style'], this.props, nextProps)
  }

  render () {
    const { children, className, size, style } = this.props
    return (
      <span className={classNames(classes[size], className)} style={style}>
        {children}
      </span>
    )
  }
}
