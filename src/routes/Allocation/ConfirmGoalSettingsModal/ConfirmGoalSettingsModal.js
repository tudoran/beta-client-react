import React, { Component, PropTypes } from 'react'
import { Button, Checkbox, ControlLabel, Col, Form, FormControl, FormGroup,
  Modal, Row, OverlayTrigger } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { FormattedNumber } from 'react-intl'
import { reduxForm } from 'redux-form'
import { MdHelp } from 'helpers/icons'
import R from 'ramda'
import { calculatedPortfolio } from 'redux/selectors'
import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import { prettyDuration, serializeSettings } from '../helpers'
import { mapIndexed, propsChanged } from 'helpers/pureFunctions'
import classes from './ConfirmGoalSettingsModal.scss'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import schema from 'schemas/allocation'
import Tooltip from 'components/Tooltip/Tooltip'

const getAdvisorName = R.compose(
  advisor => `${advisor.first_name} ${advisor.last_name}`,
  R.defaultTo({}),
  R.path(['advisor', 'user']),
  R.defaultTo({}),
  R.prop('user')
)

const dirtyConstraints = R.compose(
  R.filter(
    R.compose(R.any(R.identity), R.values, R.map(R.prop('dirty')))
  ),
  R.path(['fields', 'constraints'])
)

const hasDirtyConstraint = R.compose(
  R.not,
  R.isEmpty,
  dirtyConstraints
)

const getFeatureName = ({ value }, features) =>
  R.compose(
    R.prop('name'),
    R.defaultTo({}),
    R.find(R.propEq('id', value)),
    R.flatten,
    R.map(R.prop('values'))
  )(features)

const getComparisonName = ({ value }, comparisons) =>
  R.compose(
    R.prop('name'),
    R.defaultTo({}),
    R.find(R.propEq('id', value))
  )(comparisons)

const renderRisk = ({ fields: { risk, riskEnabled } }) =>
  <div className={classes.section}>
    <div className={classes.status}>
      <Checkbox {...riskEnabled} />
    </div>
    <div className={classes.data}>
      <Row>
        <Col sm={5} className={classes.attribute}>
          <h5 className={classes.name}>Risk Appetite</h5>
          <div className={classes.value}>
            {Math.round(risk.value * 100)}
          </div>
        </Col>
        <Col sm={7} className={classes.detail}>
          <p><a href='https://app.betasmartz.com/transactions/#day-trading'
            target='_blank'>Betasmartz</a> permits <strong>only one </strong>
            allocation change per day. When you change your Risk Appetite you
            are giving Betasmartz instructions to <a
              href='http://www.betasmartz.com/transactions/' target='_blank'>
            trade on your behalf</a>.</p>
          <p>Risk Appetite changes fully rebalance your account. Any sales will
          be optimized to reduce taxes, but this may result in short-term
          gains taxes that were otherwise avoided during prior balances.</p>
        </Col>
      </Row>
    </div>
  </div>

renderRisk.propTypes = {
  fields: PropTypes.object
}

