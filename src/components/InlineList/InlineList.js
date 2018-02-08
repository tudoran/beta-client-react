import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './InlineList.scss'

export default class InlineList extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['children', 'className'], this.props, nextProps)
  }

  render () {
    const { children, className } = this.props

    return (
      <div className={classNames(className, classes.inlineList)}>
        {children}
      </div>
    )
  }
}
