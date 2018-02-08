import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

export default class PortfolioHoldingListItem extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.number,
    percent: PropTypes.number,
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired
  }

  render () {
    const { name, value, percent } = this.props
    return (
      <tr>
        <td>{name}</td>
        <td>{percent}%</td>
        <td>
          <FormattedNumber value={value} format='currency' />
        </td>
      </tr>
    )
  }
}
