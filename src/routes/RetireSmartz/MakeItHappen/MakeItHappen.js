import React, { Component, PropTypes } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import CreateGoalModal from 'containers/CreateGoalModal/CreateGoalModal'
import classes from './MakeItHappen.scss'

export default class MakeItHappen extends Component {
  static propTypes = {
    show: PropTypes.func
  };

  render () {
    const { show } = this.props
    return (
      <div className={classes.makeItHappenWrap}>
        <h3 className={classes.mihHeading}>Recommended Actions</h3>
        <Row className={classes.suggestedGoals}>
          <Col className={classes.newGoalColumn} xs={6} md={4}>
            <div className={`${classes.outer} ${classes.notAdded}`}>
              <div className={classes.inner}>
                <div className={classes.goalContent}>
                  <h2>Add a SMSF</h2>
                  <p>
                    Contributions may be tax deductible and grow tax free, but
                    withdrawals in retirement are subject to income tax.
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col className={classes.newGoalColumn} xs={6} md={4}>
            <div className={`${classes.outer} ${classes.added}`}>
              <div className={classes.inner}>
                <div className={classes.goalContent}>
                  <h3>Spouse SMSF</h3>
                  <h2>Contribute $160/year</h2>
                  <p>Contribute to your spouse's IRA here or at an other provider.</p>
                </div>
              </div>
            </div>
          </Col>
          <Col className={classes.newGoalColumn} xs={6} md={4}>
            <div className={`${classes.outer} ${classes.notAdded}`}>
              <div className={classes.inner}>
                <div className={classes.goalContent}>
                  <h2>Add a Taxable Account</h2>
                  <p>
                    Taxes paid on dividends annually and on gains upon withdrawal,
                    but may have favorable tax rates.  No early withdrawal penalties.
                  </p>
                  <div className={classes.buttonSection}>
                    <Button block onClick={function () {
                      show('createGoal', { saveButtonLabel: 'Add Goal' })
                    }}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <CreateGoalModal />
      </div>
    )
  }
}
