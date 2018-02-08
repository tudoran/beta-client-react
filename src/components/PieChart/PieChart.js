import React, { Component, PropTypes } from 'react'
import { MdLens } from 'helpers/icons'
import classNames from 'classnames'
import d3 from 'd3'
import nv from 'nvd3'
import R from 'ramda'
import ReactDOMServer from 'react-dom/server'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './PieChart.scss'
import colors from 'constants/colors'

const tooltip = item =>
  <div className={classes.piechartTooltip}>
    <div className={classes.colorNote}>
      <MdLens style={{ color: item.color }} />
    </div>
    <div className={classes.tooltipContent}>
      <div className={classes.tooltipTitle}>
        {item.data.assetClass && item.data.assetClass.display_name}
      </div>
      <div>{Math.round(item.data.percent * 100) / 100}%</div>
    </div>
  </div>

const renderTooltip = R.compose(
  ReactDOMServer.renderToStaticMarkup,
  tooltip
)

const investmentType = R.path(['assetClass', 'investment_type'])

const isType = key => R.compose(R.equals(key), investmentType)

const aggregateByType = key => R.filter(isType(key))

const label = key => R.compose(
  R.prop('percent'),
  R.find(isType(key))
)

const getBondsPercentage = R.compose(
  Math.round,
  R.sum,
  R.map(R.prop('percent'))
)

const emptyItem = () => ({
  percent: 0
})

const aggregatedStocks = aggregateByType('STOCKS')
const aggregatedBonds = aggregateByType('BONDS')
const bondsLabel = label('BONDS')
const stocksLabel = label('STOCKS')

const donutX = R.compose(
  R.prop('display_name'),
  R.defaultTo({}),
  R.prop('assetClass')
)

const donutColor = R.compose(
  R.prop('primary_color'),
  R.defaultTo({}),
  R.prop('assetClass')
)

const aggregationX = R.prop('investment_type')

const aggregationY = R.prop('percent')

const aggregationColor = R.ifElse(
  isType('BONDS'),
  R.always(colors.DONUT_VIEW.BONDS),
  R.always(colors.DONUT_VIEW.STOCKS)
)

const getDatum = R.compose(
  R.slice(0, 100),
  R.flip(R.concat)(R.times(emptyItem, 100)),
  R.sortBy(investmentType)
)

const getAggregatedData = datum => {
  const finalDatum = getDatum(datum)
  const bonds = aggregatedBonds(finalDatum)
  const stocks = aggregatedStocks(finalDatum)
  const bondsPercentage = getBondsPercentage(bonds)

  return [
    {
      percent: bondsPercentage,
      assetClass: { investment_type: 'BONDS' },
      items: bonds
    },
    {
      percent: 100 - bondsPercentage,
      assetClass: { investment_type: 'STOCKS' },
      items: stocks
    }
  ]
}

const size = 225

