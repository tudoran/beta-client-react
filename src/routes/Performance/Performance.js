import React, { Component, PropTypes } from 'react'
import 'nvd3/build/nv.d3.css'
import { Col, Collapse, Row } from 'react-bootstrap'
import { createStructuredSelector } from 'reselect'
import classNames from 'classnames'
import R from 'ramda'
import { connect } from 'redux/api'
import { enabledGoalsSelector, enabledReturnsSelector, performanceSelector }
  from 'redux/selectors'
import { findManySelector } from 'redux/api/selectors'
import { set } from 'redux/modules/performance'
import { show } from 'redux-modal'
import Button from 'components/Button/Button'
import classes from './Performance.scss'
import Graph from './Graph/Graph'
import Selector from './Selector/Selector'
import Spinner from 'components/Spinner/Spinner'
import TimeWeightedReturnModal from './TimeWeightedReturnModal'
import Topbar from './Topbar/Topbar'

const canDisablePlot = enabledPlots => R.length(enabledPlots) > 1

const canEnablePlot = enabledPlots => R.length(enabledPlots) < 6

const startingValue = 1000

const getEnabledPlots = (key, enabledPlots, allPlots) =>
  R.map(
    plot => R.merge(
      plot,
      R.defaultTo({}, R.find(R.propEq(key, plot[key]), allPlots))
    ),
    enabledPlots
  )

const convertToTimestampPercentPairs = (timePercentPairs) =>
  R.compose(
    R.map(([x, y]) => [86400000 * x, y]),
    R.defaultTo([])
  )(timePercentPairs)

const convertToTimestampValuePairs = (timePercentPairs) =>
  R.reduce(
    (acc, [x, y]) => R.concat(acc, [
      [86400000 * x, R.last(acc)[1] * (y + 1)]
    ]),
    [[R.length(timePercentPairs) > 0 ? 86400000 * timePercentPairs[0][0] : 0, startingValue]],
    timePercentPairs
  )

const types = {
  returns: {
    label: '% Returns',
    getData: ({ performanceState: { enabledReturns, enabledGoals }, returns, goals }) =>
      R.concat(
        R.compose(
          R.map(item => {
            return {
              ...item,
              values: convertToTimestampPercentPairs(item.returns)
            }
          }),
          getEnabledPlots
        )('name', enabledReturns, returns),
        R.reduce((acc, goal) => R.concat(acc, R.length(goal.performanceHistory) ? [{
          ...(R.find(R.propEq('id', goal.id), enabledGoals)),
          name: goal.name,
          type: 'balance',
          values: convertToTimestampPercentPairs(goal.performanceHistory)
        }] : []), [], goals)
      )
  },
  values: {
    label: '$ Values',
    getData: ({ performanceState: { enabledReturns, enabledGoals }, returns, goals }) =>
      R.concat(
        R.compose(
          R.map(item => ({
            ...item,
            values: convertToTimestampValuePairs(item.returns)
          })),
          getEnabledPlots
        )('name', enabledReturns, returns),
        R.reduce((acc, goal) => R.concat(acc, R.length(goal.performanceHistory) ? [{
          ...(R.find(R.propEq('id', goal.id), enabledGoals)),
          name: goal.name,
          type: 'balance',
          values: convertToTimestampValuePairs(goal.performanceHistory)
        }] : []), [], goals)
      )
  }
}

export class Performance extends Component {
  static propTypes = {
    goals: PropTypes.array,
    params: PropTypes.object,
    performanceState: PropTypes.object,
    returns: PropTypes.array,
    set: PropTypes.func,
    toggle: PropTypes.func,
    show: PropTypes.func
  }

  render () {
    const { props } = this
    const { performanceState: {
      aboutOpened, activeRangeKey, activeTypeKey, enabledReturns, enabledGoals
    }, params: { accountId }, set, show } = props
    const data = types[activeTypeKey].getData(props)
    const enabledItems = R.concat(enabledReturns, enabledGoals)
    return (
      <div className={classNames('container', classes.performance)}>
        <h1 className={classes['page-title']}>
          Review and compare performance
        </h1>
        <div className='panel'>
          <Row>
            <Col xs={3}>
              <div className={classes.selectorWrapper}>
                <Selector options={types} activeOptionKey={activeTypeKey}
                  setActiveOption={function (key) {
                    set({ activeTypeKey: key })
                  }} />
              </div>
            </Col>
            <Col xs={9}>
              <Topbar accountId={accountId} canDisable={canDisablePlot(enabledItems)}
                canEnable={canEnablePlot(enabledItems)} getEnabled={getEnabledPlots} />
            </Col>
          </Row>
          <div className={classes.graph}>
            {R.isEmpty(data)
            ? <Spinner />
            : <div className={classes.graphInner}>
              <Graph data={data}
                type={activeTypeKey}
                activeRangeKey={activeRangeKey}
                setActiveRange={function (key) {
                  set({ activeRangeKey: key })
                }} />
              <div className='text-right'>
                <div className={classes.aboutToggle}>
                  {aboutOpened
                    ? <Button onClick={function () { set({ aboutOpened: false }) }}
                      bsStyle='link'>Hide</Button>
                    : <Button onClick={function () { set({ aboutOpened: true }) }}
                      bsStyle='link'>Graph info</Button>}
                </div>
                <Collapse in={aboutOpened}>
                  <div
                    className={classNames(classes.aboutContent, 'text-left')}>
                    <p><strong>Graph info</strong></p>
                    {activeTypeKey === 'returns' &&
                      <p>
                        This graph shows the time-weighted return of a goal with
                        benchmarks and model portfolios to compare against over a
                        selected period of time. A time-weighted return takes into
                        account external cash flows, these might include such things
                        as dividends, deposits and withdrawals, all of which are key
                        attributes of a goal portfolio. By showing the portfolio in
                        such a way, we can demonstrate performance against other
                        benchmarks and model allocations in a like-for-like manner.
                        <a href='javascript:;' target='_blank'
                          onClick={function () { show('timeWeightedReturnModal') }}>
                          See more on time-weighted returns
                        </a>.
                      </p>
                    }
                    {activeTypeKey === 'values' &&
                      <p>
                        This graph shows your goal value over time, along with
                        contributions made to the goal. The line indicates values
                        at each point of time.
                      </p>
                    }
                    <TimeWeightedReturnModal />
                  </div>
                </Collapse>
              </div>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  performanceState: performanceSelector,
  goals: state =>
    findManySelector({
      type: 'goals',
      ids: R.map(R.prop('id'), enabledGoalsSelector(state))
    })(state),
  returns: state =>
    findManySelector({
      type: 'returns',
      ids: R.map(R.prop('name'), enabledReturnsSelector(state)),
      key: 'name'
    })(state)
})

const actions = { set, show }

export default connect(null, selector, actions)(Performance)
