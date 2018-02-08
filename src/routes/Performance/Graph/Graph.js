import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import d3 from 'd3'
import moment from 'moment'
import nv from 'nvd3'
import R from 'ramda'
import { dataAfterDate } from 'helpers/pureFunctions'
import classes from './Graph.scss'
import Selector from '../Selector/Selector'

const ranges = {
  all: {
    label: 'All',
    value: (now, datum) => R.compose(
      R.reduce(R.min, Infinity),
      R.map(({ values }) => values[0] && values[0].x)
    )(datum)
  },
  yearToDate: {
    label: 'YTD',
    value: now => now.startOf('year').valueOf()
  },
  year: {
    label: '1y',
    value: now => now.subtract(1, 'years').valueOf()
  },
  halfYear: {
    label: '6m',
    value: now => now.subtract(6, 'months').valueOf()
  }
}

const getDatum = R.map(item => ({
  ...item,
  key: item.name,
  values: R.map(([ x, y ]) => ({
    x: parseInt(x, 10),
    y: y
  }), item.values)
}))

const getFilteredDatum = ({ value }, allDatum) =>
  dataAfterDate(value(moment(), allDatum), allDatum)

const xAxisTickFormat = d => d3.time.format('%b %Y')(new Date(d))

const yAxisTickFormat = {
  returns: d => (parseFloat(d) * 100).toFixed(1) + '%',
  values: d => '$ ' + parseFloat(d).toFixed(1)
}

const x2AxisTickFormat = d => d3.time.format('%b %Y')(new Date(d))

export default class Graph extends Component {
  static propTypes = {
    activeRangeKey: PropTypes.string,
    data: PropTypes.array,
    type: PropTypes.string,
    setActiveRange: PropTypes.func
  }

  componentDidMount () {
    const { datum } = this
    !R.isEmpty(datum) && nv.addGraph(this.renderGraph.bind(this))
  }

  componentDidUpdate () {
    const { datum } = this
    !R.isEmpty(datum) && this.renderGraph()
  }

  renderGraph () {
    const { activeRangeKey, type, data } = this.props
    const activeRange = ranges[activeRangeKey]
    const allDatum = getDatum(data)
    const datum = getFilteredDatum(activeRange, allDatum)
    const endX = R.compose(
      R.reduce(R.max, -Infinity),
      R.map(R.compose(R.prop('x'), R.defaultTo({}), R.last, R.prop('values')))
    )(datum)

    // We try to reuse the current chart instance.
    // If not possible then lets instantiate again
    if (!this.chart || this.rendering) {
      this.chart = nv.models.lineWithFocusChart()
        .interpolate('cardinal')
        .margin({ left: 30, right: 50 })
        .showLegend(false)
        .duration(350)
        .rightAlignYAxis(true)
        .useInteractiveGuideline(true)
        .focusHeight(90)
        .brushExtent([activeRange.value(moment(), allDatum), endX])

      this.chart.xAxis.tickFormat(xAxisTickFormat)
      this.chart.yAxis.tickFormat(yAxisTickFormat[type])
      this.chart.x2Axis.tickFormat(x2AxisTickFormat)
    }

    // Render chart using d3
    this.selection = d3.select(this.refs.svg).datum(datum).call(this.chart)

    this.chart.dispatch.on('renderEnd', this.renderEnd)
    this.rendering = true
    return this.chart
  }

  renderEnd (e) {
    // Once renders end then we set rendering to false to allow to
    // reuse the chart instance.
    this.rendering = false
  }

  render () {
    const { activeRangeKey, setActiveRange } = this.props

    return (
      <div className={classes.graph}>
        <Row>
          <Col xs={12}>
            <div className='pull-right'>
              <Selector activeOptionKey={activeRangeKey} options={ranges}
                setActiveOption={setActiveRange} />
            </div>
          </Col>
        </Row>
        <svg ref='svg' />
      </div>
    )
  }
}
