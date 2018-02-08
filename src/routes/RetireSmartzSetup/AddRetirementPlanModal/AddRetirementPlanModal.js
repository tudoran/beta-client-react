import React, { Component, PropTypes } from 'react'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { Modal, Button, Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import R from 'ramda'
import { connect } from 'redux/api'
import { goTo } from 'redux/modules/router'
import { retiresmartzSelector, isAuthenticatedSelector } from 'redux/selectors'
import classes from './AddRetirementPlanModal.scss'
import FieldError from 'components/FieldError/FieldError'
import schema from 'schemas/retirementPlan'

class AddRetirementPlanModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
    goTo: PropTypes.func.isRequired,
    fields: PropTypes.object,
    addRetirementPlan: PropTypes.func,
    onAddPlan: PropTypes.func,
    forPartner: PropTypes.bool,
    clientId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ])
  };
  static defaultProps = {
    forPartner: false,
    onSave: () => {}
  }
  handleAddPlan = () => {
    const { addRetirementPlan, fields, handleHide, onAddPlan, clientId } = this.props
    if (fields.name.valid) {
      const body = {
        name: fields.name.value,
        description: fields.description.value,
        client: clientId
      }
      addRetirementPlan({
        body,
        success: [
          handleHide,
          ({ value: { id } }) => onAddPlan(id)
        ]
      })
    }
  }
  render () {
    const { handleHide, show, fields } = this.props
    return (
      <Modal show={show} onHide={handleHide}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title>Add Retirement Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={classes.primaryColor}>
            Personalise your plan by giving it a name and optinally a description.
          </p>
          <Form horizontal>
            <FormGroup controlId='ARPM_PlanName'>
              <Col componentClass={ControlLabel} sm={3} className={classes.textColor}>
                Plan name
              </Col>
              <Col sm={9}>
                <FormControl type='text' {...fields.name} />
                <FieldError for={fields.name} />
              </Col>
            </FormGroup>

            <FormGroup controlId='ARPM_Description'>
              <Col componentClass={ControlLabel} sm={3} className={classes.textColor}>
                Description
              </Col>
              <Col sm={9}>
                <FormControl componentClass='textarea' rows={3} {...fields.description} />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={this.handleAddPlan}>
            Add Plan
          </Button>
          <Button onClick={handleHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const requests = ({ clientId, forPartner }) => ({
  addRetirementPlan: ({ create }) => create({
    type: forPartner ? 'partnerRetirementPlans' : 'retirementPlans',
    url: `/clients/${clientId}/retirement-plans${forPartner ? '?partner' : ''}`
  })
})

const selector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector,
  retiresmartz: retiresmartzSelector
})

const actions = {
  goTo
}

export default R.compose(
  connectModal({ name: 'addRetirementPlanModal' }),
  connect(requests, selector, actions),
  reduxForm({
    form: 'addRetirementPlan',
    ...schema
  })
)(AddRetirementPlanModal)
