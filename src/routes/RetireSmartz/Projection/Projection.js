import React, { Component, PropTypes } from 'react'
import { Col, Row, FormGroup, ControlLabel, FormControl, Glyphicon, Button }
  from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'
import { show } from 'redux-modal'
import R from 'ramda'
import { connect } from 'redux/api'
import { getProfile, getPartnerProfile } from 'redux/modules/auth'
import { goTo } from 'redux/modules/router'
import { retiresmartzSelector } from 'redux/selectors'
import { set } from 'redux/modules/retiresmartz'
import avatar0 from '../../RetireSmartzSetup/Avatars/avatar0.svg'
import avatar1 from '../../RetireSmartzSetup/Avatars/avatar1.svg'
import classes from './Projection.scss'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import EditRetirementPlanModal
  from '../../RetireSmartzSetup/EditRetirementPlanModal/EditRetirementPlanModal'
import treeImg from './tree.jpg'

export class Projection extends Component {
  static propTypes = {
    goTo: PropTypes.func,
    show: PropTypes.func,
    set: PropTypes.func,
    user: PropTypes.object,
    partner: PropTypes.object
  };

  static defaultProps = {
    user: {}
  };

  handleChange = () => {}

  render () {
    const { user, partner, show } = this.props
    return (
      <div className={classes.projectionWrapper}>
        <Row>
          <Col xs={4} md={3} className={classes.leftPane}>
            <FormGroup controlId='initialInvestment'>
              <ControlLabel className={classes.label}>
                (COMBINED) INITIAL INVESTMENT:
              </ControlLabel>
              <CurrencyInput
                value={15000}
                placeholder='$'
                onChange={this.handleChange}
              />
              <FormControl.Feedback>
                <Glyphicon glyph='cog' className={classes.customIcon} />
              </FormControl.Feedback>
            </FormGroup>
            <FormGroup controlId='annualRetirementIncome'>
              <ControlLabel className={classes.label}>
                DESIRED (COMBINED)<br />ANNUAL RETIREMENT INCOME
              </ControlLabel>
              <CurrencyInput
                value={15000}
                placeholder='$'
                onChange={this.handleChange}
              />
              <a href='javascript:;' className={classes.linkCalculated}>
                Calculated: {'$13, 312'}
              </a>
            </FormGroup>

            <div className={`${classes.clientInfoBox} ${classes.self}`}>
              <div className={classes.topSection}>
                <img className={classes.avatar}
                  src={user.avatar ? user.avatar : avatar0}
                  alt={user.first_name} />
                <div className={classes.clientName}>
                  {user.first_name}
                </div>
              </div>
              <FormGroup controlId='selfAnnualContribution'>
                <ControlLabel className={classes.smallLabel}>
                  ANNUAL CONTRIBUTION:
                </ControlLabel>
                <Row className={classes.narrowRow}>
                  <Col xs={8} className={classes.narrowCol}>
                    <div className={classes.relativeWrapper}>
                      <CurrencyInput
                        value={0}
                        placeholder='$'
                        onChange={this.handleChange}
                      />
                      <FormControl.Feedback>
                        <Glyphicon glyph='cog' className={classes.customIcon} />
                      </FormControl.Feedback>
                    </div>
                  </Col>
                  <Col xs={4} className={classes.narrowCol}>
                    <div className={classes.dangerAlert}>
                      {'Too little'}
                    </div>
                  </Col>
                </Row>
                <a href='javascript:;' className={classes.linkRecommended}>
                  Recommended: {'$13, 312'}
                </a>
              </FormGroup>
              <FormGroup controlId='selfRetirementAge' className={classes.noMarginBottom}>
                <ControlLabel className={classes.smallLabel}>
                  RETIREMENT AGE:
                </ControlLabel>
                <Row className={classes.narrowRow}>
                  <Col xs={8} className={classes.narrowCol}>
                    <div className={classes.relativeWrapper}>
                      <FormControl
                        type='number'
                        value={0}
                        placeholder='65'
                        onChange={this.handleChange}
                      />
                    </div>
                  </Col>
                  <Col xs={4} className={classes.narrowCol}>
                    <div className={classes.dangerAlert}>
                      {'Too little'}
                    </div>
                  </Col>
                </Row>
              </FormGroup>
            </div>
            {partner &&
              <div className={`${classes.clientInfoBox} ${classes.partner}`}>
                <div className={classes.topSection}>
                  <img className={classes.avatar}
                    src={partner.avatar ? partner.avatar : avatar1}
                    alt={partner.first_name} />
                  <div className={classes.clientName}>
                    {partner.first_name}
                  </div>
                </div>
                <FormGroup controlId='selfAnnualContribution'>
                  <ControlLabel className={classes.smallLabel}>
                    ANNUAL CONTRIBUTION:
                  </ControlLabel>
                  <Row className={classes.narrowRow}>
                    <Col xs={8} className={classes.narrowCol}>
                      <div className={classes.relativeWrapper}>
                        <CurrencyInput
                          value={0}
                          placeholder='$'
                          onChange={this.handleChange}
                        />
                        <FormControl.Feedback>
                          <Glyphicon glyph='cog' className={classes.customIcon} />
                        </FormControl.Feedback>
                      </div>
                    </Col>
                    <Col xs={4} className={classes.narrowCol}>
                      <div className={classes.dangerAlert}>
                        {'Too little'}
                      </div>
                    </Col>
                  </Row>
                  <a href='javascript:;' className={classes.linkRecommended}>
                    Recommended: {'$13, 312'}
                  </a>
                </FormGroup>
                <FormGroup controlId='selfRetirementAge' className={classes.noMarginBottom}>
                  <ControlLabel className={classes.smallLabel}>
                    RETIREMENT AGE:
                  </ControlLabel>
                  <Row className={classes.narrowRow}>
                    <Col xs={8} className={classes.narrowCol}>
                      <div className={classes.relativeWrapper}>
                        <FormControl
                          type='number'
                          value={0}
                          placeholder='65'
                          onChange={this.handleChange}
                        />
                      </div>
                    </Col>
                    <Col xs={4} className={classes.narrowCol}>
                      <div className={classes.dangerAlert}>
                        {'Too little'}
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
              </div>
            }
            <Button bsStyle='default' onClick={function () {
              show('editRetirementPlanModal')
            }}>Modify Plan</Button>
            <EditRetirementPlanModal />
          </Col>
          <Col xs={8} md={9} className={classes.rightPane}>
            <p className={classes.description}>
              Experiment with the retirement income and annual contributions to find
              the combination that's right for you.Increase your annual contributions
              to make your retirement money tree grow!
            </p>
            <div className={classes.rightPaneForm}>
              <div className={classes.treeBG} style={{backgroundImage: `url(${treeImg})`}} />
              <Row className={classes.vmRow}>
                <Col xs={5} className={classes.vmCol}>
                  <FormGroup controlId='rpAnnualRetirementIncome'>
                    <ControlLabel className={classes.rightPaneLabel}>
                      (COMBINED)<br /> ANNUAL RETIREMENT INCOME:
                    </ControlLabel>
                    <CurrencyInput
                      value={0}
                      placeholder='$'
                      bsClass='text-right form-control'
                      onChange={this.handleChange}
                    />
                    <div className='text-right'>
                      <a href='javascript:;' className={classes.linkApply}>
                        Apply to plan
                      </a>
                    </div>
                  </FormGroup>
                </Col>
                <Col xs={2} className={`${classes.vmCol} text-center`}>
                  <span className={classes.operator}>=</span>
                </Col>
                <Col xs={5} className={classes.vmCol}>
                  <FormGroup controlId='rpSelfContribution' className={classes.noMarginBottom}>
                    <ControlLabel className={classes.rightPaneLabel}>
                      ANNUAL CONTRIBUTIONS:
                    </ControlLabel>
                    <CurrencyInput
                      value={0}
                      placeholder='$'
                      bsClass='text-right form-control'
                      onChange={this.handleChange}
                    />
                    <div className='text-right'>
                      <a href='javascript:;' className={classes.linkApply}>
                        Apply to plan
                      </a>
                    </div>
                  </FormGroup>
                  <FormGroup controlId='rpPartnerContribution'>
                    <ControlLabel className={classes.rightPaneLabel}>
                      <span className={classes.operator}>+</span>
                    </ControlLabel>
                    <CurrencyInput
                      value={0}
                      placeholder='$'
                      bsClass='text-right form-control'
                      onChange={this.handleChange}
                    />
                    <div className='text-right'>
                      <a href='javascript:;' className={classes.linkApply}>
                        Apply to plan
                      </a>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className={classes.bottomActions}>
              <Button bsStyle='primary'>
                Make It Happen
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

const requests = () => ({
  user: getProfile
})
const requests2 = ({ retiresmartz }) => ({
  partner: retiresmartz && retiresmartz.planTogether && getPartnerProfile
})

const selector = createStructuredSelector({
  retiresmartz: retiresmartzSelector
})

const actions = {
  goTo,
  show,
  set
}

export default R.compose(
  connect(requests, selector, actions),
  connect(requests2)
)(Projection)
