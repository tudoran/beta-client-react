import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, Form, FormGroup, FormControl, OverlayTrigger, Panel,
  Row } from 'react-bootstrap'
import { goTo } from 'redux/modules/router'
import { reduxForm } from 'redux-form'
import { show } from 'redux-modal'
import R from 'ramda'
import { connect } from 'redux/api'
import Button from 'components/Button/Button'
import classes from './AccountSettings.scss'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'
import Switch from 'components/Switch/Switch'
import Tooltip from 'components/Tooltip/Tooltip'

const renderHeader = ({ goTo, params: { accountId, clientId }, show },  // eslint-disable-line react/prop-types
  account) => // eslint-disable-line react/prop-types
  <Row>
    <Col xs={6}>
      <h1 className={classes['page-title']}
        style={{ padding: 0, margin: 0, lineHeight: '34px' }}>
        {account && `${account.account_name} Account Settings`}
      </h1>
    </Col>
    <Col xs={6} className='text-right'>
      <ul className='list-inline' style={{ marginBottom: 0 }}>
        <li>
          <Button onClick={function () {
            goTo(`/${clientId}/account/${accountId}/risk-profile-wizard`)
          }}>
            Risk Profile
          </Button>
        </li>
        <li>
          <Button onClick={function () { show('accountDeposit') }}>
            Deposit
          </Button>
        </li>
      </ul>
    </Col>
  </Row>

const renderFooter = () =>
  <Row>
    <Col xs={12} className='text-right'>
      <Button bsStyle='primary' type='submit'>Save</Button>
    </Col>
  </Row>

const taxLossTooltip =
  <Tooltip id='tax-loss-tooltip'>
    TODO: Add contact information here.
    See BU-162: 'hover text to get in touch to enable.'
  </Tooltip>

const getAccount = ({ params: { accountId }, accounts }) =>
  R.find(R.propEq('id', parseInt(accountId, 10)), accounts)

const getAccountType = ({ account_type }, { accountTypes }) =>
  R.find(R.propEq('id', account_type), accountTypes)

const getPrimaryOwnerName = ({ primaryOwner }) =>
  primaryOwner &&
    `${primaryOwner.user.first_name} ${primaryOwner.user.last_name}`

class AccountSettings extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    accountTypes: PropTypes.array,
    goTo: PropTypes.func,
    fields: PropTypes.object,
    handleSubmit: PropTypes.func,
    params: PropTypes.object,
    primaryOwner: PropTypes.object,
    save: PropTypes.func,
    show: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.save = this.save.bind(this)
  }

  save ({ accountName }) {
    const { save } = this.props
    const body = {
      account_name: accountName
    }
    save({ body })
  }

  render () {
    const { props } = this
    const { fields: { accountName }, handleSubmit } = props
    const account = getAccount(props)
    const accountType = account && getAccountType(account, props)
    const primaryOwnerName = getPrimaryOwnerName(props)

    return (
      <div className='container'>
        <Form horizontal onSubmit={handleSubmit(this.save)}>
          <Panel header={renderHeader(props, account)}
            footer={renderFooter(props)}>
            {account && <Row>
              <div className={classes['left-col']}>
                <FormGroup className={classes['form-group']}>
                  <Col xs={4} componentClass={ControlLabel}>Account Name</Col>
                  <Col xs={8}>
                    <FormControl type='text' {...accountName} />
                  </Col>
                </FormGroup>
                <FormGroup className={classes['form-group']}>
                  <Col xs={4} componentClass={ControlLabel}>Account Type</Col>
                  <Col xs={8}>
                    <FormControl type='text' readOnly
                      value={accountType && accountType.name} />
                  </Col>
                </FormGroup>
                <FormGroup className={classes['form-group']}>
                  <Col xs={4} componentClass={ControlLabel}>Primary Owner</Col>
                  <Col xs={8}>
                    <FormControl type='text' readOnly
                      value={primaryOwnerName} />
                  </Col>
                </FormGroup>
                <FormGroup className={classes['form-group']}>
                  <Col xs={4} componentClass={ControlLabel}>Signatories</Col>
                  <Col xs={8}>
                    <FormControl type='text' readOnly value='TODO' />
                  </Col>
                </FormGroup>
              </div>
              <div className={classes['right-col']}>
                <FormGroup className={classes['form-group']}>
                  <Col xs={4} componentClass={ControlLabel}>
                    Tax Loss Harvesting
                  </Col>
                  <Col xs={1}>
                    <div style={{ marginTop: '7px' }}>
                      <OverlayTrigger placement='top' overlay={taxLossTooltip}>
                        <div>
                          <Switch
                            checked={account.tax_loss_harvesting_consent} />
                        </div>
                      </OverlayTrigger>
                    </div>
                  </Col>
                </FormGroup>
                <FormGroup className={classes['form-group']}>
                  <Col xs={4} componentClass={ControlLabel}>Cash Balance</Col>
                  <Col xs={8}>
                    <CurrencyInput value={account.cash_balance + 100} readOnly
                      style={{ pointerEvents: 'none' }} />
                  </Col>
                </FormGroup>
              </div>
            </Row>}
          </Panel>
        </Form>
      </div>
    )
  }
}

const requests = ({ params: { accountId, clientId } }) => ({
  accounts: clientId && (({ findAll }) => findAll({
    type: 'accounts',
    url: clientId === 'me' ? '/accounts' : `/clients/${clientId}/accounts`
  })),
  accountTypes: ({ findAll }) => findAll({
    type: 'accountTypes',
    url: '/settings/account-types'
  }),
  save: ({ update }) => update({
    type: 'accounts',
    url: `/accounts/${accountId}`
  })
})

const actions = {
  goTo,
  show
}

const requests2 = (props) => {
  const account = getAccount(props)
  return account && {
    primaryOwner: ({ findOne }) => findOne({
      type: 'clients',
      id: account.primary_owner
    })
  }
}

export default R.compose(
  connect(requests, null, actions),
  connect(requests2),
  reduxForm({
    form: 'accountSettings',
    fields: ['accountName']
  }, (state, props) => ({
    initialValues: {
      accountName: R.compose(
        R.prop('account_name'),
        R.defaultTo({}),
        getAccount
      )(props)
    }
  }))
)(AccountSettings)
