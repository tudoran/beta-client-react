import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import R from 'ramda'
import classes from './PersonalInfoBox.scss'

export default class PersonalInfoBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      avatarId: PersonalInfoBox.counter ++
    }
  }

  static counter = 0;

  static propTypes = {
    user: PropTypes.object,
    bgColor: PropTypes.string,
    listMode: PropTypes.bool
  };

  static defaultProps = {
    user: {},
    bgColor: '',
    listMode: false
  };

  get age () {
    const { user } = this.props
    return R.max(moment().year() - moment(user.date_of_birth).year(), 0)
  }

  get infoList () {
    const { listMode } = this.props
    let list = [
      `${this.age} Years of age`
    ]
    if (listMode) {
      list = R.append('$1,900,000 Assets', list)
      list = R.append('$120,150 Initial Deposit', list)
    }
    return list
  }

  get nameStyle () {
    const { user } = this.props
    if (user.first_name && user.first_name.length > 6) {
      return { fontSize: '20px' }
    } else {
      return false
    }
  }

  render () {
    const { user, bgColor } = this.props
    const optionals = {}
    const nameOptionals = {}
    const nameStyle = this.nameStyle
    if (nameStyle) {
      nameOptionals['style'] = nameStyle
    }
    if (bgColor) {
      optionals['style'] = { backgroundColor: bgColor }
    }
    const avatar = user.avatar ? user.avatar : require(`../Avatars/avatar${this.state.avatarId % 2}.svg`)
    return (
      <div className={classes.personalInfoBox} {...optionals}>
        <div className={classes.topRow}>
          <div className={classes.avatar}>
            <img src={avatar} />
          </div>
          <div className={classes.name} {...nameOptionals}>
            {user.first_name}
          </div>
        </div>
        <ul className={classes.infoList}>
          {this.infoList.map((item, index) => {
            return (
              <li key={index}>{item}</li>
            )
          })}
        </ul>
      </div>
    )
  }
}
