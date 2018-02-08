import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import R from 'ramda'
import { calculatedPortfolioFootprint } from 'redux/selectors'
import { connect } from 'redux/api'
import { buildAllocationMetric, serializeSettings } from '../helpers'
import { mapIndexed, propsChanged } from 'helpers/pureFunctions'
import classes from './CalculatePortfolio.scss'
import schema from 'schemas/allocation'
import Spinner from 'components/Spinner/Spinner'

const getValidationErrors = ({ values }) =>
  schema.validate(values)

const valid = R.compose(R.isEmpty, getValidationErrors)

const settingQueryParam = ({ settings, values: { constraints, rebalanceThreshold,
  risk }, values }) => {
  const metrics = R.prepend(
    buildAllocationMetric({ settings, rebalanceThreshold, risk }),
    constraints
  )

  return encodeURIComponent(
    JSON.stringify(serializeSettings({
      settings,
      values: R.merge(values, { metrics })
    }))
  )
}

const mergeParams = R.pick(['constraints', 'goalId', 'risk'])

const deserializeAllPortfoliosResponse = R.map(item => ({
  ...item.portfolio,
  risk: item.risk_score
}))

const maybeRequestPortfolios = (nextProps, props, firstRun) => {
  const { calculateAllPortfolios, calculatePortfolio, settings, values,
    viewedSettings } = nextProps
  const { goalId } = values
  const isValid = valid(nextProps)
  const constraintsOrGoalChanged = propsChanged(['constraints', 'goalId'],
    props.values, nextProps.values)

  if (isValid && (firstRun || constraintsOrGoalChanged)) {
    const setting = settingQueryParam({ settings, values, viewedSettings })

    calculatePortfolio({
      url: `/goals/${goalId}/calculate-portfolio?setting=${setting}`,
      mergeParams: mergeParams(values)
    })

    calculateAllPortfolios({
      url: `/goals/${goalId}/calculate-all-portfolios?setting=${setting}`,
      mergeParams: mergeParams(values)
    })
  }
}

class CalculatePortfolio extends Component {
  static propTypes = {
    calculateAllPortfolios: PropTypes.func,
    calculatePortfolio: PropTypes.func,
    portfolio: PropTypes.object,
    requests: PropTypes.object,
    settings: PropTypes.object,
    values: PropTypes.object,
    viewedSettings: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['portfolio', 'requests', 'settings', 'values',
      'viewedSettings'], this.props, nextProps)
  }

  componentWillMount () {
    maybeRequestPortfolios(this.props, this.props, true)
  }

  componentWillReceiveProps (nextProps) {
    maybeRequestPortfolios(nextProps, this.props,
      R.isEmpty(nextProps.calculatePortfolioValue))
  }

  render () {
    const { props } = this
    const { portfolio, requests: { calculatePortfolio = {} } } = props
    const { error, status } = calculatePortfolio
    const validationErrors = getValidationErrors(props)
    const finalValidationErrors = R.omit('constraints', validationErrors)

    if (portfolio) {
      return false
    } else if (!R.isEmpty(finalValidationErrors)) {
      return (
        <div className={classNames(classes.calculate, classes.overlay)}>
          <div className='text-danger'>
            {mapIndexed((error, index) =>
              <div key={index}>{error}</div>
            , R.values(finalValidationErrors))}
          </div>
        </div>
      )
    } else if (R.equals(status, 'pending')) {
      return (
        <div className={classNames(classes.calculate,
          classes.overlayTransparent)}>
          <Spinner />
        </div>
      )
    } else if (R.equals(status, 'rejected')) {
      return (
        <div className={classNames(classes.calculate, classes.overlay)}>
          <span className='text-danger'>
            {error && error.reason}
          </span>
        </div>
      )
    } else {
      return false
    }
  }
}

const requestProps = {
  type: 'calculatedPortfolios',
  footprint: calculatedPortfolioFootprint,
  lazy: true
}

const requests = ({ settings, values, viewedSettings }) => {
  const { goalId } = values
  const setting = settingQueryParam({ settings, values, viewedSettings })

  return {
    calculatePortfolio: ({ findSingle }) => findSingle({
      ...requestProps,
      url: `/goals/${goalId}/calculate-portfolio?setting=${setting}`
    }),
    calculateAllPortfolios: ({ findAll }) => findAll({
      ...requestProps,
      deserialize: deserializeAllPortfoliosResponse,
      url: `/goals/${goalId}/calculate-all-portfolios?setting=${setting}`
    })
  }
}

export default connect(requests)(CalculatePortfolio)
