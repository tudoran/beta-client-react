import React, { Component, PropTypes } from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import R from 'ramda'
import classes from './SelectActivityType'

export default class SelectActivityType extends Component {
  static propTypes = {
    activeType: PropTypes.object.isRequired,
    activityTypes: PropTypes.array.isRequired,
    set: PropTypes.func.isRequired
  };

  render () {
    const { activeType, activityTypes, set } = this.props

    return (
      <Dropdown id='activityTypeSelector' className={classes.activityList}>
        <Dropdown.Toggle className={classes.activityListToggle}>
          <span>{activeType.name}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {R.map(({ id, name }) =>
            <MenuItem key={id}
              onClick={function () { set({ activeTypeId: id }) }}>
              {name}
            </MenuItem>
          , activityTypes)}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}
