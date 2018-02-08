import React, { Component, PropTypes } from 'react'
import { connect } from 'redux/api'
import { reduxForm } from 'redux-form'
import { show } from 'redux-modal'
import R from 'ramda'
import { goTo } from 'redux/modules/router'
import { mapIndexed } from 'helpers/pureFunctions'
import Question from './Question/Question'
import Welcome from './Welcome/Welcome'

const getAccount = ({ params: { accountId }, accounts }) =>
  R.find(R.propEq('id', parseInt(accountId, 10)), accounts)

const getAccountRiskProfileGroupId = R.compose(
  R.prop('risk_profile_group'),
  R.defaultTo({}),
  getAccount
)

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

const getAnswers = (props) => {
  const account = getAccount(props)
  const questions = getQuestions(props)
  return account && mapIndexed((question, index) =>
    account.risk_profile_responses[index]
  , questions)
}

const getQuestionIndex = R.compose(
  R.flip(parseInt)(10),
  R.defaultTo(0),
  R.path(['params', 'questionIndex'])
)

const goToQuestion = (props, move) => {
  const { params: { accountId, clientId }, goTo } = props
  return goTo(`/${clientId}/account/${accountId}/risk-profile-wizard/
    ${getQuestionIndex(props) + move}`)
}

const previous = (props) => goToQuestion(props, -1)
const next = (props) => goToQuestion(props, 1)

class RiskProfileWizard extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    fields: PropTypes.object,
    goTo: PropTypes.func,
    handleSubmit: PropTypes.func,
    initializeForm: PropTypes.func,
    params: PropTypes.object,
    save: PropTypes.func,
    show: PropTypes.func,
    values: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.save = this.save.bind(this)
  }

  componentWillMount () {
    this.props.show('welcomeAccount')
  }

  save () {
    const { goTo, initializeForm, params: { accountId, clientId }, save,
      values: { answers } } = this.props
    const body = { risk_profile_responses: answers }
    save({
      body,
      success: ({ value: { risk_profile_responses } }) => {
        initializeForm({ answers: risk_profile_responses })
        goTo(`/${clientId}/account/${accountId}`)
      }
    })
  }

  render () {
    const { props } = this
    const { fields: { answers }, handleSubmit, params } = this.props
    const questionIndex = getQuestionIndex(props)
    const questions = getQuestions(props)
    const question = questions[questionIndex]
    const field = answers[questionIndex]
    const isFirst = R.equals(questionIndex, 0)
    const isLast = R.equals(questionIndex, R.length(questions) - 1)

    return (
      <div className='page'>
        <div className='container'>
          <div className='panel'>
            <div className='panel-heading'>
              <div className='panel-title'>
                Risk Profile ({questionIndex + 1}/{R.length(questions)})
              </div>
            </div>
            <div className='panel-body'>
              {field && question &&
                <Question field={field} index={questionIndex}
                  isFirst={isFirst} isLast={isLast}
                  next={function () { next(props) }}
                  onSubmit={handleSubmit(this.save)}
                  previous={function () { previous(props) }}
                  question={question}
                  save={this.save} />}
            </div>
          </div>
        </div>
        <Welcome {...params} />
      </div>
    )
  }
}

const requests = ({ answers, params: { accountId, clientId } }) => ({
  accounts: clientId && (({ findAll }) => findAll({
    type: 'accounts',
    url: clientId === 'me' ? '/accounts' : `/clients/${clientId}/accounts`
  })),
  riskProfileGroups: ({ findAll }) => findAll({
    type: 'riskProfileGroups',
    url: '/settings/risk-profile-groups'
  }),
  save: ({ update }) => update({
    type: 'accounts',
    url: `/accounts/${accountId}`
  })
})

const actions = {
  goTo,
  show
}

export default R.compose(
  connect(requests, null, actions),
  reduxForm({
    form: 'riskProfile',
    fields: ['answers[]']
  }, (state, props) => ({
    initialValues: { answers: getAnswers(props) }
  }))
)(RiskProfileWizard)
