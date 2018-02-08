import React, { Component, PropTypes } from 'react'
import { propsChanged } from 'helpers/pureFunctions'
import InlineEdit from 'components/InlineEdit/InlineEdit'
import classes from './GoalName.scss'

export default class GoalName extends Component {
  static propTypes = {
    name: PropTypes.string,
    isEditing: PropTypes.bool,
    onChange: PropTypes.func,
    onEnd: PropTypes.func,
    setIsEditing: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['name', 'isEditing'], this.props, nextProps)
  }

  render () {
    const { name, isEditing, onChange, onEnd, setIsEditing } = this.props
    return (
      <h3 className={classes.name}>
        <InlineEdit value={name}
          isEditing={isEditing}
          onChange={onChange}
          onEnd={onEnd}
          setIsEditing={setIsEditing} />
      </h3>
    )
  }
}
