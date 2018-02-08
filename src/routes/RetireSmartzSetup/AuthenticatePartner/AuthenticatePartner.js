import React, { Component, PropTypes } from 'react'
import { Col, Row, Button, FormGroup, ControlLabel, FormControl }
  from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { show } from 'redux-modal'
import R from 'ramda'
import { connect } from 'redux/api'
import { createStructuredSelector } from 'reselect'
import { goTo } from 'redux/modules/router'
import { isPartnerAuthenticatedSelector } from 'redux/selectors'
import classes from './AuthenticatePartner.scss'
import CreateClientModal from '../CreateClientModal/CreateClientModal'
import FieldError from 'components/FieldError/FieldError'
import PartnerPasswordModal from './PartnerPasswordModal'

const validate = values => {
  const errors = {}
  if (!values.email) {
    errors.email = ['Partner\'s email is required.']
  }
  return errors
}

export class AuthenticatePartner extends Component {
  static propTypes = {
    goals: PropTypes.array,
    goTo: PropTypes.func,
    show: PropTypes.func,
    params: PropTypes.object,
    fields: PropTypes.object,
    retiresmartz: PropTypes.object,
    isPartnerAuthenticated: PropTypes.bool
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  componentWillMount () {
    this.checkForRedirect(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.checkForRedirect(nextProps)
  }

  checkForRedirect (props) {
    const { goTo } = this.props
    const { accountId, clientId } = this.context
    if (props.isPartnerAuthenticated) {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1-partners-retirement-plan`)
    }
  }

  get currentGoalId () {
    const { params: { goalId }, goals } = this.props
    const firstGoal = R.head(goals)
    return goalId || (firstGoal && firstGoal.id)
  }

  handleAuthenticateClick = () => {
    const { fields, show } = this.props
    fields.email.valid && show('partnerPasswordModal')
  }

  handleKeyDown = (event) => {
    const { fields, show } = this.props
    event.keyCode === 13 && fields.email.valid && show('partnerPasswordModal')
  }

  render () {
    const { goTo, show, fields } = this.props
    const { accountId, clientId } = this.context
    return (
      <div className={classes.content}>
        <Row className={classes.contentRow}>
          <Col xs={10} xsOffset={1} className={classes.apContent}>
            <h3>Select your partner's corresponding retirement plan</h3>
            <p className={classes.apDescription}>
              To link your plan to your partner, you first need to access your partner's
              betasmartz account. If your partner is already has a Betasmartz account,
              enter their login email address and authenticate, otherwise you will need to
              create a new account for them.
            </p>
            <div className={`form-horizontal ${classes.emailForm}`}>
              <FormGroup controlId='AP_Email'>
                <Col componentClass={ControlLabel} sm={6} className={classes.textColor}>
                  Enter your partner's login email:
                </Col>
                <Col sm={6}>
                  <FormControl type='email' {...fields.email}
                    onKeyDown={this.handleKeyDown}
                    placeholder='partner@email.com' />
                  <FieldError for={fields.email} />
                </Col>
              </FormGroup>
            </div>
            <Row>
              <Col sm={12} className='text-center'>
                <Button bsStyle='default'
                  onClick={function () {
                    goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1`)
                  }}>
                  Back
                </Button>
                {' '}
                <Button bsStyle='primary'
                  disabled={fields.email.invalid}
                  onClick={this.handleAuthenticateClick}>
                  Authenticate
                </Button>
                {' '}
                <Button bsStyle='default'
                  onClick={function () { show('createClientModal') }}>
                  Create Account
                </Button>
              </Col>
            </Row>
            <PartnerPasswordModal />
            <CreateClientModal />
          </Col>
        </Row>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  isPartnerAuthenticated: isPartnerAuthenticatedSelector
})

const actions = {
  goTo,
  show
}

export default R.compose(
  reduxForm({
    form: 'partnerLogin',
    fields: ['email', 'password'],
    validate
  }),
  connect(null, selector, actions)
)(AuthenticatePartner)
