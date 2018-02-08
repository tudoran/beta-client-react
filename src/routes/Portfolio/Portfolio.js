import React, { Component, PropTypes } from 'react'
import { Col, Row, MenuItem, Panel } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'
import { replace, goTo } from 'redux/modules/router'
import { show } from 'redux-modal'
import R from 'ramda'
import { addQuestions } from 'redux/modules/portfolio'
import { connect } from 'redux/api'
import { findQuerySelector } from 'redux/api/selectors'
import { MdChevronRight } from 'helpers/icons'
import { questions, isAuthenticatedSelector } from 'redux/selectors'
import { set } from 'redux/modules/goals'
import AllCaps from 'components/AllCaps'
import AutoDepositButton from 'components/AutoDepositButton'
import aggregateSelectedPortfolio from 'helpers/aggregateSelectedPortfolio'
import GoalActions from 'components/GoalActions'
import GoalBalance from 'components/GoalBalance'
import GoalNavigation from 'components/GoalNavigation'
import GoalTargetContainer from 'containers/GoalTargetContainer'
import InlineList from 'components/InlineList'
import PortfolioDiagramBlock from './PortfolioDiagramBlock/PortfolioDiagramBlock'
import PortfolioQuestions from './PortfolioQuestions/PortfolioQuestions'
import PortfolioHoldingList from './components/PortfolioHoldingList'
import questionPayload from './questionPayload'
import Spinner from 'components/Spinner/Spinner'
import TaxEfficiencyModal from './TaxEfficiencyModal/TaxEfficiencyModal'
import Button from 'components/Button'
import Text from 'components/Text'
import TrackButton from 'components/TrackButton'
import WhyThisETFModal from './WhyThisETFModal/WhyThisETFModal'
import WhyThisPortfolioModal from './WhyThisPortfolioModal/WhyThisPortfolioModal'
import classes from './Portfolio.scss'

const header = (_props, portfolioInstance) => {
  const { goal, goals, goTo, params: { accountId, clientId, goalId }, set } = _props
  const id = goal && goal.id
  const target = goal && goal.target

  let activeTargetContent = [
    <AllCaps key='title' tagName='div' value='View' />,
    <Text key='text' size='large'>Active Allocations</Text>
  ]

  if (goal.selected_settings.portfolio) {
    const showActive = portfolioInstance.state
      ? portfolioInstance.state.showActive : true
    let activeAttrs = { className: classes.wide }
    let targetAttrs = { className: classes.wide }
    if (showActive) {
      activeAttrs.bsStyle = 'primary'
    } else {
      targetAttrs.bsStyle = 'primary'
    }

    activeTargetContent = [
      <AllCaps key='title' tagName='div' value='View' />,
      <Button key='active' {...activeAttrs} onClick={() => {
          portfolioInstance.setState({ showActive: true })
        }}>Active</Button>,
      <Button key='target' {...targetAttrs} onClick={() => {
          portfolioInstance.setState({ showActive: false })
        }}>Target</Button>
    ]
  }

  return (
    <Row>
      <Col xs={12}>
        <Row className={classes.headerRow}>
          <Col xs={3}>
            <AllCaps tagName='div' value='Goal' />
            <GoalNavigation goals={goals} onSelect={function (goal) {
              portfolioInstance.setState({ showActive: true })
              goTo(`/${clientId}/account/${accountId}/goal/${goal.id}/portfolio`)
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
          <Col xs={4}>
            {activeTargetContent}
          </Col>
          <Col xs={5} className='text-right'>
            <Button className={classes.btnModifyGoal} onClick={function () {
              goTo(`/${clientId}/account/${accountId}/goal/${goalId}/allocation`)
            }}>
              Modify goal <MdChevronRight />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={3} />
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
                editTarget={function () { set({ id, target, isEditingTarget: true }) }} />
            </InlineList>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

class Portfolio extends Component {
  static propTypes = {
    addQuestions: PropTypes.func,
    assetsClasses: PropTypes.array,
    goal: PropTypes.object,
    goals: PropTypes.array,
    goTo: PropTypes.func,
    params: PropTypes.object,
    positions: PropTypes.array,
    questions: PropTypes.array,
    replace: PropTypes.func,
    requests: PropTypes.object,
    selectedPortfolio: PropTypes.object,
    set: PropTypes.func,
    show: PropTypes.func,
    tickers: PropTypes.array
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  componentWillMount () {
    this.props.addQuestions(questionPayload)
  }

  render () {
    const showActive = this.state ? this.state.showActive : true
    const { intl: { formatNumber } } = this.context
    const { goal, selectedPortfolio, assetsClasses, tickers, positions,
      questions, requests, params: { goalId }, show } = this.props
    const aggregatedPortfolio = aggregateSelectedPortfolio({ assetsClasses,
      balance: goal && goal.balance, formatNumber, positions: (showActive ? positions : []),
      selectedPortfolio: (!showActive ? selectedPortfolio : {}), tickers })
    const isPending = R.any(
      R.propEq('status', 'pending'),
      R.compose(R.reject(R.isNil), R.values)(requests)
    )
    return (
      <div className='container'>
        <Panel header={goal && header(this.props, this)}>
          <Row>
            <Col xs={3}>
              <PortfolioDiagramBlock goal={goal} goalId={goalId}
                isPending={isPending} selectedPortfolio={aggregatedPortfolio} />
            </Col>
            <Col xs={9}>
              {isPending
                ? <Spinner />
                : <div>
                  <PortfolioHoldingList goal={goal} holdings={aggregatedPortfolio} />
                  <PortfolioQuestions questions={questions} show={show} />
                </div>}
            </Col>
          </Row>
        </Panel>
        <TaxEfficiencyModal />
        <WhyThisETFModal />
        <WhyThisPortfolioModal />
      </div>
    )
  }
}

const requests = props => {
  const { params: { accountId, goalId } } = props
  const queries = {
    goals: ({ findQuery }) => findQuery({
      type: 'goals',
      url: `/accounts/${accountId}/goals`,
      query: {
        account: parseInt(accountId, 10)
      }
    }),
    assetsClasses: ({ findAll }) => findAll({
      type: 'assetsClasses',
      url: '/settings/asset-classes'
    }),
    tickers: ({ findAll }) => findAll({
      type: 'tickers',
      url: '/settings/tickers'
    })
  }

  return goalId ? R.merge(queries, {
    goal: ({ findOne }) => findOne({ type: 'goals', id: goalId }),
    positions: ({ findAll }) => findAll({
      type: 'positions',
      url: `/goals/${goalId}/positions`,
      selector: findQuerySelector({
        type: 'positions',
        query: { goal: parseInt(goalId, 10) }
      })
    }),
    selectedPortfolio: ({ findSingleByURL }) => findSingleByURL({
      type: 'selectedPortfolio',
      url: `/goals/${goalId}/selected-portfolio`
    })
  }) : queries
}

const selector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector,
  questions
})

const actions = {
  goTo,
  replace,
  addQuestions,
  set,
  show
}

export default R.compose(
  connect(requests, selector, actions)
)(Portfolio)
