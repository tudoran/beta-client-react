import React, { Component, PropTypes } from 'react'
import { Col, MenuItem, Panel, Row } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'
import { reduxForm, propTypes } from 'redux-form'
import { show } from 'redux-modal'
import R from 'ramda'
import { allocation } from 'redux/selectors'
import { connect } from 'redux/api'
import { deserializeSettings, getConstraints, getDriftScore, getTarget, getValidConstraints,
  serializeSettings } from './helpers'
import { findOne } from 'redux/api/modules/requests'
import { getProfile } from 'redux/modules/auth'
import { goTo, replace } from 'redux/modules/router'
import { propsChanged } from 'helpers/pureFunctions'
import { deleteExperimentalSettings, set as setAllocationVar, setExperimentalSettings,
  toggle } from 'redux/modules/allocation'
import { set as setGoalsVar } from 'redux/modules/goals'
import AllCaps from 'components/AllCaps'
import AutoDepositButton from 'components/AutoDepositButton'
import CalculatePortfolio from './CalculatePortfolio/CalculatePortfolio'
import classes from './Allocation.scss'
import ConfirmGoalSettingsModal from './ConfirmGoalSettingsModal/ConfirmGoalSettingsModal'
import Constraints from './Constraints/Constraints'
import CreateGoalSuccessModal from './CreateGoalSuccessModal/CreateGoalSuccessModal'
import Duration from './Duration/Duration'
import GoalActions from 'components/GoalActions/GoalActions'
import GoalBalance from 'components/GoalBalance'
import GoalNavigation from 'components/GoalNavigation'
import GoalTargetContainer from 'containers/GoalTargetContainer'
import Hedge from './Hedge/Hedge'
import InfoBar from './InfoBar/InfoBar'
import InlineList from 'components/InlineList'
import MonthlyDeposit from './MonthlyDeposit/MonthlyDeposit'
import OneTimeDeposit from './OneTimeDeposit/OneTimeDeposit'
import oneTimeDepositSchema from 'schemas/oneTimeDeposit'
import PieChart from './PieChart/PieChart'
import ProjectionGraph from './ProjectionGraph/ProjectionGraph'
import Rebalance from 'containers/Rebalance/Rebalance'
import RecommendedValues from './RecommendedValues/RecommendedValues'
import Risk from './Risk/Risk'
import RiskDescription from 'containers/RiskDescription/RiskDescription'
import schema from 'schemas/allocation'
import Text from 'components/Text'
import TrackButton from 'components/TrackButton'

const getSettings = (_props) =>
  isViewingExperimentalSettings(_props)
    ? getExperimentalSettings(_props)
    : _props.settings || _props.goal.selected_settings

const isViewingExperimentalSettings = R.compose(
  R.equals('experimental_settings'),
  R.path(['params', 'viewedSettings'])
)

const getExperimentalSettings = ({ allocationState, params: { goalId } }) =>
  R.path([parseInt(goalId, 10), 'experimentalSettings'], allocationState)

const numberOfConstraintsChanged = (settings, validConstraints) =>
  !R.equals(
    R.length(getConstraints(settings)),
    R.length(validConstraints)
  )

const metricChanged = metric =>
  metric.comparison.dirty || metric.feature.dirty || metric.configured_val.dirty

const metricsChanged = (props) => {
  const { fields, settings, values } = props
  const validConstraints = getValidConstraints(values.constraints)
  return (numberOfConstraintsChanged(settings, validConstraints)) ||
    fields.risk.dirty || R.any(metricChanged, fields.constraints)
}

// const isDirty = ({ dirty, settings }, validConstraints) =>
//   R.or(dirty, numberOfConstraintsChanged(settings, validConstraints))

