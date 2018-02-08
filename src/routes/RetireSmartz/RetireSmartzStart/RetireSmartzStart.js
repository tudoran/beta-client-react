import React, { Component, PropTypes } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import { show } from 'redux-modal'
import R from 'ramda'
import { FaCheck } from 'helpers/icons'
import { set } from 'redux/modules/retiresmartz'
import { createStructuredSelector } from 'reselect'
import { retiresmartzSelector, isAuthenticatedSelector } from 'redux/selectors'
import AddRetirementPlanModal
  from '../../RetireSmartzSetup/AddRetirementPlanModal/AddRetirementPlanModal'
import Select from 'components/Select/Select'
import classes from './RetireSmartzStart.scss'

const getRetirementPlanOptions = R.map(({ id, name }) => ({
  label: name,
  value: id
}))

export class RetireSmartzStart extends Component {
  static propTypes = {
    goTo: PropTypes.func,
    show: PropTypes.func,
    set: PropTypes.func,
    retiresmartz: PropTypes.object,
    user: PropTypes.object,
    retirementPlans: PropTypes.array
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  handleExistingPlanSelect = (val) => {
    const { set, goTo } = this.props
    const { accountId, clientId } = this.context
    set({currentPlan: val.value})
    goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1`)
  }

  handlePostAddPlan = (id) => {
    const { goTo, set } = this.props
    const { clientId, accountId } = this.context
    set({ currentPlan: id })
    goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/1`)
  }

  render () {
    const { show, retirementPlans, user, retiresmartz: { currentPlan } } = this.props
    const options = retirementPlans ? getRetirementPlanOptions(retirementPlans) : []

    return (
      <div className={classes.content}>
        <div className={classes.sectionHeader}>
          <h1 className={classes.pageTitle}>
            See if you are invested correctly for retirement
          </h1>
          <p>In 5 minutes, RetireSmart™ will advise you on these questions</p>
        </div>
        <Row>
          <Col xs={10} xsOffset={1} className={classes.questionRegion}>
            <div className={classes.qaItem}>
              <FaCheck size='30' className={classes.qaIcon} />
              <div className={classes.qa}>
                <h3>Am I saving enough?</h3>
                <p>
                  You know that savings are critical. We'll help you figure out
                  how much you need to save to retire on your terms.
                </p>
              </div>
            </div>
            <div className={classes.qaItem}>
              <FaCheck size='30' className={classes.qaIcon} />
              <div className={classes.qa}>
                <h3>When can I retire?</h3>
                <p>
                  Retiring early is a dream of many. You'll see how different
                  retirement age choices affect how much you need to save.
                </p>
              </div>
            </div>
            <div className={classes.qaItem}>
              <div className={classes.qa}>
                {options.length
                  ? (
                  <div className={classes.bottomActions}>
                    <p>
                      Choose an existing plan to modify or
                      {' '}
                      <a href='javascript:;'
                        onClick={function () { show('addRetirementPlanModal') }}>
                        Create a new Plan
                      </a>
                    </p>
                    <Row>
                      <Col xs={6}>
                        <Select name='existingPlanList'
                          options={options}
                          clearable={false}
                          searchable={false}
                          onChange={this.handleExistingPlanSelect}
                          value={currentPlan}
                        />
                      </Col>
                    </Row>
                  </div>
                  ) : (
                  <div className={classes.bottomActions}>
                    <Button bsStyle='primary'
                      onClick={function () { show('addRetirementPlanModal') }}>
                      Start Planning
                    </Button>
                  </div>
                  )
                }
              </div>
            </div>
          </Col>
        </Row>
        {user &&
          <AddRetirementPlanModal clientId={user.id} onAddPlan={this.handlePostAddPlan} />
        }
      </div>
    )
  }
}

const requests = {
  user: getProfile
}

const requests2 = ({ user }) => ({
  retirementPlans: user && (({ findAll }) => findAll({
    type: 'retirementPlans',
    url: `/clients/${user.id}/retirement-plans`
  }))
})

const selector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector,
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
)(RetireSmartzStart)
