import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import uuid from 'uuid'
import { connect } from 'redux/api'
import { mapIndexed, propsChanged } from 'helpers/pureFunctions'
import { MdAdd } from 'helpers/icons'
import { OverlayTrigger } from 'react-bootstrap'
import Button from 'components/Button/Button'
import classes from './Constraints.scss'
import Constraint from '../Constraint/Constraint'
import Tooltip from 'components/Tooltip/Tooltip'

const addButtonTooltip =
  <Tooltip id='addConstraintButtonTooltip'>
    <div>Add Constraint</div>
  </Tooltip>

class Constraints extends Component {
  static propTypes = {
    addConstraint: PropTypes.func,
    comparisons: PropTypes.array,
    constraints: PropTypes.array,
    constraintsValues: PropTypes.array,
    constraintsOpened: PropTypes.object,
    features: PropTypes.array,
    removeConstraint: PropTypes.func,
    toggleConstraint: PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return propsChanged(['comparisons', 'constraints', 'constraintsOpened',
      'constraintsValues', 'features'], this.props, nextProps)
  }

  addConstraint = () => {
    const { addConstraint, toggleConstraint, comparisons } = this.props
    const minimumComparison = R.find(R.propEq('name', 'Minimum'), comparisons)
    const id = uuid.v4()
    toggleConstraint(id)
    addConstraint({
      comparison: minimumComparison.id,
      configured_val: 0,
      id,
      type: 0
    })
  }

  render () {
    const { comparisons, constraints, constraintsOpened, constraintsValues,
      features, removeConstraint, toggleConstraint } = this.props

    return (
      <div>
        <div className={classes.titleWrapper}>
          <h5 className={classes.title}>
            Portfolio Constraints
            <Button className={classes.addButton}
              onClick={this.addConstraint} bsStyle='circle'>
              <OverlayTrigger placement='top' overlay={addButtonTooltip}>
                <MdAdd size={22} />
              </OverlayTrigger>
            </Button>
          </h5>
        </div>
        {mapIndexed((constraint, index) =>
          <Constraint key={index}
            constraint={constraint}
            constraintValue={constraintsValues[index]}
            features={features}
            comparisons={comparisons}
            remove={function () { removeConstraint(constraint) }}
            toggle={function () { toggleConstraint(constraint.id.value) }}
            isOpened={constraintsOpened[constraint.id.value] &&
              constraintsOpened[constraint.id.value].isOpened}
          />
        , constraints)}
      </div>
    )
  }
}

const requests = {
  features: ({ findAll }) => findAll({
    type: 'assetsFeatures',
    url: '/settings/asset-features'
  }),
  comparisons: ({ findAll }) => findAll({
    type: 'comparisons',
    url: '/settings/constraint_comparisons'
  })
}

export default connect(requests)(Constraints)
