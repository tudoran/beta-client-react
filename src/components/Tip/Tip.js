import React, { Component, PropTypes } from 'react'
import { MdLightbulbOutline } from 'helpers/icons'
import classes from './Tip.scss'

export default class Tip extends Component {
  static propTypes = {
    arrow: PropTypes.bool,
    children: PropTypes.node
  };

  render () {
    const { arrow, children } = this.props

    return (
      <div className={classes.tip}>
        <div className={classes.icon}>
          <MdLightbulbOutline size='18' />
        </div>
        <div className={classes.text}>
          {children}
        </div>
        {arrow && <span className={classes.arrow} />}
      </div>
    )
  }
}
