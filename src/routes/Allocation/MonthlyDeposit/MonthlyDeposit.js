import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import { getMonthlyTransactionAmount } from '../helpers'
import { propsChanged } from 'helpers/pureFunctions'
import InputField from '../InputField/InputField'
import CurrencyInput from 'components/CurrencyInput/CurrencyInput'

export default class MonthlyDeposit extends Component {
  static propTypes = {
    monthlyTransactionAmount: PropTypes.object,
    settings: PropTypes.object
  };

  static defaultProps = {
    settings: {}
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['monthlyTransactionAmount', 'settings'],
      this.props, nextProps)
  }

  render () {
    const { monthlyTransactionAmount, settings } = this.props
    const savedMonthlyTransactionAmount = getMonthlyTransactionAmount(settings) || 0

    return (
      <InputField
        field={monthlyTransactionAmount}
        savedValue={savedMonthlyTransactionAmount}
        label='Monthly Auto Deposit'
        input={<CurrencyInput {...monthlyTransactionAmount} />}
        helpText={(<span><FormattedNumber value={savedMonthlyTransactionAmount}
          format='currency' /> current</span>)}
      />
    )
  }
}
