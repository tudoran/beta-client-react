import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { FormattedNumber } from 'react-intl'
import classNames from 'classnames'
import d3 from 'd3'
import moment from 'moment'
import nv from 'nvd3'
import R from 'ramda'
import ReactDOMServer from 'react-dom/server'
import { calculatedPortfolio } from 'redux/selectors'
import { getMin, getMax, propsChanged } from 'helpers/pureFunctions'
import { prettyDuration, project } from '../helpers'
import classes from './ProjectionGraph.scss'
import nvProjectionGraph from './nvProjectionGraph.js'

const plots = ({ target }) => ([
  {
    id: 1,
    classed: classes.currentBalance,
    color: '#686868',
    disableTooltip: true,
    key: 'Current balance',
    strokeWidth: 2,
    type: 'line',
    valueCalculator: ({ previousValue }) => previousValue
  },
  {
    id: 2,
    color: '#45a018',
    key: 'What you\'ve invested',
    type: 'line',
    valueCalculator: ({ delta, k, previousValue }) => previousValue + k * delta
  },
  {
    id: 3,
    classed: classes.target,
    color: 'transparent',
    disableTooltip: true,
    key: 'Target',
    type: 'line',
    valueCalculator: R.always(target)
  },
  {
    id: 4,
    classed: classes.line975,
    color: '#aaa',
    key: '97.5%',
    type: 'line',
    zScore: -1.959964
  },
  {
    id: 5,
    color: 'rgba(69,160,24,.4)',
    key: '90%',
    type: 'line',
    zScore: -1.281552
  },
  {
    id: 6,
    classed: classes.line500,
    color: '#003100',
    key: '50%',
    type: 'line',
    zScore: 0
  },
  {
    id: 7,
    color: 'rgba(69,160,24,.4)',
    key: '10%',
    type: 'line',
    zScore: 1.281552
  },
  {
    id: 8,
    classed: classes.line250,
    color: 'rgba(69,160,24,.4)',
    key: '2.5%',
    type: 'line',
    zScore: 1.959964
  },
  {
    id: 9,
    color: 'transparent',
    disableTooltip: true,
    key: '97.5%',
    type: 'area',
    zScore: -1.959964
  },
  {
    id: 10,
    color: 'rgba(69,160,24,.4)',
    disableTooltip: true,
    key: '90%',
    previousId: 9,
    type: 'area',
    zScore: -1.281552
  },
  {
    id: 11,
    color: 'rgba(69,160,24,1)',
    disableTooltip: true,
    key: '50%',
    previousId: 10,
    type: 'area',
    zScore: 0
  },
  {
    id: 12,
    color: 'rgba(69,160,24,1)',
    disableTooltip: true,
    key: '10%',
    previousId: 11,
    type: 'area',
    zScore: 1.281552
  },
  {
    id: 13,
    color: 'rgba(69,160,24,.4)',
    disableTooltip: true,
    key: '2.5%',
    previousId: 12,
    type: 'area',
    zScore: 1.959964
  }
])

const tooltip = (d, context) => {
  const elem = d.series[0]
  const year = d3.time.format('%Y')(new Date(d.value))
  const months = moment(d.value).diff(moment(), 'months') + 1

  return R.isNil(d.series) ? false : (
    <div className='projection-tooltip'>
      <h3>
        Year {year} ({prettyDuration(months)})
      </h3>
      <div className='row'>
        <div className='col-xs-8'>
          <span className='bold-text'>{elem.key}</span>
          {elem.key.indexOf('%') > -1 &&
            <span>&nbsp;chance of having at least</span>}
        </div>
        <div className='col-xs-4 text-right'>
          <span>{yTickFormat(elem.value, context)}</span>
        </div>
      </div>
    </div>
  )
}

const getDatum = props => {
  const { balance, calculatedPortfolio, portfolio, target, values } = props
  const totalBalance = balance + parseFloat(values.oneTimeDeposit || 0)
  const finalPortfolio = portfolio || calculatedPortfolio

  if (finalPortfolio && values) {
    const finalValues = R.mergeAll([
      {
        balance: totalBalance,
        target
      },
      values,
      finalPortfolio
    ])

    return project({
      plots: plots(finalValues),
      values: finalValues
    })
  } else {
    return []
  }
}

const endValueOfSeries = key => R.compose(
  R.prop('y'),
  R.defaultTo({}),
  R.last,
  R.prop('values'),
  R.defaultTo({ values: [] }),
  R.find(R.propEq('key', key)),
  R.defaultTo([])
)

const averageMarketPerformance = endValueOfSeries('50%')

const poorMarketPerformance = endValueOfSeries('97.5%')

const getOnTrack = (datum = [], target) =>
  R.gte(averageMarketPerformance(datum), target)

const xTickFormat = (value, context) => {
  const { intl: { formatDate } } = context
  return formatDate(value, { format: 'monthAndYear', month: 'numeric' })
}

const yTickFormat = (value, context) => {
  const { intl: { formatNumber } } = context
  return formatNumber(value, { format: 'currencyWithoutCents' })
}

const getYFor = (selector, svg) => {
  const element = svg && svg.select(selector)
  const elementNode = element && element.node()
  return elementNode && elementNode.getBBox().y || 0
}

