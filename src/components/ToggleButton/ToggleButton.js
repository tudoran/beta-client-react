import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { MdAdd, MdRemove } from 'helpers/icons'
import Button from 'components/Button/Button'
import classes from './ToggleButton.scss'

export default class ToggleButton extends Component {
  static propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    iconSize: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  };

  static defaultProps = {
    iconSize: 18
  };

  render () {
    const { active, className, iconSize, onClick } = this.props
    const btnClasses = classNames({
      [className]: typeof className !== 'undefined',
      [classes['btn-toggle']]: true,
      [classes['active']]: active
    })

    return (
      <Button className={btnClasses} onClick={onClick} bsStyle='circle'>
        <span className={classes['text-on']}><MdRemove size={iconSize} /></span>
        <span className={classes['text-off']}><MdAdd size={iconSize} /></span>
      </Button>
    )
  }
}
