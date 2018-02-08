import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Tooltip as BsTooltip } from 'react-bootstrap'
import classes from './Tooltip.scss'

const Tooltip = ({ children, ...options }) => {
  const wrapperClasses = classNames(classes.wrapper)
  return (
    <BsTooltip {...options} title={<span>Test</span>}>
      <div className={wrapperClasses}>
        {children}
      </div>
    </BsTooltip>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired
}

export default Tooltip