const header = (_props, validConstraints) => {
  const { approve, deleteExperimentalSettings, goal, goal: { id, target }, goals, goTo, resetForm,
    params, params: { accountId, clientId, goalId, viewedSettings }, replace, revert,
    setGoalsVar, show, user } = _props

  return (
    <div>
      <Row>
        <Col xs={3}>
          <GoalNavigation goals={goals} onSelect={function (goal) {
            goTo(`/${clientId}/account/${accountId}/goal/${goal.id}/allocation`)
          }} selectedGoalId={goalId}>
            <MenuItem key='retiresmartz' onClick={function () {
                goTo(`/${clientId}/account/${accountId}/retiresmartz/setup`)
            }}>
              RetireSmartz
            </MenuItem>
            <MenuItem key='addGoal' onClick={function () {
              show('createGoal', { saveButtonLabel: 'Add Goal' })
            }}>
              Add Goal
            </MenuItem>
          </GoalNavigation>
        </Col>
        <Col xs={2}>
          <AllCaps tagName='div' value='Balance' />
          <Text size='large'>
            <GoalBalance goal={goal} />
          </Text>
        </Col>
        <Col xs={2}>
          <AllCaps tagName='div' value='Target' />
          <Text size='large'>
            <GoalTargetContainer goal={goal} />
          </Text>
        </Col>
        <Col xs={5} className='text-right'>
          <InlineList>
            <AutoDepositButton goal={goal}
              onClick={function () { show('autoTransaction', { goal }) }} />
            <TrackButton goal={goal} />
            <GoalActions goal={goal} showEditNameAction={false} show={show}
              editTarget={function () { setGoalsVar({ id, target, isEditingTarget: true }) }} />
          </InlineList>
        </Col>
      </Row>
      <InfoBar approve={approve} deleteExperimentalSettings={deleteExperimentalSettings}
        goal={goal} params={params} replace={replace} resetForm={resetForm} revert={revert}
        show={show} user={user} viewedSettings={viewedSettings} />
    </div>
  )
}

class Allocation extends Component {
  static propTypes = {
    ...propTypes,
    allocationState: PropTypes.object,
    approve: PropTypes.func,
    deleteExperimentalSettings: PropTypes.func,
    goal: PropTypes.object,
    goals: PropTypes.array,
    goTo: PropTypes.func,
    oneTimeDepositForm: PropTypes.object,
    params: PropTypes.object,
    performance: PropTypes.object,
    revert: PropTypes.func,
    setAllocationVar: PropTypes.func,
    setGoalsVar: PropTypes.func,
    setExperimentalSettings: PropTypes.func,
    settings: PropTypes.object,
    show: PropTypes.func,
    toggle: PropTypes.func,
    user: PropTypes.object,
    values: PropTypes.object
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['allocationState', 'dirty', 'errors', 'fields',
      'goal', 'params', 'performance', 'settings', 'user',
      'values'], this.props, nextProps) ||
      propsChanged(['values'], this.props.oneTimeDepositForm,
        nextProps.oneTimeDepositForm)
  }

  componentWillReceiveProps (nextProps) {
    const { dirty, goal, params: { accountId, clientId, goalId, viewedSettings },
      replace, setExperimentalSettings, values } = nextProps
    const settings = goal && getSettings(nextProps)
    if (settings && dirty &&
      !R.equals(this.props.viewedSettings, viewedSettings) &&
      propsChanged(['values'], this.props, nextProps)) {
      setExperimentalSettings({
        id: goalId,
        experimentalSettings: serializeSettings({ settings, values })
      })

      if (!isViewingExperimentalSettings(nextProps)) {
        replace(`/${clientId}/account/${accountId}/goal/${goalId}/allocation/experimental_settings`)
      }
    }
  }

  removeConstraint = (constraint) => {
    const { constraints } = this.props.fields
    constraints.removeField(R.findIndex(R.equals(constraint), constraints))
  }

  toggleConstraint = (id) => {
    const { toggle } = this.props
    toggle({ id, prop: 'isOpened' })
  }

  render () {
    const { props } = this
    const { allocationState, fields, fields: { constraints, duration, hedgeFx,
      monthlyTransactionAmount, performance, risk }, goal, oneTimeDepositForm,
      params: { accountId, goalId, viewedSettings }, setAllocationVar, values } = props
    const settings = goal && getSettings(props)
    const { fields: { amount } } = oneTimeDepositForm
    const currentYears = Math.floor(duration ? duration.value / 12 : 0)
    const validConstraints = getValidConstraints(values.constraints)
    const portfolio = metricsChanged(props)
      ? null
      : (goal && goal[viewedSettings] && goal[viewedSettings].portfolio &&
        R.merge(goal[viewedSettings].portfolio, performance))
    const target = settings && getTarget(settings)
    const finalValues = R.merge(
      values,
      { oneTimeDeposit: oneTimeDepositForm.values.amount }
    )

    return (
      <div className='container'>
        <Panel header={goal && header(this.props, validConstraints)}
          className={classes.allocationPanel}>
          <Row>
            <Col sm={3} className={classes.sidebar}>
              <div className={classes.sidebarControl}>
                {finalValues.risk &&
                  <Risk goalId={goalId} risk={risk} settings={settings}
                    years={currentYears} />}
              </div>
              <div className={classes.riskDescriptionWrapper}>
                <div className={classes.riskDescriptionLabel}>Risk</div>
                <div className={classes.riskDescription}>
                  {R.is(Number, values.risk) &&
                    <RiskDescription goalId={goalId} risk={finalValues.risk}
                      years={currentYears} />}
                </div>
              </div>
              <div className={classes.pieChartWrapper}>
                {goal && <PieChart balance={goal.balance} goalId={goalId}
                  portfolio={portfolio} values={finalValues} />}
              </div>
              {goal && <Rebalance
                driftScore={getDriftScore(goal)}
                fields={R.pick(['rebalance', 'rebalanceThreshold'], fields)}
                values={R.pick(['rebalance', 'rebalanceThreshold'], finalValues)} />}
              {goal && <Hedge hedgeFx={hedgeFx} />}
              <Constraints
                addConstraint={constraints.addField}
                constraints={constraints}
                constraintsOpened={allocationState}
                constraintsValues={finalValues.constraints}
                removeConstraint={this.removeConstraint}
                toggleConstraint={this.toggleConstraint} />
            </Col>
            <Col sm={9} className={classes.mainContent}>
              <Row className={classes.settingsRow}>
                <Col xs={4}>
                  <MonthlyDeposit monthlyTransactionAmount={monthlyTransactionAmount}
                    settings={settings} />
                </Col>
                <Col xs={4}>
                  <OneTimeDeposit goal={goal} />
                </Col>
                <Col xs={4}>
                  {finalValues.duration &&
                    <Duration duration={duration} settings={settings} />}
                </Col>
              </Row>
              <RecommendedValues values={finalValues} balance={goal && goal.balance}
                portfolio={portfolio}
                setDuration={duration.onChange}
                setMonthlyTransactionAmount={monthlyTransactionAmount.onChange}
                setOneTimeDeposit={amount.onChange}
                target={target} />
              <Row className={classes.main}>
                {goal && settings && <Col xs={12}>
                  <ProjectionGraph values={finalValues} portfolio={portfolio}
                    balance={goal.balance} set={setAllocationVar} target={target}>
                    <CalculatePortfolio portfolio={portfolio} settings={settings}
                      values={R.merge(finalValues, { constraints: validConstraints })}
                      viewedSettings={viewedSettings} />
                  </ProjectionGraph>
                </Col>}
              </Row>
            </Col>
          </Row>
        </Panel>
        {goal && settings &&
          <div>
            <ConfirmGoalSettingsModal accountId={accountId} goalId={goalId}
              settings={settings} viewedSettings={viewedSettings} />
            <CreateGoalSuccessModal goal={goal} values={finalValues} />
          </div>}
      </div>
    )
  }
}

