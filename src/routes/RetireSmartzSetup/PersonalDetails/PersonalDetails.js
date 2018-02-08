import React, { Component, PropTypes } from 'react'
import { Col, Row, Collapse, Button } from 'react-bootstrap'
import { MdPerson, MdPeople } from 'helpers/icons'
import { goTo } from 'redux/modules/router'
import { set } from 'redux/modules/retiresmartz'
import R from 'ramda'
import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import PersonalInfoBox from '../PersonalInfoBox/PersonalInfoBox'
import classes from './PersonalDetails.scss'

export class PersonalDetails extends Component {
  static propTypes = {
    goals: PropTypes.array,
    goTo: PropTypes.func,
    set: PropTypes.func,
    params: PropTypes.object,
    retiresmartz: PropTypes.object,
    user: PropTypes.object
  };

  componentWillMount () {
    const { set, user } = this.props
    user && user.civil_status && set({married: true})
  }

  get currentGoalId () {
    const { params: { goalId }, goals } = this.props
    const firstGoal = R.head(goals)
    return goalId || (firstGoal && firstGoal.id)
  }

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleSaveContiune = () => {
    const { goTo, retiresmartz: { planTogether } } = this.props
    const { accountId, clientId } = this.context
    if (planTogether) {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1-authenticate-partner`)
    } else {
      goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/2`)
    }
  }

  render () {
    const { goTo, set, user, retiresmartz: { married, planTogether } } = this.props
    const { currentGoalId } = this
    const { accountId, clientId } = this.context

    return (
      <div className={classes.content}>
        <Row className={classes.contentRow}>
          <Col xs={4} sm={3} className={classes.bubbleContainer}>
            <PersonalInfoBox user={user} />
          </Col>
          <Col xs={8} sm={9} className={classes.question}>
            <h2>Are you married?</h2>
            <p>
              We ask this because your marital status affects your taxes,
              income, and qualification limits for Age Pension.
            </p>
            <div className={classes.inputs}>
              <div className={typeof married !== 'undefined' && !married
                ? `${classes.bubbleButton} ${classes.active}`
                : classes.bubbleButton}
                onClick={function () { set({married: false}) }}>
                <div className={classes.buttonIcon}>
                  <MdPerson size='18' />
                </div>
                <div className={classes.buttonLabel}>Not married</div>
              </div>
              <div className={married
                ? `${classes.bubbleButton} ${classes.active}`
                : classes.bubbleButton}
                onClick={function () { set({married: true}) }}>
                <div className={classes.buttonIcon}>
                  <MdPeople size='18' />
                </div>
                <div className={classes.buttonLabel}>Married</div>
              </div>
            </div>
            <Collapse in={married}>
              <div className={classes.togetherSection}>
                <h2>Would you like to plan your retirement together or personally?</h2>
                <p>
                  Planning your retirement together will provide a more accurate plan for
                  retirement given your current relationship status. If you plan together,
                  we will first gather your details, then those of your partner.
                </p>
                <div className={classes.inputs}>
                  <div className={!planTogether
                    ? `${classes.bubbleButton} ${classes.active}`
                    : classes.bubbleButton}
                    onClick={function () { set({planTogether: false}) }}>
                    <div className={classes.buttonIcon}>
                      <MdPerson size='18' />
                    </div>
                    <div className={classes.buttonLabel}>Personally</div>
                  </div>
                  <div className={planTogether
                    ? `${classes.bubbleButton} ${classes.active}`
                    : classes.bubbleButton}
                    onClick={function () { set({planTogether: true}) }}>
                    <div className={classes.buttonIcon}>
                      <MdPeople size='18' />
                    </div>
                    <div className={classes.buttonLabel}>Together</div>
                  </div>
                </div>
              </div>
            </Collapse>
          </Col>
        </Row>
        <Collapse in={typeof married !== 'undefined'}>
          <div className={classes.bottomActions}>
            <Button bsStyle='default'
              onClick={function () {
                goTo(`/${clientId}/account/${accountId}/goal/${currentGoalId}/allocation`)
              }}>
              Back
            </Button>
            {' '}
            <Button bsStyle='primary'
              onClick={this.handleSaveContiune}>
              Save and Continue
            </Button>
          </div>
        </Collapse>
      </div>
    )
  }
}

const requests = ({ params: { accountId } }) => ({
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  }),
  user: getProfile
})

const actions = {
  goTo,
  set
}

export default R.compose(
  connect(requests, null, actions)
)(PersonalDetails)
