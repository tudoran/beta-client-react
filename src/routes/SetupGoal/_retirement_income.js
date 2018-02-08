import React, { PropTypes } from 'react'
import FieldError from 'components/FieldError/FieldError'
import { OverlayTrigger } from 'react-bootstrap'
import Tooltip from 'components/Tooltip/Tooltip'
import classes from './SetupGoal.scss'

const tooltipAmount =
  <Tooltip id='tooltipAmount' className='tooltip-primary'>
    Estimate how much you would need for your Retirement goal.
  </Tooltip>

const tooltipDuration =
  <Tooltip id='tooltipDuration' className='tooltip-primary'>
    When is the latest you plan on making this purchase?
  </Tooltip>

const tooltipInitialDeposit =
  <Tooltip id='tooltipInitialDeposit' className='tooltip-primary'>
    You can start this goal with an initial deposit, or enter 0 if you will
    deposit money later.
  </Tooltip>

const retirementIncome = ({ amount, duration, initialDeposit }) => {
  return (
    <div className='form-group'>
      <div className={classes['form-paragraph']}>
        I would like to have $
        <OverlayTrigger trigger='focus' placement='bottom'
          overlay={tooltipAmount}>
          <input type='text' {...amount} />
        </OverlayTrigger>
        to pay for my Retirement goal. I may need this money in
        <OverlayTrigger trigger='focus' placement='bottom'
          overlay={tooltipDuration}>
          <input type='text' {...duration} />
        </OverlayTrigger>
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

retirementIncome.propTypes = {
  amount: PropTypes.object,
  duration: PropTypes.object,
  initialDeposit: PropTypes.object
}

export default retirementIncome
