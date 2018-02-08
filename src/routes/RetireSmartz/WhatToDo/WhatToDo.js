import React, { Component, PropTypes } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import classes from './WhatToDo.scss'

export default class WhatToDo extends Component {
  static propTypes = {
    parent: PropTypes.object
  };

  render () {
    return (
      <div className={classes.whatToDoWrap}>
        <Row>
          <Col xs={6}>
            <h3 className={classes.wtdHeading}>Recommended Accounts</h3>
            <ul className={classes.eligibilitiesText}>
              <li>
                You are eligible to contribute up to $5,500 in a deductible SMSF
                for the 2016 tax year. You can't contribute to a SMSF due to your
                income and filing status.
              </li>
              <li>
                Your spouse is eligible to contribute up to $5,500 in a deductible
                SMSF for the 2016 tax year. He or she can't contribute to a SMSF
                due to his or her income and filing status.
              </li>
            </ul>
            <h3 className={classes.wtdHeading}>Account Qualifications</h3>
            <div className={classes.recommendationsText}>
              <p>
                We recommend investing $3,317 in a deductible SMSF. Given that your
                future tax rate will likely be lower, it is most efficient to save
                taxes at a higher rate now and withdraw in retirement at a lower
                tax rate.{' '}
                <a href='http://www.irs.gov/Retirement-Plans/Traditional-IRAs'
                  target='_blank'>Read more about SMSFs</a>.
              </p>
              <p>
                After your SMSF contributions, contribute to a personal or joint
                taxable account for the rest of your savings.
              </p>
            </div>
            <div className={classes.wtdSeparator} />
            <p>
              Next step: Set up your accounts and contributions in{' '}
              <a href='javascript:;' onClick={function () {
                this.props.parent.setState({tabKey: 3})
              }}>
                Actions
              </a>
            </p>
          </Col>
          <Col xs={6}>
            <div className={classes.retirementSavings}>
              <p className={classes.rsHeading}>Retirement Savings</p>
              <p className={classes.savingsAmount}>{'$3,317'}/year</p>
            </div>
            <div className={classes.savingsBreakdown}>
              <div className={classes.investmentDistribution}>
                <div className={`${classes.rsColumn} traditional-ira`}
                  style={{
                    width: '50%',
                    display: 'block'
                  }}>
                  <div className={classes.rsFill}
                    style={{
                      height: '175px',
                      background: 'rgb(145, 208, 113)',
                      display: 'block'
                    }} />
                  <h4 className={classes.rsName}>SMSF</h4>
                </div>

                <div className={`${classes.rsColumn} spouse-traditional-ira`}
                  style={{
                    width: '0%',
                    display: 'none'
                  }}>
                  <div className={classes.rsFill}
                    style={{
                      height: '0px',
                      background: 'rgb(145, 208, 113)'
                    }} />
                  <h4 className={classes.rsName}>Spouse SMSF</h4>
                </div>

                <div className={`${classes.rsColumn} roth-ira`}
                  style={{
                    width: '0%',
                    display: 'none'
                  }}>
                  <div className={classes.rsFill}
                    style={{
                      height: '0px',
                      background: 'rgb(145, 208, 113)'
                    }} />
                  <h4 className={classes.rsName}>SMSF</h4>
                </div>

                <div className={`${classes.rsColumn} spouse-roth-ira`}
                  style={{
                    width: '0%',
                    display: 'none'
                  }}>
                  <div className={classes.rsFill}
                    style={{
                      height: '0px',
                      background: 'rgb(145, 208, 113)'
                    }} />
                  <h4 className={classes.rsName}>Spouse SMSF</h4>
                </div>

                <div className={`${classes.rsColumn} taxable`}
                  style={{
                    width: '50%',
                    display: 'block'
                  }}>
                  <div className={classes.rsFill}
                    style={{
                      height: '35px',
                      background: 'rgb(70, 158, 25)',
                      display: 'block'
                    }} />
                  <h4 className={classes.rsName}>Taxable</h4>
                </div>
              </div>
              <div className={classes.savingsLineItems}>
                <div className={`${classes.lineItem} traditional-ira`}
                  style={{display: 'block'}}>
                  <div className={classes.sliName}>SMSF</div>
                  <div className={classes.sliValue}>{'$3,317'}/year</div>
                </div>
                <div className={`${classes.lineItem} spouse-traditional-ira`}
                  style={{display: 'none'}}>
                  <div className={classes.sliName}>Spouse SMSF</div>
                  <div className={classes.sliValue} />
                </div>
                <div className={`${classes.lineItem} roth-ira`}
                  style={{display: 'none'}}>
                  <div className={classes.sliName}>SMSF</div>
                  <div className={classes.sliValue} />
                </div>
                <div className={`${classes.lineItem} spouse-roth-ira`}
                  style={{display: 'none'}}>
                  <div className={classes.sliName}>Spouse SMSF</div>
                  <div className={classes.sliValue} />
                </div>
                <div className={`${classes.lineItem} taxable`}
                  style={{display: 'block'}}>
                  <div className={classes.sliName}>Taxable</div>
                  <div className={classes.sliValue}>{'$0'}/year</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className={classes.bottomActions}>
          <Button bsStyle='primary'
            onClick={function () { this.props.parent.setState({tabKey: 3}) }}>
            Continue to Actions
          </Button>
        </div>
      </div>
    )
  }
}
