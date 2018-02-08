import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import classNames from 'classnames'
import moment from 'moment'
import R from 'ramda'
import { FormattedNumber } from 'react-intl'
import { calculatedPortfolio, endValue50Selector } from 'redux/selectors'
import { getNumberOfperiods, getPeriodDelta, getPortEr,
  prettyDuration } from '../helpers'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './RecommendedValues.scss'

const deadZone = (target) => target * 0.01

const renderRecommendation = (value, onClick, displayValue) =>
  <div className={classNames(classes.recommendation,
      {[classes.recommendationVisible]: !R.isNil(value)})}>
    <div className={classes.arrow} />
    <div className={classes.label}>
      Recommended
    </div>
    <div className={classes.value} onClick={function () { onClick(value) }}>
      {displayValue ||
        (value && <FormattedNumber value={value} format='currency' />)}
    </div>
  </div>

const filterDeposit = ({ current = 0, endValue50, recommended, deposit, target }) =>
  R.gte(recommended, 0) &&
  R.gt(Math.abs(recommended - current), 1) &&
  (endValue50 < target || R.gt(deposit, deadZone(target)))
    ? recommended
    : null

const getCurrentMonthlyDepositAmount = ({ values }) => {
  const { monthlyDepositAmount } = values
  const finalValue = monthlyDepositAmount || 0
  return parseFloat(finalValue)
}

const getMonthlyDepositAmount = (props) => {
  const { balance, target, values } = props
  const er = getPortEr(values)
  const k = getNumberOfperiods(moment(), values)
  const recommended = (target - balance * Math.pow(er, k)) * (er - 1) /
    (Math.pow(er, k) - 1)

  return filterDeposit({
    ...props,
    current: getCurrentMonthlyDepositAmount(props),
    recommended,
    deposit: k * recommended,
    target
  })
}

const getOneTimeDeposit = (props) => {
  const { balance, target, values } = props
  const er = getPortEr(values)
  const k = getNumberOfperiods(moment(), values)
  const delta = getPeriodDelta(values)
  const recommended = (target - delta * (Math.pow(er, k) - 1) / (er - 1)) /
    Math.pow(er, k) - balance

  return filterDeposit({
    ...props,
    current: values.oneTimeDeposit,
    recommended,
    deposit: recommended,
    target
  })
}

const getDuration = ({ balance, target, values }) => {
  const delta = getPeriodDelta(values)
  const er = getPortEr(values)
  let n = 0
  let projection = balance

  while (projection < target) {
    n = n + 1
    projection = projection + Math.pow(er, n) * (balance * (er - 1) + delta)
  }

  return Math.abs(n - values.duration) > 0 ? n : null
}

const shouldShow = R.any(R.compose(R.not, R.isNil))

class RecommendedValues extends Component {
  static propTypes = {
    balance: PropTypes.number,
    calculatedPortfolio: PropTypes.object,
    endValue50: PropTypes.number,
    portfolio: PropTypes.object,
    setDuration: PropTypes.func,
    setMonthlyTransactionAmount: PropTypes.func,
    setOneTimeDeposit: PropTypes.func,
    target: PropTypes.number,
    values: PropTypes.object
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['balance', 'calculatedPortfolio', 'duration',
      'endValue50', 'portfolio', 'target', 'values'], this.props, nextProps)
  }

  render () {
    const { props } = this
    const { balance, calculatedPortfolio, portfolio, setDuration,
      setMonthlyTransactionAmount, setOneTimeDeposit, target, values } = props
    const finalPortfolio = portfolio || calculatedPortfolio

    if (R.isNil(finalPortfolio)) {
      return false
    }

    const finalBalance = balance + parseFloat(values.oneTimeDeposit || 0)
    const finalValues = R.merge(values, finalPortfolio || {})
    const recMonthlyDeposit = getMonthlyDepositAmount({ ...props,
      balance: finalBalance, target, values: finalValues })
    const recOneTimeDeposit = getOneTimeDeposit({ ...props, balance, target,
      values: finalValues })
    const recDuration = getDuration({ ...props, balance: finalBalance, target,
      values: finalValues })
    const rowClasses = classNames({
      [classes.row]: true,
      [classes.rowHidden]: !shouldShow([recMonthlyDeposit, recOneTimeDeposit,
        recDuration])
    })

    return (
      <Row className={rowClasses}>
        <Col xs={4}>
          {renderRecommendation(recMonthlyDeposit, setMonthlyTransactionAmount)}
        </Col>
        <Col xs={4}>
          {renderRecommendation(recOneTimeDeposit, setOneTimeDeposit)}
        </Col>
        <Col xs={4}>
          {renderRecommendation(recDuration, setDuration,
            prettyDuration(recDuration))}
        </Col>
      </Row>
    )
  }
}

const selector = (state, { values }) => ({
  calculatedPortfolio: calculatedPortfolio(values)(state),
  endValue50: R.compose(R.prop('value'), R.defaultTo({}), endValue50Selector)(state)
})

export default connect(selector)(RecommendedValues)
