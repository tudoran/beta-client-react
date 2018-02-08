import React, { Component, PropTypes } from 'react'
import { FormattedDate, FormattedNumber } from 'react-intl'
import { OverlayTrigger } from 'react-bootstrap'
import classNames from 'classnames'
import { mapIndexed } from 'helpers/pureFunctions'
import { MdInfo } from 'helpers/icons'
import classes from './ActivityListItem.scss'
import Tooltip from 'components/Tooltip/Tooltip'

const memosTooltip = ({ id, memos }) => // eslint-disable-line react/prop-types
  <Tooltip id={`memos-${id}`}>
    <div>
      {mapIndexed((memo, index) =>
        <div key={index}>{memo}</div>
      , memos)}
    </div>
  </Tooltip>

export default class ActivityListItem extends Component {
  static propTypes = {
    allGoals: PropTypes.bool,
    description: PropTypes.string,
    goal: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
  };

  render () {
    const { allGoals, description, goal, item } = this.props

    return (
      <tr>
        {allGoals && <td>
          {goal.name}
        </td>}
        <td>
          <FormattedDate value={item.time * 1000} format='dayMonthAndYear' />
        </td>
        <td>
          <span>{description}</span>
          {item.memos &&
            <OverlayTrigger placement='top' overlay={memosTooltip(item)}>
              <span className={classes.memosIcon}>
                <MdInfo size={18} />
              </span>
            </OverlayTrigger>}
        </td>
        <td className='text-right'>
          {item.amount && <FormattedNumber value={item.amount}
            format='currency' />}
        </td>
        <td className={classNames('text-right', classes.lastColumn)}>
          {item.balance &&
            <FormattedNumber value={item.balance} format='currency' />}
        </td>
      </tr>
    )
  }
}