class ProjectionGraph extends Component {
  static propTypes = {
    balance: PropTypes.number,
    calculatedPortfolio: PropTypes.object,
    children: PropTypes.node,
    portfolio: PropTypes.object,
    set: PropTypes.func,
    target: PropTypes.number,
    values: PropTypes.object
  }

  static contextTypes = {
    intl: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.renderGraph = debounce(this.renderGraph, 20, { maxWait: 80 })
  }

  shouldComponentUpdate (nextProps) {
    return propsChanged(['balance', 'calculatedPortfolio', 'children',
      'portfolio', 'target', 'values'], this.props, nextProps)
  }

  componentDidMount () {
    this.datum = getDatum(this.props)
    this.saveState()
    nv.addGraph(this.renderGraph.bind(this))
  }

  componentWillUpdate (nextProps) {
    this.datum = getDatum(nextProps)
    this.saveState()
  }

  componentDidUpdate () {
    !R.isEmpty(this.datum) && this.renderGraph()
  }

  componentWillUnmount () {
    if (this.resizeHandler) {
      this.resizeHandler.clear()
    }
    this.removeTooltips()
  }

  saveState () {
    const { set } = this.props
    const endValue50 = averageMarketPerformance(this.datum)
    set({
      id: 'endValue50',
      value: endValue50
    })
  }

  renderGraph () {
    const { context, datum, resizeHandler } = this
    const { target } = this.props
    const svg = d3.select(this.refs.svg)
    const minY = getMin('y')(datum)
    const maxY = getMax('y')(datum)
    const range = maxY - minY

    this.chart = this.chart ? this.chart : nvProjectionGraph()

    this.chart
      .margin({ top: 30, right: 195, bottom: 50, left: 5 })
      .noData('')
    this.chart.xAxis.tickFormat(d => xTickFormat(d, context))
    this.chart.yAxis2.tickFormat(d => yTickFormat(d, context))
    this.chart.forceY([ minY - 0.15 * range, maxY + 0.15 * range ])

    svg.datum(datum).call(this.chart)

    if (!resizeHandler) {
      this.resizeHandler = nv.utils.windowResize(this.chart.update)
    }

    this.chart.interactiveLayer.tooltip.contentGenerator(
      R.compose(
        ReactDOMServer.renderToStaticMarkup,
        d => tooltip(d, this.context)
      )
    )

    d3.select(this.refs.targetText)
      .attr('y', getYFor(`.${classes.target}`, svg) + 20)

    d3.select(this.refs.currentBalanceText)
      .attr('y', getYFor(`.${classes.currentBalance}`, svg) + 50)

    svg.select(`.${classes.target}`)
      .classed(classes.targetGreen, getOnTrack(datum, target))

    return this.chart
  }

  removeTooltips () {
    // Remove ghost tooltips
    d3.selectAll('.nvtooltip').remove()
  }

  render () {
    const { balance, children, target } = this.props
    const { intl: { formatNumber } } = this.context
    const { datum } = this
    const isDatumEmpty = R.either(R.isEmpty, R.isNil)(datum)
    const formattedTarget = formatNumber(target,
      { format: 'currencyWithoutCents' })
    const formattedBalance = formatNumber(balance,
      { format: 'currencyWithoutCents' })
    const onTrack = getOnTrack(datum, target)
    const className = classNames({
      [classes.projectionGraph]: true,
      [classes.isDatumEmpty]: isDatumEmpty
    })

    return (
      <div className={className} onBlur={this.removeTooltips}>
        {children}
        <Row>
          <Col xs={12}>
            <ul className={classes.performanceValues}>
              <li>
                <h5>Average market performance</h5>
                <div className={classes.performanceValue}>
                  <FormattedNumber value={averageMarketPerformance(datum) || 0}
                    format='currencyWithoutCents' />
                </div>
              </li>
              <li>
                <h5>Poor market performance</h5>
                <div className={classes.performanceValue}>
                  <FormattedNumber value={poorMarketPerformance(datum) || 0}
                    format='currencyWithoutCents' />
                </div>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className={classes.graphWrapper}>
              <div ref='root' className={classes.graph}>
                <svg height='460' className={classes.svg}>
                  <svg ref='svg' height='460' />
                  {!isDatumEmpty && <g>
                    <text ref='targetText'>
                      {onTrack
                        ? <tspan className={classes.success}>ON TRACK </tspan>
                        : <tspan className={classes.danger}>OFF TRACK </tspan>}
                      TO TARGET OF {formattedTarget}
                    </text>
                    <text ref='currentBalanceText'>
                      CURRENT BALANCE {formattedBalance}
                    </text>
                  </g>}
                </svg>
              </div>
              <div className={classes.legend}>
                <div className={classes.legendKey}>
                  <div className={classes.lineAvg} />
                  <div className={classes.legendText}>
                    Average market performance
                  </div>
                </div>
                <div className={classes.legendKey}>
                  <div className={classes.linePoor} />
                  <div className={classes.legendText}>
                    Poor market performance
                  </div>
                </div>
                <div className={classes.legendKey}>
                  <div className={classes.lineDeposit} />
                  <div className={classes.legendText}>
                    Auto deposit and one‑time deposit
                  </div>
                </div>
                <div className={classes.disclaimer}>
                  Nominal values (not inflation adjusted)
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

const selector = (state, { values }) => ({
  calculatedPortfolio: calculatedPortfolio(values)(state)
})

export default connect(selector)(ProjectionGraph)
