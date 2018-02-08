import React, { Component, PropTypes } from 'react'
import { Collapse } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import classNames from 'classnames'
import { propsChanged } from 'helpers/pureFunctions'
import AllCaps from 'components/AllCaps'
import classes from './GoalEarnings.scss'

export default class GoalEarnings extends Component {
  static propTypes = {
    className: PropTypes.string,
    expanded: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.number
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['expanded', 'value'], this.props, nextProps)
  }

  render () {
    const { className, expanded, label, value } = this.props

    return (
      <Collapse in={expanded}>
        <div className={classNames(className)}>
          <AllCaps value={label} />&nbsp;
          <span className={classes.amount}>
            <FormattedNumber value={value} format='currency' />
          </span>
        </div>
      </Collapse>
    )
  }
}