const renderRebalance = properties => {
  const { rebalance, rebalanceEnabled, rebalanceThreshold } = properties.fields

  return (
    <div className={classes.section}>
      <div className={classes.status}>
        <Checkbox {...rebalanceEnabled} />
      </div>
      <div className={classes.data}>
        <Row>
          <Col sm={5} className={classes.attribute}>
            <h5 className={classes.name}>Rebalancing</h5>
            {rebalance.dirty && <div className={classes.value}>
              Turn {rebalance.value ? 'on' : 'off'}
            </div>}
            {rebalanceThreshold.dirty &&
              <div className={classes.value}>
                Threshold: {rebalanceThreshold.value}
              </div>}
          </Col>
          <Col sm={7} className={classes.detail}>
            <p>TBC</p>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const renderHedge = properties => {
  const { hedgeFx, hedgeFxEnabled } = properties.fields

  return (
    <div className={classes.section}>
      <div className={classes.status}>
        <Checkbox {...hedgeFxEnabled} />
      </div>
      <div className={classes.data}>
        <Row>
          <Col sm={5} className={classes.attribute}>
            <h5 className={classes.name}>Hedge FX Exposure</h5>
            <div className={classes.value}>
              Turn {hedgeFx.value ? 'on' : 'off'}
            </div>
          </Col>
          <Col sm={7} className={classes.detail}>
            <p>TBC</p>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const renderConstraints = (properties, comparisons, features) =>
  <div className={classes.section}>
    <div className={classes.status}>
      <Checkbox {...properties.fields.constraintsEnabled} />
    </div>
    <div className={classes.data}>
      <Row>
        <Col sm={5} className={classes.attribute}>
          <h5 className={classes.name}>Portfolio Constraints</h5>
          {mapIndexed(({ comparison, configured_val, feature }, index) =>
            <div key={index} className={classes.value}>
              {getComparisonName(comparison, comparisons)}&nbsp;
              <FormattedNumber value={configured_val.value}
                format='percent' />&nbsp;
              {getFeatureName(feature, features)}
            </div>
          , properties.fields.constraints)}
        </Col>
        <Col sm={7} className={classes.detail}>
          <p>TBC</p>
        </Col>
      </Row>
    </div>
  </div>

const tooltipDeposit =
  <Tooltip id='tooltipDeposit'>
    The amount entered will be automatically deposited into this goal at
    the frequency you select, starting on the day you select.
  </Tooltip>

const renderMonthlyDeposit = ({ fields: { monthlyTransactionAmount,
  monthlyDepositDayOfMonth, monthlyDepositEnabled } }) =>
  <div className={classes.section}>
    <div className={classes.status}>
      <Checkbox {...monthlyDepositEnabled} />
    </div>
    <div className={classes.data}>
      <Row>
        <Col sm={5} className={classes.attribute}>
          <h5 className={classes.name}>Monthly Auto Deposit</h5>
          <div className={classes.value}>
            <FormattedNumber value={monthlyTransactionAmount.value}
              format='currency' />
          </div>
        </Col>
        <Col sm={7} className={classes.detail}>
          <Form horizontal className='form-horizontal'>
            <FormGroup controlId='monthlyTransactionAmount'>
              <Col xs={6} componentClass={ControlLabel}>
                <span>1. Deposit
                  <OverlayTrigger placement='bottom'
                    overlay={tooltipDeposit}>
                    <span className={classes.tooltipIcon}>
                      <MdHelp size='18' />
                    </span>
                  </OverlayTrigger>
                </span>
              </Col>
              <Col xs={6}>
                <CurrencyInput {...monthlyTransactionAmount} />
              </Col>
            </FormGroup>
            <FormGroup controlId='monthlyDepositDay'>
              <Col xs={6} componentClass={ControlLabel}>
                2. Choose a day
              </Col>
              <Col xs={6}>
                <FormControl type='number' min='1' max='30'
                  {...monthlyDepositDayOfMonth} />
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </div>
  </div>

renderMonthlyDeposit.propTypes = {
  fields: PropTypes.object
}

const renderDuration = ({ fields: { durationEnabled, duration } }) => {
  const finalDuration = prettyDuration(duration.value)

  return (
    <div className={classes.section}>
      <div className={classes.status}>
        <Checkbox {...durationEnabled} />
      </div>
      <div className={classes.data}>
        <Row>
          <Col sm={5} className={classes.attribute}>
            <h5 className={classes.name}>Time</h5>
            <div className={classes.value}>{finalDuration}</div>
          </Col>
          <Col xs={7}>
            You may need this money in {finalDuration}.
          </Col>
        </Row>
      </div>
    </div>
  )
}

renderDuration.propTypes = {
  fields: PropTypes.object
}

class ConfirmGoalSettingsModal extends Component {
  static propTypes = {
    account: PropTypes.object,
    accountId: PropTypes.string,
    calculatedPortfolio: PropTypes.object,
    comparisons: PropTypes.array,
    features: PropTypes.array,
    fields: PropTypes.object,
    goalId: PropTypes.number,
    handleHide: PropTypes.func.isRequired,
    makeOneTimeDeposit: PropTypes.func,
    saveSettings: PropTypes.func,
    settings: PropTypes.object,
    user: PropTypes.object,
    values: PropTypes.object,
    viewedSettings: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['comparisons', 'features', 'fields', 'goalId',
      'settings', 'show', 'user'], this.props, nextProps)
  }

  save = () => {
    const { props } = this
    const { calculatedPortfolio, fields,
      saveSettings, settings, values, viewedSettings } = props
    const pick = R.filter(R.compose(R.not, R.isNil), [
      fields.duration.dirty && fields.durationEnabled.value
        ? 'completion' : null,
      fields.constraintsEnabled.value ? 'metric_group' : null,
      fields.monthlyTransactionAmount.dirty && fields.monthlyDepositEnabled.value
        ? 'recurring_transactions' : null,
      fields.duration.dirty && fields.durationEnabled.value
        ? 'completion' : null,
      fields.rebalance.dirty && fields.rebalanceEnabled.value
        ? 'rebalance' : null,
      fields.hedgeFx.dirty && fields.hedgeFxEnabled.value ? 'hedge_fx' : null,
      'event_memo'
    ])
    const body = R.merge(
      serializeSettings({ settings, values, viewedSettings }, pick),
      { portfolio: calculatedPortfolio }
    )

    saveSettings({ body })
  }

  render () {
    const { props } = this
    const { account, comparisons, features, fields, handleHide, show,
      user: { advisor } } = props
    const advisorName = getAdvisorName(props)

    return (
      <Modal animation={false} show={show} onHide={handleHide}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={classes.advisorWarning}>
            <h3>Have you talked to your advisor?</h3>
            {account.supervised
              ? <p>
                Changing your goal settings may have an impact on your financial
                plan. Your requested changes have been sent to your financial
                advisor for approval.
              </p>
              : <p>
                Changing your goal settings may have an impact on your financial
                plan. Please speak to your financial advisor to discuss these
                changes and how they may effect your financial situation. The
                below changes will be activated without review when your
                account is next processed (occurs daily).
              </p>}
            <div className={classes.advisorInfo}>
              <span>{advisorName}</span>
              {advisor && advisor.work_phone &&
                <span>{advisor.work_phone}</span>}
              {advisor && advisor.email &&
                <span>
                  <a href={'mailto:' + advisor.email}>{advisor.email}</a>
                </span>}
            </div>
          </div>
          {fields &&
            <div>
              {fields.risk.dirty && renderRisk(props)}
              {(fields.rebalance.dirty || fields.rebalanceThreshold.dirty) &&
                renderRebalance(props)}
              {fields.hedgeFx.dirty && renderHedge(props)}
              {hasDirtyConstraint(props) &&
                renderConstraints(props, comparisons, features)}
              {fields.monthlyTransactionAmount.dirty &&
                renderMonthlyDeposit(props)}
              {fields.duration.dirty && renderDuration(props)}
              <form className={classes.section}>
                <FormGroup controlId='formControlsTextarea'>
                  <FormControl componentClass='textarea'
                    placeholder='Enter a note for these changes'
                    {...fields.eventMemo} />
                </FormGroup>
              </form>
            </div>}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.save}>
            Confirm All Changes
          </Button>
          <Button onClick={handleHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const requests = ({ accountId, goalId, handleHide }) => ({
  account: ({ findOne }) => findOne({
    type: 'accounts',
    id: accountId
  }),
  comparisons: ({ findAll }) => findAll({
    type: 'comparisons',
    url: '/settings/constraint_comparisons'
  }),
  features: ({ findAll }) => findAll({
    type: 'assetsFeatures',
    url: '/settings/asset-features'
  }),
  saveSettings: ({ update }) => update({
    type: 'settings',
    id: goalId,
    url: `/goals/${goalId}/selected-settings`,
    success: handleHide
  }),
  user: getProfile
})

const selector = (state, { values }) => ({
  calculatedPortfolio: calculatedPortfolio(values)(state)
})

export default R.compose(
  connectModal({ name: 'confirmGoalSettings' }),
  reduxForm({
    form: 'allocation',
    fields: schema.fields
  }),
  connect(requests, selector)
)(ConfirmGoalSettingsModal)
