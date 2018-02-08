import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, Form, FormControl } from 'react-bootstrap'
import R from 'ramda'
import Button from 'components/Button/Button'
import classes from './FinancialProfile.scss'
import CurrencyInput from 'components/CurrencyInput'
import FieldError from 'components/FieldError'
import FormGroup from '../FormGroup'

const employmentStatusOptions = (settings) => (
  settings && R.compose(
    R.map(({ id, name }) => (
      <option key={id} value={id}>{name}</option>
    )),
    R.prepend({ id: null, name: 'Not selected' })
  )(settings.employment_statuses)
)

export default class FinancialProfile extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    refreshProfile: PropTypes.func.isRequired,
    settings: PropTypes.object,
    updateClient: PropTypes.func,
    user: PropTypes.object
  };

  handleUpdate = (fields) => {
    const { updateClient, refreshProfile } = this.props
    updateClient({
      body: fields,
      success: refreshProfile
    })
  }

  render () {
    const { fields, errors, handleSubmit, settings } = this.props
    const hasErrors = !R.compose(R.equals(0), R.length, R.keys)(errors)
    return (
      <Form horizontal onSubmit={handleSubmit(this.handleUpdate)}>
        <FormGroup>
          <Col xs={4} componentClass={ControlLabel}>
            Employment Status
          </Col>
          <Col xs={8}>
            <FormControl componentClass='select' {...fields.employment_status}>
              {employmentStatusOptions(settings)}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={4} componentClass={ControlLabel}>Occupation</Col>
          <Col xs={8}>
            <FormControl type='text' {...fields.occupation} />
            <FieldError for={fields.occupation} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={4} componentClass={ControlLabel}>Employer</Col>
          <Col xs={8}>
            <FormControl type='text' {...fields.employer} />
            <FieldError for={fields.employer} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={4} componentClass={ControlLabel}>
            Annual Income
          </Col>
          <Col xs={8}>
            <CurrencyInput {...fields.income} />
            <FieldError for={fields.income} />
          </Col>
        </FormGroup>
        <FormGroup className={classes.mb30}>
          <Col xs={4} componentClass={ControlLabel}>
            Net Worth
          </Col>
          <Col xs={8}>
            <CurrencyInput disabled style={{ pointerEvents: 'none' }} />
          </Col>
        </FormGroup>
        <FormGroup className={classes.mb30}>
          <Col xsOffset={3} className='text-right'>
            <Button type='submit' bsStyle='primary' disabled={hasErrors}>
              Update info
            </Button>
          </Col>
        </FormGroup>
      </Form>
    )
  }
}
