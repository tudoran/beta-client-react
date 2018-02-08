import React, { Component, PropTypes } from 'react'
import { Button, Col, ControlLabel, FormControl, FormGroup, Modal,
  OverlayTrigger, Row } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { FaLeaf, MdHelp } from 'helpers/icons'
import { reduxForm } from 'redux-form'
import classNames from 'classnames'
import R from 'ramda'
import { connect } from 'redux/api'
import { goTo } from 'redux/modules/router'
import { propsChanged } from 'helpers/pureFunctions'
import { routeParamsSelector } from 'redux/selectors'
import classes from './CreateGoalModal.scss'
import createSchema from 'schemas/createGoal'
import FieldError from 'components/FieldError/FieldError'
import Switch from 'components/Switch/Switch'
import Tooltip from 'components/Tooltip/Tooltip'

const getGoalTypesGroups = R.compose(R.uniq, R.map(R.prop('group')))

const tooltipTitle =
  <Tooltip id='tooltipAddGoalTitle'>
    We ask you to choose a goal type to frame your investing and allow us
    to give more tailored advice. You can always change your goal type or
    add more goals later.
  </Tooltip>

const tooltipEthicalPortfolio =
  <Tooltip id='tooltipEthicalPortfolio'>
    <p className={classNames('bold-text', classes.ethicalTooltipTitle)}>
      Socially Responsible Portfolio
    </p>
    <p>
      If you plan to invest using only Socially Responsible Investments (SRI),
      assets which seek to consider both financial return and social good
      whether that be environmental stewardship, avoiding exposure to
      tobacco and weapons or social justice and corporate governance.
    </p>
  </Tooltip>

const tooltipGroups = {
  'Major Savings': (
    <Tooltip id='tooltipGroupName'>
      If you plan to make a major purchase in the future, it's better to
      save for it through smart investing than buy it on credit.
    </Tooltip>
  ),
  'Essentials': (
    <Tooltip id='tooltipGroupName'>
      Everyone should have essential goals to help manage your money.
    </Tooltip>
  )
}

const renderGroups = ({ selectedGoalType, goalTypes, setSelected }) =>
  R.map(group =>
    <div key={group} className={classNames({
      [classes.group]: true,
      [classes.highlight]: !selectedGoalType.value
    })}>
      <div className={classes.groupName} key='groupName'>
        <OverlayTrigger placement='right' overlay={tooltipGroups[group]}>
          <span className={classes['underline']}>{group}</span>
        </OverlayTrigger>
      </div>
      <div className={classes.groupInner}>
        <Row>
          {R.map(goalType => (
            <Col xs={3} key={goalType.id}>
              <OverlayTrigger placement='top' overlay={
                <Tooltip id={`tooltipCard_${goalType.id}`}>
                  {goalType.description}
                </Tooltip>}>
                <div className={classNames({
                  [classes.goalType]: true,
                  [classes.active]: R.equals(goalType, selectedGoalType.value)
                })} onClick={function () { setSelected(goalType) }}>
                  <span className={classes.groupTypeTitle}>
                    {goalType.name}
                  </span>
                </div>
              </OverlayTrigger>
            </Col>
          ), R.filter(R.propEq('group', group), goalTypes))}
        </Row>
      </div>
    </div>
  )

class CreateGoalModal extends Component {
  static propTypes = {
    fields: PropTypes.object,
    goalTypes: PropTypes.array,
    goTo: PropTypes.func,
    handleHide: PropTypes.func,
    handleSubmit: PropTypes.func,
    saveButtonLabel: PropTypes.string,
    savedRouteParams: PropTypes.object,
    show: PropTypes.bool
  };

  constructor (props) {
    super(props)
    this.gotoSetupNewGoalPage = this.gotoSetupNewGoalPage.bind(this)
    this.setSelected = this.setSelected.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return propsChanged(['fields', 'goalTypes', 'show'], this.props, nextProps)
  }

  setSelected (goalType) {
    const { name, selectedGoalType } = this.props.fields
    selectedGoalType.onChange(goalType)
    name.onChange(goalType.name)
  }

  gotoSetupNewGoalPage () {
    const { handleHide, goTo, savedRouteParams: { accountId,
      clientId } } = this.props
    handleHide()
    goTo(`/${clientId}/account/${accountId}/create-goal`)
  }

  render () {
    const { fields: { name, selectedGoalType, ethicalInvestments }, goalTypes,
      handleSubmit, handleHide, saveButtonLabel, show } = this.props
    const { setSelected } = this
    const groups = getGoalTypesGroups(goalTypes)

    return (
      <Modal show={show} onHide={handleHide} aria-labelledby='CreateGoalModal'
        dialogClassName={classes.modal}>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Add Goal</Modal.Title>
        </Modal.Header>
        <form className='form-horizontal'
          onSubmit={handleSubmit(this.gotoSetupNewGoalPage)}>
          <Modal.Body>
            <h3 className={classes.title}>
              Choose One
              <OverlayTrigger placement='right' overlay={tooltipTitle}>
                <span className={classes['tooltip']}>
                  <MdHelp size='18' />
                </span>
              </OverlayTrigger>
            </h3>
            <FieldError for={selectedGoalType} />
            <div className={classes.groups}>
              {renderGroups({ selectedGoalType, goalTypes,
                setSelected })(groups)}
            </div>
            {!selectedGoalType.invalid &&
              <div className={classNames(classes.name, classes.highlight)}>
                <FormGroup>
                  <ControlLabel
                    className={classNames(classes.nameLabel, 'col-sm-6')}>
                    Personalize your goal by naming it (required)
                  </ControlLabel>
                  <div className={classNames(classes.nameText, 'col-sm-6')}>
                    <FormControl {...name} type='text' />
                  </div>
                </FormGroup>
                {!selectedGoalType.invalid &&
                  <div className={classes['nameError']}>
                    <FieldError for={name} />
                  </div>}
              </div>}
            <div className={classes.ethical}>
              <div className={classes.ethicalLabel}>
                <span>SOCIALLY RESPONSIBLE INVESTMENTS
                  <OverlayTrigger overlay={tooltipEthicalPortfolio}
                    placement='top'>
                    <FaLeaf className={classes.ethicalIcon} size='16' />
                  </OverlayTrigger>
                </span>
              </div>
              <div className={classes.ethicalSwitch}>
                <Switch {...ethicalInvestments} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className={classes.footerBtn}
              bsStyle='primary'>
              {saveButtonLabel}
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
  goals: savedRouteParams && (({ findAll }) => findAll({
    type: 'goals',
    url: `/accounts/${savedRouteParams.accountId}/goals`
  })),
  goalTypes: ({ findAll }) => findAll({
    type: 'goalTypes',
    url: '/goals/types'
  })
})

const selector = createStructuredSelector({
  savedRouteParams: routeParamsSelector
})

const actions = { goTo }

const schema = createSchema(['selectedGoalType', 'name', 'ethicalInvestments'])

export default R.compose(
  connectModal({ name: 'createGoal' }),
  connect(requests, selector, actions),
  reduxForm({
    form: 'createGoal',
    destroyOnUnmount: false,
    ...schema
  })
)(CreateGoalModal)
