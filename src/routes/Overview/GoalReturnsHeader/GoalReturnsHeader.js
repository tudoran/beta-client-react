import React, { Component, PropTypes } from 'react'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalReturnsHeader.scss'
import ToggleButton from 'components/ToggleButton/ToggleButton'

export default class GoalReturnsHeader extends Component {
  static propTypes = {
    children: PropTypes.node,
    expanded: PropTypes.bool,
    onClick: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['children', 'expanded'], this.props, nextProps)
  }

  render () {
    const { children, expanded, onClick } = this.props
    return (
      <div className={classes.goalReturnsHeader}>
        <span className={classes.toggleBtnWrapper}>
          <ToggleButton active={expanded} onClick={onClick} className='btn-xs'
            iconSize={14} />
        </span>
        {children}
      </div>
    )
  }
}
