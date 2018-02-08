import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './AllCaps.scss'

export default class AllCaps extends Component {
  static propTypes = {
    className: PropTypes.string,
    tagName: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired
  };

  static defaultProps = {
    tagName: 'span'
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['className', 'tagName', 'value'], this.props, nextProps)
  }

  render () {
    const { className, tagName: Tag, value } = this.props
    return (
      <Tag className={classNames(className, classes.caps)}>
        {value}
      </Tag>
    )
  }
}