const requests = ({ goal, params, params: { accountId, goalId, viewedSettings } }) => ({
  approve: ({ update }) => update({
    type: 'goals',
    id: goalId,
    url: `/goals/${goalId}/approve-selected`,
    success: () => findOne({
      type: 'goals',
      id: goalId,
      force: true
    })
  }),
  goal: goalId && (({ findOne }) => findOne({ type: 'goals', id: goalId })),
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  }),
  performance: goal &&
    goal[viewedSettings] &&
    goal[viewedSettings].portfolio && (({ findQuery }) =>
    findQuery({
      type: 'calculatedPerformance',
      url: `/goals/${goalId}/calculate-performance`,
      query: {
        items: R.compose(
          value => JSON.stringify(value),
          R.reduce((acc, { asset, weight }) =>
            R.append([asset, weight], acc), [])
        )(goal[viewedSettings].portfolio.items)
      }
    })),
  revert: ({ update }) => update({
    type: 'goals',
    id: goalId,
    url: `/goals/${goalId}/revert-selected`,
    success: () => findOne({
      type: 'goals',
      id: goalId,
      force: true
    })
  }),
  settings: !isViewingExperimentalSettings({ params }) && goalId &&
    (({ findSingleByURL }) => findSingleByURL({
      type: 'settings',
      url: `/goals/${goalId}/${R.replace('_', '-', viewedSettings)}`
    })),
  user: getProfile
})

const selector = createStructuredSelector({
  allocationState: allocation
})

const actions = {
  deleteExperimentalSettings,
  goTo,
  replace,
  setAllocationVar,
  setExperimentalSettings,
  setGoalsVar,
  show,
  toggle
}

export default R.compose(
  connect(requests, selector, actions),
  reduxForm({
    form: 'oneTimeDeposit',
    propNamespace: 'oneTimeDepositForm',
    ...oneTimeDepositSchema
  }),
  reduxForm({
    form: 'allocation',
    ...schema
  }, (state, props) => ({
    initialValues: props.goal && R.merge(
      deserializeSettings(getSettings(props)),
      { goalId: props.goal.id }
    )
  }))
)(Allocation)
