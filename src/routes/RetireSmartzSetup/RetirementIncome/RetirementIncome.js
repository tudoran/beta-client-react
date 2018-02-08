import React, { Component, PropTypes } from 'react'
import { Button, FormControl }
  from 'react-bootstrap'
import { goTo } from 'redux/modules/router'
import { connect } from 'redux/api'
import { show } from 'redux-modal'
import { getProfile, getPartnerProfile } from 'redux/modules/auth'
import R from 'ramda'
import classes from './RetirementIncome.scss'
import avatar0 from '../Avatars/avatar0.svg'
import avatar1 from '../Avatars/avatar1.svg'

export class RetirementIncome extends Component {
  static propTypes = {
    goTo: PropTypes.func,
    show: PropTypes.func,
    user: PropTypes.object,
    partner: PropTypes.object
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  // States are used for only demo purpose.
  constructor (props) {
    super(props)
    this.state = {
      spouseRetired: false
    }
  }

  render () {
    const { goTo, user, partner } = this.props
    const { accountId, clientId } = this.context

    const leftAvatarStyle = {
      backgroundImage: `url(${user && user.avatar ? user.avatar : avatar0})`
    }
    const rightAvatarStyle = {
      backgroundImage: `url(${partner && partner.avatar ? partner.avatar : avatar1})`
    }

    return (
      <div className={classes.content}>
        <div className={classes.retirementIncomeWrapper}>
          <p className={classes.description}>
            Please enter your desired retirement income
          </p>
          <p className={classes.description}>
            We have provided a very broad estimate based on your details provided so far,
            however we can help you to establish a better estimate given further information
            on your current circumstances and retirement goals by using the
            'retirement spending wizard' below.
          </p>
          <div className={classes.sectionsWrapper}>
            <div className={classes.avatarSection}>
              <div className={classes.leftAvatar} style={leftAvatarStyle} />
              <div className={classes.rightAvatar} style={rightAvatarStyle} />
            </div>
            <div className={classes.formSection}>
              <div className={classes.nameSection}>
                {user && user.first_name}
                {partner && ` & ${partner.first_name}`}
              </div>
              <div className={classes.inputWrapper}>
                <div className={classes.labelSection}>
                  DESIRED COMBINED ANNUAL RETIREMENT INCOME
                </div>
                <div className={classes.inputControl}>
                  <FormControl type='text' placeholder='$' className='text-right' block />
                </div>
              </div>
            </div>
            <div className={classes.wizardBtn}>
              <Button bsStyle='primary'>
                Retirement spending wizard
              </Button>
            </div>
          </div>
          <div className={classes.bottomActions}>
            <Button bsStyle='default'
              onClick={function () {
                goTo(`/${clientId}/account/${accountId}/retiresmartz/setup/3`)
              }}>
              Back
            </Button>
            {' '}
            <Button bsStyle='primary'
              onClick={function () {
                goTo(`/${clientId}/account/${accountId}/retiresmartz/projection`)
              }}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const requests = () => ({
  user: getProfile,
  partner: getPartnerProfile
})

const actions = {
  goTo,
  show
}

export default R.compose(
  connect(requests, null, actions)
)(RetirementIncome)
