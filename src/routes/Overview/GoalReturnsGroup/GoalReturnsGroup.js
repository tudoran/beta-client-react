import React, { Component, PropTypes } from 'react'
import { Collapse } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'
import R from 'ramda'
import { propsChanged } from 'helpers/pureFunctions'
import GoalReturnsHeader from '../GoalReturnsHeader/GoalReturnsHeader'
import GoalReturnsRow from '../GoalReturnsRow/GoalReturnsRow'

const total = R.compose(R.sum, R.values)

const capitalize = R.converge(R.concat, [
  R.compose(R.toUpper, R.head),
  R.tail
])

const prettyPrint = R.compose(capitalize, R.replace('_', ' '))

export default class GoalReturnsGroup extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onClick: PropTypes.func,
    items: PropTypes.object,
    title: PropTypes.string
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['expanded', 'items', 'title'], this.props, nextProps)
  }

  render () {
    const { expanded, onClick, items, title } = this.props

    return (
      <div>
        <GoalReturnsHeader expanded={expanded} onClick={onClick}>
          <span>{title}</span>
          <span className='pull-right'>
            <FormattedNumber value={total(items)} format='currency' />
          </span>
        </GoalReturnsHeader>
        <Collapse in={expanded}>
          <div>
            {R.map(([key, value]) =>
              <GoalReturnsRow key={key}>
                <span>{prettyPrint(key)}</span>
                <FormattedNumber value={value} format='currency' />
              </GoalReturnsRow>
            , R.toPairs(items))}
          </div>
        </Collapse>
      </div>
    )
  }
}
