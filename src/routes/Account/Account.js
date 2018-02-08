import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import { replace } from 'redux/modules/router'
import AccountDeposit from 'containers/AccountDeposit/AccountDeposit'
import AutoTransactionModal
  from 'containers/AutoTransactionModal/AutoTransactionModal'
import ConfirmDeleteGoalModal
  from 'containers/ConfirmDeleteGoalModal/ConfirmDeleteGoalModal'
import Nav from 'components/Nav/Nav'
import NotConfirmed from './NotConfirmed/NotConfirmed'

const getFirstActiveGoal = R.find(R.propEq('state', 0))

const getCurrentGoalId = ({ goals, params: { goalId } }) => {
  const firstActiveGoal = getFirstActiveGoal(goals)
  return goalId || (firstActiveGoal && firstActiveGoal.id)
}

const getAccountRiskProfileGroupId = R.path(['account', 'risk_profile_group'])

const getQuestions = R.compose(
  R.defaultTo([]),
  R.prop('questions'),
  R.defaultTo({}),
  R.converge(R.find, [
    R.compose(
      R.propEq('id'),
      getAccountRiskProfileGroupId
    ),
    R.prop('riskProfileGroups')
  ])
)

const getAnswers = R.compose(
  R.reduce((acc, { answers }) =>
    R.compose(
      R.concat(acc),
      R.map(R.prop('id'))
    )(answers)
  , []),
  getQuestions
)

const getResponses = R.compose(
  R.defaultTo([]),
  R.path(['account', 'risk_profile_responses'])
)

const equalSize = R.useWith(R.equals, [R.length, R.length])

const answeredQuestionnaire = (props) => {
  const { account, requests: { riskProfileGroups } } = props
  const questions = getQuestions(props)
  const responses = getResponses(props)

  // Account not loaded yet
  if (!account || !riskProfileGroups ||
    !R.equals(riskProfileGroups.status, 'fulFilled')) {
    return true
  }

  // Not yet on-boarder through Labgroup
  if (!account.confirmed) return true

  // If number of responses don't match number of questions,
  // it should re-run the questionnaire
  if (!equalSize(questions, responses)) return false

  const answers = getAnswers(props)

  // If some response is not in the list of available answers,
  // it should re-run the questionnaire
  return R.all(R.flip(R.contains)(answers), responses)
}

class Account extends Component {
  static propTypes = {
    account: PropTypes.object,
    children: PropTypes.node,
    goals: PropTypes.array,
    location: PropTypes.object,
    params: PropTypes.object,
    replace: PropTypes.func,
    requests: PropTypes.object,
    routeParams: PropTypes.object,
    show: PropTypes.func,
    user: PropTypes.object
  };

  static childContextTypes = {
    accountId: PropTypes.string
  };

  getChildContext () {
    const { accountId } = this.props.routeParams
    return { accountId }
  }

  componentWillMount () {
    this.ensureRiskProfileIsCompleted(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.ensureRiskProfileIsCompleted(nextProps)
  }

  ensureRiskProfileIsCompleted (props) {
    const { params: { clientId }, replace, routeParams: { accountId } } = props
    if (!answeredQuestionnaire(props)) {
      replace(`/${clientId}/account/${accountId}/risk-profile-wizard`)
    }
  }

  render () {
    const { props } = this
    const { account, children, location: { pathname }, params, user } = props
    const goalId = getCurrentGoalId(props)
    const finalParams = R.merge(params, { goalId })
    const confirmed = account && account.confirmed

    return confirmed
      ? (
      <div>
        <Nav {...finalParams} pathname={pathname} user={user} />
        <div className='page'>
          {children}
        </div>
        <AutoTransactionModal />
        <ConfirmDeleteGoalModal />
        <AccountDeposit account={account} />
      </div>
      )
      : account ? <NotConfirmed account={account} /> : false
  }
}

const requests = ({ routeParams: { accountId } }) => ({
  account: accountId && (({ findOne }) => findOne({
    type: 'accounts',
    id: accountId
  })),
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  }),
  riskProfileGroups: ({ findAll }) => findAll({
    type: 'riskProfileGroups',
    url: '/settings/risk-profile-groups'
  }),
  user: getProfile
})

const actions = {
  replace
}

export default connect(requests, null, actions)(Account)
