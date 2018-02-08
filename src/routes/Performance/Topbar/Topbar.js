import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { Col, Row } from 'react-bootstrap'
import R from 'ramda'
import { connect } from 'redux/api'
import { disableReturn, enableReturn, disableGoal, enableGoal } from 'redux/modules/performance'
import { enabledReturnsSelector, enabledGoalsSelector } from 'redux/selectors'
import { FaCheck } from 'helpers/icons'
import classes from '../Topbar/Topbar.scss'
import EnabledGoal from '../EnabledGoal/EnabledGoal'
import Select from 'components/Select/Select'

const group = R.groupBy(R.prop('group'))

const groupTitle = {
  BENCHMARK: 'Benchmarks',
  STRATEGY: 'BetaSmartz Allocations'
}

const enableFirstItem = ({
  enabledReturns, enableReturn, returns,
  enabledGoals, enableGoal, goals
}) => {
  const enabledItems = R.concat(enabledReturns, enabledGoals)
  if (R.length(enabledItems) < 1) {
    if (R.length(returns) > 0) {
      enableReturn({ name: returns[0].name })
    // } else if (R.length(goals) > 0) {
    //   enableGoal({ id: goals[0].id })
    }
  }
}

class TopBar extends Component {
  static propTypes = {
    canDisable: PropTypes.bool,
    canEnable: PropTypes.bool,
    disableReturn: PropTypes.func,
    enabledReturns: PropTypes.array,
    enableReturn: PropTypes.func,
    getEnabled: PropTypes.func,
    disableGoal: PropTypes.func,
    enableGoal: PropTypes.func,
    enabledGoals: PropTypes.array,
    returns: PropTypes.array,
    goals: PropTypes.array
  };

  componentWillMount () {
    enableFirstItem(this.props)
  }

  componentWillReceiveProps (nextProps) {
    enableFirstItem(nextProps)
  }

  handleSelectChange (values) {
    const { enableReturn, disableReturn, enabledGoals, enabledReturns,
      enableGoal, disableGoal, canEnable } = this.props
    const enabledItems = R.concat(
      R.map(item => R.merge(item, { group: 'goals' }), enabledGoals),
      enabledReturns
    )

    const cmp1 = (a, b) => a.name === b.value || a.id === b.value
    const cmp2 = (a, b) => a.value === b.name || a.value === b.id

    R.forEach((item) => (
      item.group === 'goals'
        ? disableGoal({ id: item.id })
        : disableReturn({ name: item.name })
    ), R.differenceWith(cmp1, enabledItems, values))

    if (!canEnable) return

    R.forEach((item) => {
      item.group === 'goals'
        ? enableGoal({ id: item.value })
        : enableReturn({ name: item.value })
    }, R.differenceWith(cmp2, values, enabledItems))
  }

  renderValue (option) {
    return (
      <span>
        {option.group === 'goals'
          ? <EnabledGoal goalId={option.value} label={option.label} />
          : option.label
        }
        <span className={classes.colorBox}
          style={{ backgroundColor: option.color }} />
      </span>
    )
  }

  renderOption = (option) => {
    const { enabledReturns, enabledGoals } = this.props
    const isEnabled = option.value
      ? (option.group === 'goals'
        ? typeof R.find(R.propEq('id', option.value))(enabledGoals) !== 'undefined'
        : typeof R.find(R.propEq('name', option.value))(enabledReturns) !== 'undefined')
      : false
    return (
      <div className={classes.optionItem}>
        {option.label}
        {isEnabled &&
          <span className='pull-right'><FaCheck /></span>
        }
      </div>
    )
  }

  get selectOptions () {
    const { returns, goals, enabledReturns, enabledGoals, canEnable } = this.props
    const returnsGroups = group(R.map(o => ({
      value: o.name,
      label: o.name,
      group: o.group,
      disabled: !canEnable || typeof R.find(R.propEq('name', o.name))(enabledReturns) !== 'undefined'
    }), returns))

    const goalsOptions = R.map(o => ({
      value: o.id,
      label: o.name,
      group: 'goals',
      disabled: !canEnable || typeof R.find(R.propEq('id', o.id))(enabledGoals) !== 'undefined'
    }), goals)

    const options = []
    for (let prop in returnsGroups) {
      options.push({
        options: returnsGroups[prop],
        label: groupTitle[prop]
      })
    }

    options.push({
      options: goalsOptions,
      label: 'Goals'
    })

    return options
  }

  get enabledOptions () {
    const { enabledReturns, enabledGoals, goals } = this.props
    const returnsOptions = R.map(o => ({
      value: o.name,
      label: o.name,
      color: o.color
    }), enabledReturns)

    const goalsOptions = R.map(o => ({
      value: o.id,
      label: R.find(R.propEq('id', o.id))(goals).name,
      color: o.color,
      group: 'goals'
    }), enabledGoals)

    const options = R.concat(returnsOptions, goalsOptions)

    if (options.length === 1) {
      options[0] = R.merge(options[0], { clearableValue: false })
    }
    return options
  }

  render () {
    const { canEnable } = this.props
    const that = this

    return (
      <Row>
        <Col xs={12}>
          <div className={classes.topBar}>
            <Select name='options'
              multi
              value={this.enabledOptions}
              clearable={false}
              options={this.selectOptions}
              valueRenderer={this.renderValue}
              optionRenderer={this.renderOption}
              onChange={function (val) { that.handleSelectChange(val) }} />
            {!canEnable &&
              <small className='text-danger'>
                Maximum of 6 comparisons allowed. Remove some comparisons in
                order to add new ones.
              </small>}
          </div>
        </Col>
      </Row>
    )
  }
}

const requests = ({ accountId }) => ({
  returns: ({ findAll }) => findAll({
    type: 'returns',
    footprint: R.prop('name')
  }),
  goals: ({ findQuery }) => findQuery({
    type: 'goals',
    url: `/accounts/${accountId}/goals`,
    query: {
      account: parseInt(accountId, 10)
    }
  })
})

const selector = createStructuredSelector({
  enabledReturns: enabledReturnsSelector,
  enabledGoals: enabledGoalsSelector
})

const actions = {
  disableReturn,
  enableReturn,
  disableGoal,
  enableGoal
}

export default connect(requests, selector, actions)(TopBar)
