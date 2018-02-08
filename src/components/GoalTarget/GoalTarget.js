import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import { MdEdit } from 'helpers/icons'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './GoalTarget.scss'
import InlineEdit from 'components/InlineEdit/InlineEdit'

export default class GoalTarget extends Component {
  static propTypes = {
    isEditing: PropTypes.bool,
    onChange: PropTypes.func,
    onEnd: PropTypes.func,
    setIsEditing: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['isEditing', 'label', 'value'], this.props, nextProps)
  }

  render () {
    const { isEditing, onChange, onEnd, setIsEditing, value } = this.props

    return (
      <div className={classes.target}
        onClick={function () { !isEditing && setIsEditing(true) }}>
        <InlineEdit value={value} isEditing={isEditing} onChange={onChange} onEnd={onEnd}
          setIsEditing={setIsEditing}>
          <FormattedNumber value={value} format='currency' />
        </InlineEdit>
        {!isEditing && <MdEdit size={16} className={classes.editIcon} />}
      </div>
    )
  }
}
