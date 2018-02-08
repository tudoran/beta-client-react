import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { connect } from 'redux/api'
import { calculatedPortfolio } from 'redux/selectors'
import aggregateSelectedPortfolio from 'helpers/aggregateSelectedPortfolio'
import BasePieChart from 'components/PieChart/PieChart'

const getSelectedPortfolio = ({ assetsClasses, balance, calculatedPortfolio,
  portfolio, positions, tickers }, { intl: { formatNumber } }) =>
  aggregateSelectedPortfolio({ assetsClasses, balance, formatNumber,
    selectedPortfolio: portfolio || calculatedPortfolio, positions, tickers })

class PieChart extends Component {
  static propTypes = {
    assetsClasses: PropTypes.array,
    balance: PropTypes.number,
    calculatedPortfolio: PropTypes.object,
    portfolio: PropTypes.object,
    positions: PropTypes.array,
    tickers: PropTypes.array,
    values: PropTypes.object
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  shouldComponentUpdate (nextProps) {
    const { context } = this
    return !R.equals(
      getSelectedPortfolio(this.props, context),
      getSelectedPortfolio(nextProps, context)
    )
  }

  render () {
    const selectedPortfolio = getSelectedPortfolio(this.props, this.context)

    return <BasePieChart datum={selectedPortfolio} />
  }
}

const requests = ({ goalId }) => {
  const requests = {
    assetsClasses: ({ findAll }) => findAll({
      type: 'assetsClasses',
      url: '/settings/asset-classes'
    }),
    tickers: ({ findAll }) => findAll({
      type: 'tickers',
      url: '/settings/tickers'
    })
  }

  if (goalId) {
    requests.positions = ({ findAll }) => findAll({
      type: 'positions',
      url: `/goals/${goalId}/positions`
    })
  }

  return requests
}

const selector = (state, { values }) => ({
  calculatedPortfolio: calculatedPortfolio(values)(state)
})

export default connect(requests, selector)(PieChart)
