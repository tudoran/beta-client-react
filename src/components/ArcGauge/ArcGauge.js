import React, { Component, PropTypes } from 'react'
import d3 from 'd3'
import ReactDOM from 'react-dom'
import R from 'ramda'
import { forEachIndexed } from 'helpers/pureFunctions'

export default class ArcGauge extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    width: PropTypes.number,
    size: PropTypes.number,
    radius: PropTypes.number,
    sections: PropTypes.any,
    arrow: PropTypes.object
  };

  static defaultProps = {
    width: '100%',
    arrow: {
      height: 55,
      width: 5,
      color: '#a5a5a5'
    }
  }

  componentDidMount () {
    return this.renderArcGauge(true)
  }

  componentDidUpdate () {
    return this.renderArcGauge(false)
  }

  get value () {
    const { value } = this.props
    return value * 100
  }

  render () {
    return <div className='gauge-el' />
  }

  renderArcGauge (animate = true) {
    const el = ReactDOM.findDOMNode(this)
    const { arrow, radius, sections, size, width } = this.props
    const { value } = this
    const height = width / 2
    const numberOfSections = R.length(sections)
    const sectionFill = 1 / numberOfSections / 2
    const sectionSpaces = 0.05
    const padStart = sectionSpaces / 2
    const padEnd = numberOfSections ? 0 : sectionSpaces / 2
    let rotateAngle = 0.75

    while (el.firstChild) {
      el.removeChild(el.firstChild)
    }

    // Draw svg
    const svg = d3.select(el).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height + ')')

    const meter = svg.append('g')
        .attr('class', 'progress-meter')

    // Generate path
    forEachIndexed((section, index) => {
      const arcStart = this._percToRad(rotateAngle)
      const arcEnd = arcStart + this._percToRad(sectionFill)
      rotateAngle += sectionFill

      const arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - size)
        .startAngle(arcStart + padStart)
        .endAngle(arcEnd - padEnd)

      meter.append('path')
        .attr('d', arc)
        .attr('id', 'gauge-path-' + index)
        .attr('class', 'gauge-section-' + index)
        .attr('fill', section)
    }, sections)

    // Draw and animate arrow with default or provided styles
    if (animate) {
      this._drawArrow(meter, 0, arrow.color, arrow.width, arrow.height)
      this._animateArrow(meter, value * 0.01, arrow.width, arrow.height)
    } else {
      this._drawArrow(meter, value * 0.01, arrow.color, arrow.width, arrow.height)
    }

    meter.transition()

    return meter
  }

  _animateArrow (el, perc, width, height) {
    const self = this
    return el.transition()
      .delay(300)
      .ease('easeInOutQuint')
      .duration(800 * perc)
      .selectAll('.gauge-arrow')
      .each('end', function () {
        d3.select(this)
          .transition()
          .ease('quad')
          .duration(800 * perc)
          .tween('linear', () => percentOfPercent =>
            d3.select(this)
              .attr('d', self._mkCmd(width, height, percentOfPercent * perc))
          )
      })
  }

  _drawArrow (el, perc, color, width, height) {
    el.append('circle')
      .attr('class', 'gauge-arrow-center')
      .attr('cx', 0).attr('cy', 0)
      .attr('fill', color)
      .attr('r', width)

    return el.append('path')
      .attr('class', 'gauge-arrow')
      .attr('fill', color)
      .attr('d', this._mkCmd(width, height, perc))
  }

  _mkCmd (width, height, perc) {
    const thetaRad = this._percToRad(perc / 2)
    const centerX = 0
    const centerY = 0
    const topX = centerX - height * Math.cos(thetaRad)
    const topY = centerY - height * Math.sin(thetaRad)
    const leftX = centerX - width * Math.cos(thetaRad - Math.PI / 2)
    const leftY = centerY - width * Math.sin(thetaRad - Math.PI / 2)
    const rightX = centerX - width * Math.cos(thetaRad + Math.PI / 2)
    const rightY = centerY - width * Math.sin(thetaRad + Math.PI / 2)
    return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY
  }

  _percToDeg (perc) {
    return perc * 360
  }

  _percToRad (perc) {
    return this._degToRad(this._percToDeg(perc))
  }

  _degToRad (deg) {
    return deg * Math.PI / 180.5
  }

  _deg2rad (deg) {
    return deg / 180 * Math.PI
  }
}
