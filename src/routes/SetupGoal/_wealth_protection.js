import React, { PropTypes } from 'react'
import FieldError from 'components/FieldError/FieldError'
import { OverlayTrigger } from 'react-bootstrap'
import Tooltip from 'components/Tooltip/Tooltip'
import classes from './SetupGoal.scss'

const tooltipAmount =
  <Tooltip id='tooltipAmount' className='tooltip-primary'>
    If you're not sure, 6x your essential monthly expenses is a good rule of
    thumb.
  </Tooltip>

const tooltipInitialDeposit =
  <Tooltip id='tooltipInitialDeposit' className='tooltip-primary'>
    You can start this goal with an initial deposit, or enter 0 if you will
    deposit money later.
  </Tooltip>

const wealthProtection = ({ amount, duration, initialDeposit }) => {
  return (
    <div className='form-group'>
      <div className={classes['form-paragraph']}>
        I would like to have $
        <OverlayTrigger trigger='focus' placement='bottom'
          overlay={tooltipAmount}>
          <input type='text' {...amount} />
        </OverlayTrigger>
        as a Wealth Protection for unexpected expenses.
        I want my wealth protection funded in
        <input type='text' {...duration} />
        years. I could deposit $
        <OverlayTrigger trigger='focus' placement='bottom'
          overlay={tooltipInitialDeposit}>
          <input type='text' {...initialDeposit} />
        </OverlayTrigger>
        initially.
      </div>
      <FieldError for={amount} />
      <FieldError for={duration} />
      <FieldError for={initialDeposit} />
    </div>
  )
}

wealthProtection.propTypes = {
  amount: PropTypes.object,
  duration: PropTypes.object,
  initialDeposit: PropTypes.object
}

export default wealthProtection
