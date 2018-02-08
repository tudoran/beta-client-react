import React, { Component, PropTypes } from 'react'
import { Table } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import { holdingName, sortHoldings, unallocatedForGoal } from '../../helpers'
import PortfolioHoldingListItem from '../PortfolioHoldingListItem'
import R from 'ramda'

export default class PortfolioHoldingList extends Component {
  static propTypes = {
    holdings: PropTypes.array,
    goal: PropTypes.object
  };

  static defaultProps = {
    holdings: [],
    goal: {}
  };

  render () {
    const { holdings, goal } = this.props
    const unallocated = unallocatedForGoal(goal, holdings)

    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Holding</th>
            <th>Allocated</th>
            <th>Value</th>
          </tr>
        </thead>

        <tfoot>
          <tr>
            <td colSpan="2">Total</td>
            <td>
              <FormattedNumber value={goal.balance} format='currency' />
            </td>
          </tr>
        </tfoot>

        <tbody>
          {R.map(
            h => <PortfolioHoldingListItem {...h} name={holdingName(h)} key={h.id} />,
            sortHoldings(holdings))}

          <PortfolioHoldingListItem {...unallocated} name={holdingName(unallocated)}/>
        </tbody>
      </Table>
    )
  }
}
