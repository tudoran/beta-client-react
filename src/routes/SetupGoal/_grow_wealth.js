import React, { PropTypes } from 'react'
import FieldError from 'components/FieldError/FieldError'
import { OverlayTrigger } from 'react-bootstrap'
import Tooltip from 'components/Tooltip/Tooltip'
import classes from './SetupGoal.scss'

const tooltipInitialDeposit =
  <Tooltip id='tooltipInitialDeposit' className='tooltip-primary'>
    You can start this goal with an initial deposit, or enter 0 if you will
    deposit money later.
  </Tooltip>

const growWealth = ({ initialDeposit }) => {
  return (
    <div className='form-group'>
      <div className={classes['form-paragraph']}>
        I would like to start investing with an initial deposit of $
        <OverlayTrigger trigger='focus' placement='bottom'
          overlay={tooltipInitialDeposit}>
          <input type='text' {...initialDeposit} />
        </OverlayTrigger>
        .
      </div>
      <FieldError for={initialDeposit} />
    </div>
  )
}

growWealth.propTypes = {
  initialDeposit: PropTypes.object
}

export default growWealth
