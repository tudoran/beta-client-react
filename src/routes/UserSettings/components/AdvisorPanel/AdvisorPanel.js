import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, FormControl } from 'react-bootstrap'
import R from 'ramda'
import FormGroup from '../FormGroup'

export default class AdvisorPanel extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  static defaultProps = {
    user: {}
  }

  getFullName(user) {
    return R.join(' ')([
      user.first_name,
      user.middle_name,
      user.last_name
    ])
  }

  getAdvisorRow(advisor) {
    return advisor
    ? R.join(', ', [
      this.getFullName(advisor.user),
      R.defaultTo('N/A', advisor.work_phone_num),
      R.defaultTo('N/A', advisor.email)
    ])
    : 'N/A'
  }

  render() {
    const { user: { advisor, secondary_advisors } } = this.props
    return (
      <div className='form-horizontal'>
        <FormGroup>
          <Col xs={4} componentClass={ControlLabel}>
            Primary Advisor
          </Col>
          <Col xs={8}>
            <FormControl.Static>
              {this.getAdvisorRow(advisor)}
            </FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={4} componentClass={ControlLabel}>
            Secondary Advisor
          </Col>
          <Col xs={8}>
            {
              secondary_advisors && !R.equals(0, secondary_advisors.length)
              ? R.map(advisor => (
                <FormControl.Static key={advisor.id}>
                  {this.getAdvisorRow(advisor)}
                </FormControl.Static>
              ), secondary_advisors)
              : <FormControl.Static>N/A</FormControl.Static>
            }
          </Col>
        </FormGroup>
      </div>
    )
  }
}
