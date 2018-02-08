import React, { Component, PropTypes } from 'react'
import { Collapse } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import { MdDelete } from 'helpers/icons'
import R from 'ramda'
import './Select.scss'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './Constraint.scss'
import classNames from 'classnames'
import Select from 'components/Select/Select'
import Slider from 'components/Slider/Slider'
import ToggleButton from 'components/ToggleButton/ToggleButton'

const emptyText =
  <span>
    &#8211;&#8211;&nbsp;
  </span>

const getFeatureOptions = R.map(({ id, name, values = [] }) => ({
  label: name,
  options: R.map(({id, name}) => ({
    value: id,
    label: name
  }), values)
}))

const getComparisonOptions = R.map(({ id, name }) => ({
  value: id,
  label: name
}))

const flattenFeatureOptions = R.compose(
  R.reduce(R.concat, []),
  R.map(R.prop('options')),
  getFeatureOptions
)

export default class Constraint extends Component {
  static propTypes = {
    comparisons: PropTypes.array,
    constraint: PropTypes.object,
    constraintValue: PropTypes.object,
    features: PropTypes.array,
    isOpened: PropTypes.bool,
    remove: PropTypes.func,
    toggle: PropTypes.func
  }

  shouldComponentUpdate (nextProps) {
    return propsChanged(['comparisons', 'constraint', 'constraintValue',
      'features', 'isOpened'], this.props, nextProps)
  }

  render () {
    const { comparisons, features, isOpened, remove, toggle,
      constraint: { comparison, configured_val, feature } } = this.props
    const featureOptions = getFeatureOptions(features)
    const comparisonOptions = getComparisonOptions(comparisons)
    const flattenedFeatureOptions = flattenFeatureOptions(features)
    const selectedFeature = R.find(
      R.propEq('value', feature.value),
      flattenedFeatureOptions
    )
    const selectedComparison = R.find(
      R.propEq('value', comparison.value),
      comparisonOptions
    )

    return (
      <div className={classNames('panel', 'panel-default', classes.constraint)}>
        <div className={classes.toggleHandle}>
          <ToggleButton className='btn-xs' iconSize={14} onClick={toggle}
            active={isOpened} />
        </div>
        <Collapse in={isOpened} timeout={10}>
          <div>
            <div className={classes.removeWrapper}>
              <a onClick={remove} className={classes.btnDelete}>
                <MdDelete size='18' />
              </a>
            </div>
            <div className={classes.fieldsWrapper}>
              <div className={classes.featureWrapper}>
                <div className='constraint-select'>
                  <Select value={feature.value} onChange={feature.onChange}
                    placeholder='Select' searchable={false} clearable={false}
                    options={featureOptions} />
                </div>
              </div>
              <div className={classes.comparisonWrapper}>
                <div className={classes.configuredValue}>
                  <FormattedNumber value={configured_val.value}
                    format='percent' />
                </div>
                <div className={classes.comparisonSelect}>
                  <div className='constraint-select'>
                    <Select value={comparison.value}
                      onChange={comparison.onChange}
                      placeholder='Select' searchable={false} clearable={false}
                      options={comparisonOptions} />
                  </div>
                </div>
              </div>
              <div className={classes.sliderWrapper}>
                <Slider min={0} max={1} step={0.01} hideLabels
                  {...(R.omit(['onChange'], configured_val))}
                  onAfterChange={configured_val.onChange} />
              </div>
            </div>
          </div>
        </Collapse>
        <Collapse in={!isOpened} onClick={toggle} timeout={1}
          className={classes.constraintClosed}>
          <div>
            {selectedComparison ? selectedComparison.label : emptyText}&nbsp;
            <FormattedNumber value={configured_val.value} format='percent' />&nbsp;
            {selectedFeature ? `${selectedFeature.label}` : emptyText}
          </div>
        </Collapse>
      </div>
    )
  }
}