export default class PieChart extends Component {
  static propTypes = {
    datum: PropTypes.array,
    isPending: PropTypes.bool
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['datum', 'isPending'], this.props, nextProps)
  }

  componentDidMount () {
    nv.addGraph(this.renderDonut.bind(this))
    nv.addGraph(this.renderAggregation.bind(this))
  }

  componentDidUpdate () {
    this.renderDonut()
    this.renderAggregation()
  }

  componentWillUnmount () {
    if (this.resizeHandler) {
      this.resizeHandler.clear()
    }
  }

  renderDonut () {
    this.chart = this.chart ? this.chart : nv.models.pieChart()

    this.chart
      .x(donutX)
      .y(R.prop('percent'))
      .margin({left: 0, right: 0, top: 0, bottom: 0})
      .width(size)
      .height(size)
      .color(donutColor)
      .showLabels(false)
      .showLegend(false)
      .noData('')

    this.chart.tooltip.contentGenerator(renderTooltip)

    this.selection = d3.select(this.refs.donut)
      .datum(getDatum(this.props.datum))
      .call(this.chart)

    if (!this.resizeHandler) {
      this.resizeHandler = nv.utils.windowResize(this.chart.update)
    }

    this.bindHandlers()
    this.renderCircle()

    return this.chart
  }

  renderAggregation () {
    this.aggregationChart = this.aggregationChart
      ? this.aggregationChart : nv.models.pieChart()

    const aggregatedData = getAggregatedData(this.props.datum)

    this.aggregationChart = this.aggregationChart
      .x(aggregationX)
      .y(aggregationY)
      .margin({ top: -10, right: -10, bottom: -10, left: -10 })
      .width(size)
      .height(size)
      .color(aggregationColor)
      .showLabels(false)
      .showLegend(false)

    this.aggregateSelection = d3.select(this.refs.aggregate)
      .datum(aggregatedData)
      .transition()
      .attr('width', size)
      .attr('height', size)
      .style('display', 'none')
      .call(this.aggregationChart)

    return this.aggregationChart
  }

  renderCircle () {
    const donut = d3.select(this.refs.donut)

    donut.selectAll('circle.hole').remove()

    donut
      .append('circle')
      .attr('class', 'hole')
      .attr('cx', String(size / 2)).attr('cy', String(size / 2))
      .attr('r', String(size / Math.PI))
      .style('fill', colors.BASE_GRAPH.FILL)
  }

  bindHandlers () {
    const component = this
    d3.select(this.refs.donut)
      .selectAll('.nv-slice')
      .on('mouseover.foo', function (r, i) {
        component.expandSlice(d3.select(this))
        component.showDonutRim(investmentType(r.data))
        component.donutHoleOut()
        isType('BONDS')(r.data)
          ? component.donutHoleBondsOver()
          : component.donutHoleStocksOver()
      })
      .on('mouseout.foo', function (e, r) {
        d3.select(component.refs.aggregate).style('display', 'none')
        component.contractSlice(d3.select(this))
        component.donutHoleOut()
      })
  }

  expandSlice (e) {
    e.attr('transform', 'scale(1.0)')
  }

  contractSlice (e) {
    e.attr('transform', 'scale(1.0)')
  }

  showDonutRim (e) {
    d3.select(this.refs.aggregate)
      .style('display', 'block')

    d3.select(this.refs.aggregate)
      .selectAll('.nv-slice')
      .each(function (t) {
        d3.select(this).style('display', isType(e)(t.data) ? null : 'none')
      })
  }

  donutHoleStocksOver = (e) => {
    d3.select(this.refs.holeText)
      .selectAll('.stocks > *')
      .style('color', colors.DONUT_VIEW.STOCKS_TEXT)

    this.showDonutRim('STOCKS')
  }

  donutHoleBondsOver = (e) => {
    d3.select(this.refs.holeText)
      .selectAll('.bonds > *')
      .style('color', colors.DONUT_VIEW.BONDS_TEXT)

    this.showDonutRim('BONDS')
  }

  donutHoleOut = (e) => {
    d3.select(this.refs.holeText)
      .selectAll('.bonds > *, .stocks > *')
      .style('color', 'inherit')

    d3.select(this.refs.aggregate)
      .style('display', 'none')
  }

  expandSliceWithName (e) {
    const { contractAllSlices, expandSlice } = this
    contractAllSlices()
    d3.select(this.refs.donut).selectAll('.nv-slice').each(function (n) {
      if (R.equals(n.data.assetClass, e)) {
        expandSlice(d3.select(this))
      }
    })
  }

  contractAllSlices () {
    this.contractSlice(d3.select(this.refs.donut).selectAll('.nv-slice'))
  }

  render () {
    const { datum, isPending } = this.props
    const aggregatedData = getAggregatedData(datum)
    const bonds = bondsLabel(aggregatedData)
    const stocks = stocksLabel(aggregatedData)
    const isEmpty = R.isEmpty(datum)
    const className = classNames({
      [classes['pie-chart']]: true,
      [classes.isPieChartEmpty]: isEmpty
    })

    return (
      <div ref='root' className={className}>
        <svg ref='donut'
          className={classes.donut}
          width={this.size}
          height={this.size} />
        <svg ref='aggregate'
          className={classes.aggregate}
          width={this.size}
          height={this.size} />
        <div ref='holeText'
          className={classNames(classes['hole-text'], 'hole-text')}>
          {R.isEmpty(datum)
            ? <div className={classNames(classes['title'], 'title')}>
              {isPending ? 'Loading' : 'No Data'}
            </div>
            : <div>
              <div className={classNames(classes['stocks'], 'stocks')}
                onMouseOver={this.donutHoleStocksOver}
                onMouseOut={this.donutHoleOut}>
                <span
                  className={classNames(classes['allocation'], 'allocation')}>
                  {stocks}
                </span>
                <div className={classNames(classes['title'], 'title')}>
                  Stocks
                </div>
              </div>
              <div className={classNames(classes['bonds'], 'bonds')}
                onMouseOver={this.donutHoleBondsOver}
                onMouseOut={this.donutHoleOut}>
                <span
                  className={classNames(classes['allocation'], 'allocation')}>
                  {bonds}
                </span>
                <div className={classNames(classes['title'], 'title')}>
                  Bonds
                </div>
              </div>
            </div>}
        </div>
      </div>
    )
  }
}
