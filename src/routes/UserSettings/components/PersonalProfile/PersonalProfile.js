import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, Form, FormControl, Row } from 'react-bootstrap'
import R from 'ramda'
import Button from 'components/Button/Button'
import classes from './PersonalProfile.scss'
import FieldError from 'components/FieldError'
import FormGroup from '../FormGroup'

const civilStatusOptions = (settings) => (
  settings && R.compose(
    R.map(({ id, name }) => (
      <option key={id} value={id}>{name}</option>
    )),
    R.prepend({ id: null, name: 'Not selected' })
  )(settings.civil_statuses)
)

export default class PersonalProfile extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    refreshProfile: PropTypes.func.isRequired,
    settings: PropTypes.object,
    updateClient: PropTypes.func,
    updateUser: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  handleUpdate = (fields) => {
    const { updateUser, updateClient, refreshProfile } = this.props
    const processUpdateClient = () => updateClient({
      body: fields,
      success: refreshProfile
    })
    updateUser({
      body: fields,
      success: processUpdateClient
    })
  }

  render () {
    const { fields, errors, handleSubmit, settings } = this.props
    const hasErrors = !R.compose(R.equals(0), R.length, R.keys)(errors)
    return (
      <Form horizontal onSubmit={handleSubmit(this.handleUpdate)}>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Name</Col>
          <Col xs={9}>
            <Row>
              <Col xs={5}>
                <FormControl type='text' placeholder='First Name' {...fields.first_name} />
                <FieldError for={fields.first_name} />
              </Col>
              <Col xs={2}>
                <FormControl type='text' placeholder='Mid' {...fields.middle_name} />
                <FieldError for={fields.middle_name} />
              </Col>
              <Col xs={5}>
                <FormControl type='text' placeholder='Last Name' {...fields.last_name} />
                <FieldError for={fields.last_name} />
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Address 1</Col>
          <Col xs={9}>
            <FormControl type='text' {...fields.address1} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Address 2</Col>
          <Col xs={9}>
            <FormControl type='text' {...fields.address2} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>City/State</Col>
          <Col xs={9}>
            <Row>
              <Col xs={5}>
                <FormControl type='text' placeholder='City' {...fields.city} />
              </Col>
              <Col xs={2}>
                <FormControl type='text' placeholder='State' {...fields.state} />
              </Col>
              <Col xs={5}>
                <FormControl type='text' placeholder='Postal Code' {...fields.post_code} />
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Country</Col>
          <Col xs={9}>
            <FormControl componentClass='select' {...fields.country}>
              <option>Select</option>
              <option value='AU'>Australia</option>
              <option value='US'>United States</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Contact</Col>
          <Col xs={9}>
            <Row>
              <Col xs={6}>
                <FormControl type='text' placeholder='Phone' {...fields.phone_num} />
                <FieldError for={fields.phone_num} />
              </Col>
              <Col xs={6}>
                <FormControl type='email' placeholder='Email' {...fields.email} />
                <FieldError for={fields.email} />
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Gender</Col>
          <Col xs={9}>
            <FormControl type='text' readOnly {...fields.gender} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Date of Birth</Col>
          <Col xs={9}>
            <FormControl type='text' readOnly {...fields.date_of_birth} />
            <FieldError for={fields.date_of_birth} />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col xs={3} componentClass={ControlLabel}>Tax Number</Col>
          <Col xs={9}>
            <FormControl type='text' readOnly {...fields.tax_file_number} />
            <FieldError for={fields.tax_file_number} />
          </Col>
        </FormGroup>
        <FormGroup className={classes.mb30}>
          <Col xs={3} componentClass={ControlLabel}>Civil Status</Col>
          <Col xs={9}>
            <FormControl componentClass='select' {...fields.civil_status}>
              {civilStatusOptions(settings)}
            </FormControl>
            <FieldError for={fields.civil_status} />
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
