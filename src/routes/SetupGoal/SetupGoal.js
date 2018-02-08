import React, { Component, PropTypes } from 'react'
import { Button, OverlayTrigger } from 'react-bootstrap'
import R from 'ramda'
import Tooltip from 'components/Tooltip/Tooltip'
import moment from 'moment'
import { MdChevronRight, MdEdit } from 'helpers/icons'
import { underscorize } from 'helpers/pureFunctions'
import classes from './SetupGoal.scss'
import classNames from 'classnames'
import CreateGoalModal from 'containers/CreateGoalModal/CreateGoalModal'
import Spinner from 'components/Spinner/Spinner'

const tooltipGoalTypeName =
  <Tooltip id='tooltipGoalTypeName'>
    We use Goal Type to determine our recommended allocation.
  </Tooltip>

const tooltipHelpContent =
  <Tooltip id='tooltipGoalTypeName'>
    We ask for information about your goal so we can give you the best
    advice about how to make your goal a reality.&nbsp;
    <a href={'http://support.betasmartz.com/customer/portal/articles/' +
      '1078904-why-do-you-ask-for-my-time-horizon-and-goal-target-amount'}
      target='_blank'>Learn more about the calculations &gt;</a>
  </Tooltip>

const tooltipGoalEdit =
  <Tooltip id='tooltipGoalEdit'>
    Change goal name
  </Tooltip>

export default class SetupGoal extends Component {
  static propTypes = {
    children: PropTypes.node,
    fields: PropTypes.object,
    goal: PropTypes.object,
    goalTypes: PropTypes.array,
    handleSubmit: PropTypes.func,
    params: PropTypes.object,
    requests: PropTypes.object,
    save: PropTypes.func,
    show: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.save = this.save.bind(this)
  }

  save ({ selectedGoalType, name, ethicalInvestments, amount, duration,
    initialDeposit }) {
    const { params: { accountId }, save } = this.props
    const completion = moment().add(duration, 'years').format('YYYY-MM-DD')
    const body = {
      account: accountId,
      type: selectedGoalType.id,
      name,
      ethical_investments: ethicalInvestments,
      target: parseFloat(amount),
      completion,
      initial_deposit: parseFloat(initialDeposit)
    }
    save({ body })
  }

  render () {
    const { fields, fields: { name, selectedGoalType }, children, handleSubmit,
      requests: { save }, show } = this.props
    const selectedGoalTypeName = selectedGoalType.value &&
      selectedGoalType.value.name
    const form = selectedGoalTypeName &&
      require('./_' + underscorize(selectedGoalTypeName))

    return (
      <div className='container'>
        <h1 className={classes['page-title']}>Goal setup</h1>
        <div className={classNames(classes['goal-panel'], 'panel')}>
          <div className={classes['controls']}>
            <div className={classes['goalSelection']}>
              <ul className={classes['select-goal']}>
                <li
                  className={classNames(classes.adviceAccount, classes.active)}>
                  <div className={classes['goal-name']}>
                    <span>{name.value}</span>
                    <OverlayTrigger placement='top' overlay={tooltipGoalEdit}>
                      <span className={classes['goal-edit']}>
                        <MdEdit size='20' />
                      </span>
                    </OverlayTrigger>
                    <span className={classes['chevron-right']}>
                      <MdChevronRight size='30' />
                    </span>
                  </div>
                  <div className={classes['goal-contents']}>
                    <OverlayTrigger placement='top'
                      overlay={tooltipGoalTypeName}>
                      <div className={classNames('pull-left',
                        classes['type-tooltip'])}>
                        {selectedGoalTypeName}
                      </div>
                    </OverlayTrigger>
                    <div className='pull-right'>
                      <Button bsSize='sm'
                        onClick={function () {
                          show('createGoal', { saveButtonLabel: 'Set Goal' })
                        }}>
                        Change
                      </Button>
                      <CreateGoalModal saveButtonLabel='Set Goal' />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className={classes['info']}>
            <h3 className={classes['info-heading']}>
              Tell us about your goal so we can give you advice
            </h3>
            <div className={classes['narrative-container']}>
              <div className={classes['narrative-outline']}>
                <div className={classes['narrative-help']}>
                  <OverlayTrigger trigger='click' rootClose placement='top'
                    overlay={tooltipHelpContent}>
                    <span className={classes['help-text']}>
                      Why we ask this
                    </span>
                  </OverlayTrigger>
                </div>
                <div className={classes['narrative-inside']}>
                  <form className='form-horizontal'
                    onSubmit={handleSubmit(this.save)}>
                    <div className={classes['madlib']}>
                      {form && form(fields)}
                    </div>
                    <div className={classes['next-step']}>
                      {children}
                    </div>
                  </form>
                </div>
                {save && R.equals(save.status, 'pending') &&
                  <div className={classes.loadingOverlay}>
                    <Spinner />
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
