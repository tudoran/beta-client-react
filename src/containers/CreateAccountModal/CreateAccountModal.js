import React, { Component, PropTypes } from 'react'
import { Button, Col, ControlLabel, FormControl, FormGroup, Modal,
  OverlayTrigger, Row } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { MdHelp } from 'helpers/icons'
import { reduxForm } from 'redux-form'
import classNames from 'classnames'
import R from 'ramda'
import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import { goTo } from 'redux/modules/router'
import { propsChanged } from 'helpers/pureFunctions'
import { routeParamsSelector } from 'redux/selectors'
import classes from './CreateAccountModal.scss'
import createSchema from 'schemas/createAccount'
import FieldError from 'components/FieldError/FieldError'
import Tooltip from 'components/Tooltip/Tooltip'

const tooltipTitle =
  <Tooltip id='tooltipAddGoalTitle'>
    TODO. Lorem ipsum dolor sit amet, ne mutat adhuc partem qui. Vix liber
    copiosae at, nec solet ancillae assentior ei, ut mei utamur molestie. Cu
    duo falli moderatius, nibh nulla qui et. In eum labores probatus. Ferri
    dicam viderer an vix. Sea veri lucilius conclusionemque at.
  </Tooltip>

const renderAccountTypes = ({ selectedAccountType, accountTypes, setSelected }) => // eslint-disable-line
  <Row className={classNames({
    [classes.accountTypes]: true,
    [classes.highlight]: !selectedAccountType.value
  })}>
    {R.map(accountType => (
      <Col xs={3} key={accountType.id}>
        <OverlayTrigger placement='top' overlay={
          <Tooltip id={`tooltipCard_${accountType.id}`}>
            TODO. Lorem ipsum dolor sit amet, ne mutat adhuc partem qui.
          </Tooltip>}>
          <div className={classNames({
            [classes.accountType]: true,
            [classes.active]: R.equals(accountType, selectedAccountType.value)
          })} onClick={function () { setSelected(accountType) }}>
            <span className={classes.accountTypeTitle}>
              {accountType.name}
            </span>
          </div>
        </OverlayTrigger>
      </Col>
    ), accountTypes)}
  </Row>

class CreateAccountModal extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    accountTypes: PropTypes.array,
    fields: PropTypes.object,
    goTo: PropTypes.func,
    handleHide: PropTypes.func,
    handleSubmit: PropTypes.func,
    save: PropTypes.func,
    savedRouteParams: PropTypes.object,
    show: PropTypes.bool,
    user: PropTypes.object,
    values: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.save = this.save.bind(this)
    this.setSelected = this.setSelected.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return propsChanged(['fields', 'accountTypes', 'show'], this.props,
      nextProps)
  }

  setSelected (accountType) {
    const { name, selectedAccountType } = this.props.fields
    selectedAccountType.onChange(accountType)
    name.onChange(accountType.name)
  }

  save () {
    const { goTo, handleHide, save, savedRouteParams: { clientId }, user,
      values } = this.props
    const body = {
      account_type: values.selectedAccountType.id,
      account_name: values.name,
      primary_owner: clientId === 'me' ? user.id : clientId
    }
    save({
      body,
      success: ({ value: { id } }) => goTo(`/${clientId}/account/${id}`)
    })
    handleHide()
  }

  render () {
    const { fields: { name, selectedAccountType }, accountTypes,
      handleSubmit, handleHide, show } = this.props
    const { setSelected } = this
    const renderedAccountTypes = renderAccountTypes({
      selectedAccountType,
      accountTypes,
      setSelected
    })

    return (
      <Modal show={show} onHide={handleHide}
        aria-labelledby='CreateAccountModal' dialogClassName={classes.modal}>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Create Account</Modal.Title>
        </Modal.Header>
        <form className='form-horizontal'
          onSubmit={handleSubmit(this.save)}>
          <Modal.Body>
            <h3 className={classes.title}>
              Choose One
              <OverlayTrigger placement='right' overlay={tooltipTitle}>
                <span className={classes['tooltip']}>
                  <MdHelp size='18' />
                </span>
              </OverlayTrigger>
            </h3>
            <FieldError for={selectedAccountType} />
            {renderedAccountTypes}
            {!selectedAccountType.invalid &&
              <div className={classNames(classes.name, classes.highlight)}>
                <FormGroup>
                  <ControlLabel
                    className={classNames(classes.nameLabel, 'col-sm-6')}>
                    Personalize your account by naming it (required)
                  </ControlLabel>
                  <div className={classNames(classes.nameText, 'col-sm-6')}>
                    <FormControl {...name} type='text' />
                  </div>
                </FormGroup>
                {!selectedAccountType.invalid &&
                  <div className={classes['nameError']}>
                    <FieldError for={name} />
                  </div>}
              </div>}
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className={classes.footerBtn}
              bsStyle='primary'>
              Create Account
            </Button>
            <Button onClick={handleHide} className={classes.footerBtn}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
}

const requests = ({ savedRouteParams }) => ({
  accounts: ({ findAll }) => findAll({
    type: 'accounts'
  }),
  accountTypes: ({ findAll }) => findAll({
    type: 'accountTypes',
    url: '/settings/account-types'
  }),
  save: ({ create }) => create({
    type: 'accounts'
  }),
  user: getProfile
})

const selector = createStructuredSelector({
  savedRouteParams: routeParamsSelector
})

const actions = { goTo }

const schema = createSchema()

export default R.compose(
  connectModal({ name: 'createAccount' }),
  connect(requests, selector, actions),
  reduxForm({
    form: 'createAccount',
    destroyOnUnmount: false,
    ...schema
  })
)(CreateAccountModal)
