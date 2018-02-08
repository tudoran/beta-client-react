import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, FormControl,
  Grid, Row } from 'react-bootstrap'
import AdvisorPanel from '../AdvisorPanel'
import Button from 'components/Button/Button'
import ChangePasswordModal from '../../containers/ChangePasswordModalContainer'
import classes from './UserSettings.scss'
import EmailPreferencesModal from '../EmailPreferencesModal/EmailPreferencesModal'
import FinancialProfile from '../../containers/FinancialProfileContainer'
import FormGroup from '../FormGroup'
import PageTitle from 'components/PageTitle'
import PersonalProfile from '../../containers/PersonalProfileContainer'
import SectionTitle from '../SectionTitle'

export default class UserSettings extends Component {
  static propTypes = {
    refreshProfile: PropTypes.func,
    securityQuestions: PropTypes.array,
    settings: PropTypes.object,
    show: PropTypes.func,
    user: PropTypes.object
  };

  renderPersonalProfile() {
    const { settings, show, user, refreshProfile, securityQuestions } = this.props
    return (
      <div className={classes.leftCol}>
        <SectionTitle title='Personal Profile' />
        <PersonalProfile settings={settings} user={user} refreshProfile={refreshProfile} />
        <hr />
        <div className='form-horizontal'>
          <FormGroup>
            <Col xs={4} componentClass={ControlLabel}>Password</Col>
            <Col xs={4}>
              <FormControl.Static>**********</FormControl.Static>
            </Col>
            <Col xs={4} className='text-right'>
              <Button bsStyle='primary' bsSize='sm'
                onClick={function () { show('changePasswordModal') }}>
                Change
              </Button>
            </Col>
          </FormGroup>
          {securityQuestions &&
            <ChangePasswordModal backdrop='static' keyboard={false}
              securityQuestion={securityQuestions[0]} />
          }
          <FormGroup>
            <Col xs={4} componentClass={ControlLabel}>
              Email Preferences
            </Col>
            <Col xs={4}>
              <FormControl.Static>Custom</FormControl.Static>
            </Col>
            <Col xs={4} className='text-right'>
              <Button bsStyle='primary' bsSize='sm'
                onClick={function () { show('emailPreferencesModal') }}>
                Change
              </Button>
            </Col>
          </FormGroup>
          <EmailPreferencesModal backdrop='static' keyboard={false} />
        </div>
      </div>
    )
  }

  renderFinancialProfile() {
    const { settings, user, refreshProfile } = this.props
    return (
      <div className={classes.rightCol}>
        <SectionTitle title='Financial Profile' />
        <FinancialProfile settings={settings} user={user} refreshProfile={refreshProfile} />
      </div>
    )
  }

  renderAdvisorPanel() {
    const { user } = this.props
    return (
      <div className={classes.leftCol}>
        <SectionTitle title='Advisor Panel' />
        <AdvisorPanel user={user} />
      </div>
    )
  }

  render () {
    return (
      <Grid className={classes.userSettings}>
        <PageTitle title='Your Information' />
        <div className={classes.sectionWrapper}>
          <Row>
            {this.renderPersonalProfile()}
            {this.renderFinancialProfile()}
          </Row>
        </div>
        <div className={classes.sectionWrapper}>
          <Row>
            {this.renderAdvisorPanel()}
          </Row>
        </div>
      </Grid>
    )
  }
}
