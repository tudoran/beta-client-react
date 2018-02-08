/* eslint-disable */
import R from 'ramda'

export default function() {
    'use strict';

    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = {top: 30, right: 20, bottom: 50, left: 60},
        color = nv.utils.defaultColor(),
        width = null,
        height = null,
        showLegend = false,
        noData = null,
        yDomain2,
        forceY = [0],
        getX = function(d) { return d.x },
        getY = function(d) { return d.y },
        interpolate = 'monotone',
        useVoronoi = true,
        interactiveLayer = nv.interactiveGuideline(),
        useInteractiveGuideline = true,
        legendRightAxisHint = ' (right axis)',
        duration = 0
        ;

    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var x = d3.scale.linear(),
        yScale2 = d3.scale.linear(),

        lines2 = nv.models.line().yScale(yScale2).duration(duration),

        stack2 = nv.models.stackedArea().yScale(yScale2).duration(duration),

        xAxis = nv.models.axis().scale(x).orient('bottom').tickPadding(5).duration(duration),
        yAxis2 = nv.models.axis().scale(yScale2).orient('right').duration(duration),

        tooltip = nv.models.tooltip(),
        dispatch = d3.dispatch();

    var charts = [lines2, stack2];

    function chart(selection) {
        selection.each(function(data) {
            var container = d3.select(this),
                that = this;
            nv.utils.initSVG(container);

            chart.update = function() {
                if( duration === 0 ) {
                    container.call( chart );
                } else {
                    container.transition().duration(duration).call(chart);
                }
            };

            chart.container = this;

            var availableWidth = nv.utils.availableWidth(width, container, margin),
                availableHeight = nv.utils.availableHeight(height, container, margin);

            var dataLines2 = data.filter(function(d) {return d.type == 'line'});
            var dataStack2 = data.filter(function(d) {return d.type == 'area'});

            // Display noData message if there's nothing to show.
            if (!data || !data.length || !data.filter(function(d) { return d.values.length }).length) {
                nv.utils.noData(chart, container);
                return chart;
            } else {
                container.selectAll('.nv-noData').remove();
            }

            var series2 = data.filter(function(d) {return !d.disabled})
                .map(function(d) {
                    return d.values.map(function(d,i) {
                        return { x: getX(d), y: getY(d) }
                    })
                });

            x   .domain(d3.extent(d3.merge(series2), function(d) { return getX(d) }))
                .range([0, availableWidth]);

            var wrap = container.selectAll('g.wrap.multiChart').data([data]);
            var gEnter = wrap.enter().append('g').attr('class', 'wrap nvd3 multiChart').append('g');

            gEnter.append('g').attr('class', 'nv-x nv-axis');
            gEnter.append('g').attr('class', 'nv-y2 nv-axis');
            gEnter.append('g').attr('class', 'stack2Wrap');
            gEnter.append('g').attr('class', 'lines2Wrap');
            gEnter.append('g').attr('class', 'nv-interactive');
            gEnter.append('circle')
                .style('display', 'none')
                .attr('class', 'mouseover-point')
                .attr('r', 2);

            var g = wrap.select('g');

            var color_array = data.map(function(d,i) {
                return data[i].color || color(d, i);
            });

            lines2
                .width(availableWidth)
                .height(availableHeight)
                .interpolate(interpolate)
                .color(color_array.filter(function(d,i) { return !data[i].disabled && data[i].type == 'line'}));
            stack2
                .width(availableWidth)
                .height(availableHeight)
                .color(color_array.filter(function(d,i) { return !data[i].disabled && data[i].type == 'area'}));

            g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var lines2Wrap = g.select('.lines2Wrap')
                .datum(dataLines2.filter(function(d){return !d.disabled}));
            var stack2Wrap = g.select('.stack2Wrap')
                .datum(dataStack2.filter(function(d){return !d.disabled}));

            yScale2
              .domain(forceY)
              .range([availableHeight, 0]);

            lines2.yDomain(yScale2.domain());
            stack2.yDomain(yScale2.domain());

            if(dataStack2.length){d3.transition(stack2Wrap).call(stack2);}
            if(dataLines2.length){d3.transition(lines2Wrap).call(lines2);}

            xAxis
                ._ticks( nv.utils.calcTicksX(availableWidth/100, data) )
                .tickSize(-availableHeight, 0);

            g.select('.nv-x.nv-axis')
                .attr('transform', 'translate(0,' + availableHeight + ')');
            g.select('.nv-x.nv-axis').transition()
                .duration(duration)
                .call(xAxis);

            yAxis2
                ._ticks( nv.utils.calcTicksY(availableHeight/36, data) )
                .tickSize( -availableWidth, 0);

            g.select('.nv-y2.nv-axis').transition()
                .duration(duration)
                .call(yAxis2);

            g.select('.nv-y2.nv-axis')
                .classed('nv-disabled', series2.length ? false : true)
                .attr('transform', 'translate(' + x.range()[1] + ',0)');

            if(useInteractiveGuideline){
                interactiveLayer
                    .width(availableWidth)
                    .height(availableHeight)
                    .margin({left:margin.left, top:margin.top})
                    .svgContainer(container)
                    .xScale(x);
                wrap.select('.nv-interactive').call(interactiveLayer);
            }

            //============================================================
            // Event Handling/Dispatching
            //------------------------------------------------------------

            function mouseover_line(evt) {
                if (evt.series.disableTooltip) {
                    return;
                }

                var yaxis = yAxis2;
                evt.value = evt.point.x;
                evt.series = {
                    value: evt.point.y,
                    color: evt.point.color,
                    key: evt.series.key
                };

                tooltip
                    .duration(0)
                    .headerFormatter(function(d, i) {
			return xAxis.tickFormat()(d, i);
                    })
                    .valueFormatter(function(d, i) {
                        return yaxis.tickFormat()(d, i);
                    })
                    .data(evt)
                    .hidden(false);
            }

            function mouseover_stack(evt) {
                if (evt.series.disableTooltip) {
                    return;
                }

                var yaxis = yAxis2;
                evt.point['x'] = stack2.x()(evt.point);
                evt.point['y'] = stack2.y()(evt.point);

                tooltip
                    .duration(0)
                    .headerFormatter(function(d, i) {
			return xAxis.tickFormat()(d, i);
                    })
                    .valueFormatter(function(d, i) {
                        return yaxis.tickFormat()(d, i);
                    })
                    .data(evt)
                    .hidden(false);
            }

            function clearHighlights() {
              for(var i=0, il=charts.length; i < il; i++){
                var chart = charts[i];
                try {
                  chart.clearHighlights();
                } catch(e){}
              }
            }

            function highlightPoint(seriesIndex, pointIndex, b){
              for(var i=0, il=charts.length; i < il; i++){
                var chart = charts[i];
                try {
                  chart.highlightPoint(seriesIndex, pointIndex, b);
                } catch(e){}
              }
            }

            if(useInteractiveGuideline){
                interactiveLayer.dispatch.on('elementMousemove', function(e) {
                    clearHighlights();
                    var pointXLocation, allData = [];
                    var extent = x.domain();
                    var mouseY = lines2.yScale().invert(e.mouseY)
                    var line = R.compose(
                        R.addIndex(R.reduce)((acc, series, index) => {
                            var currentValues = series.values.filter(function(d, i) {
                                return chart.x()(d,i) >= extent[0] && chart.x()(d,i) <= extent[1];
                            });
                            var pointIndex = nv.interactiveBisect(currentValues, e.pointXValue, chart.x());
                            var point = currentValues[pointIndex];
                            var pointYValue = chart.y()(point, pointIndex);
                            var distance = Math.abs(pointYValue - mouseY)
                            return !series.disabled && !series.disableTooltip &&
                                R.lt(distance, acc.distance)
                                ? {
                                    series,
                                    index,
                                    point,
                                    pointIndex,
                                    distance
                                }
                                : acc
                        }, { distance: Infinity })
                    )(data)

                    wrap.select('.mouseover-point')
                        .style('display', 'inline')
                        .attr('cx', x(line.point.x))
                        .attr('cy', yScale2(line.point.y))

                    interactiveLayer.tooltip
                    .data({
                        value: chart.x()(line.point, line.pointIndex),
                        index: line.pointIndex,
                        series: {
                            key: line.series.key,
                            value: chart.y()(line.point, line.pointIndex),
                            data: line.point
                        }
                    })();

                    interactiveLayer.renderGuideLine(x(chart.x()(line.point, line.pointIndex)));
                });

                interactiveLayer.dispatch.on('elementMouseout',function(e) {
                    clearHighlights();
                    wrap.select('.mouseover-point').style('display', 'none');
                });
            } else {
                lines2.dispatch.on('elementMouseover.tooltip', mouseover_line);
                lines2.dispatch.on('elementMouseout.tooltip', function(evt) {
                    tooltip.hidden(true)
                });

                stack2.dispatch.on('elementMouseover.tooltip', mouseover_stack);
                stack2.dispatch.on('elementMouseout.tooltip', function(evt) {
                    tooltip.hidden(true)
                });
            }
        });

        return chart;
    }

    //============================================================
    // Global getters and setters
    //------------------------------------------------------------

    chart.dispatch = dispatch;
    chart.lines2 = lines2;
    chart.stack2 = stack2;
    chart.xAxis = xAxis;
    chart.yAxis2 = yAxis2;
    chart.tooltip = tooltip;
    chart.interactiveLayer = interactiveLayer;

    chart.options = nv.utils.optionsFunc.bind(chart);

    chart._options = Object.create({}, {
        // simple options, just get/set the necessary values
        width:      {get: function(){return width;}, set: function(_){width=_;}},
        height:     {get: function(){return height;}, set: function(_){height=_;}},
        showLegend: {get: function(){return showLegend;}, set: function(_){showLegend=_;}},
        yDomain2:    {get: function(){return yDomain2;}, set: function(_){yDomain2=_;}},
        noData:    {get: function(){return noData;}, set: function(_){noData=_;}},
        interpolate:    {get: function(){return interpolate;}, set: function(_){interpolate=_;}},
        legendRightAxisHint:    {get: function(){return legendRightAxisHint;}, set: function(_){legendRightAxisHint=_;}},

        // options that require extra logic in the setter
        margin: {get: function(){return margin;}, set: function(_){
            margin.top    = _.top    !== undefined ? _.top    : margin.top;
            margin.right  = _.right  !== undefined ? _.right  : margin.right;
            margin.bottom = _.bottom !== undefined ? _.bottom : margin.bottom;
            margin.left   = _.left   !== undefined ? _.left   : margin.left;
        }},
        color:  {get: function(){return color;}, set: function(_){
            color = nv.utils.getColor(_);
        }},
        duration: {get: function(){return duration;}, set: function(_){
            duration = _;
            lines2.duration(duration);
            xAxis.duration(duration);
            yAxis2.duration(duration);
        }},
        x: {get: function(){return getX;}, set: function(_){
            getX = _;
            lines2.x(_);
            stack2.x(_);
        }},
        y: {get: function(){return getY;}, set: function(_){
            getY = _;
            lines2.y(_);
            stack2.y(_);
        }},
        forceY:  {get: function(){return forceY;}, set: function(_){forceY=_;}},
        useVoronoi: {get: function(){return useVoronoi;}, set: function(_){
            useVoronoi=_;
            lines2.useVoronoi(_);
            stack2.useVoronoi(_);
        }},

        useInteractiveGuideline: {get: function(){return useInteractiveGuideline;}, set: function(_){
            useInteractiveGuideline = _;
            if (useInteractiveGuideline) {
                lines2.interactive(false);
                lines2.useVoronoi(false);
                stack2.interactive(false);
                stack2.useVoronoi(false);
            }
        }}
    });

    nv.utils.initOptions(chart);

    return chart;
};
