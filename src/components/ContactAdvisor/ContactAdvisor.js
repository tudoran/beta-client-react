import React, { Component, PropTypes } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { MdChat, MdLocalPhone, MdMailOutline } from 'helpers/icons'
import classes from './ContactAdvisor.scss'

export default class ContactAdvisor extends Component {
  static propTypes = {
    advisor: PropTypes.object
  }

  render () {
    const { advisor } = this.props
    return (
      <div className={classes['advisor-section']}>
        <div className={classes['advisor-info']}>
          <span className='hidden-sm hidden-xs'>Your advisor: </span>
          <strong className='hidden-sm hidden-xs'>
            {advisor && advisor.user.first_name}
          </strong>
        </div>
        <DropdownButton pullRight noCaret className={classes['btn-circle']}
          title={<MdChat size='18' />} id='contact-advisor'>
          <MenuItem header className='hidden-lg hidden-md'>
            <span>Your advisor: </span>
            <strong>{advisor && advisor.user.first_name}</strong>
          </MenuItem>
          {advisor && advisor.work_phone && <MenuItem>
            <span className={classes['icon-circle-wrap']}>
              <MdLocalPhone size='14' />
            </span>
            <span className={classes['primary-color']}>
              {advisor.work_phone}
            </span>
          </MenuItem>}
          {advisor && advisor.email && <MenuItem>
            <span className={classes['icon-circle-wrap']}>
              <MdMailOutline size='14' />
            </span>
            <span>{advisor.email}</span>
          </MenuItem>}
        </DropdownButton>
      </div>
    )
  }
}
