import React, { Component, PropTypes } from 'react'
import { Grid, Panel } from 'react-bootstrap'
import classNames from 'classnames'
import { MdDragHandle } from 'helpers/icons'
import { propsChanged } from 'helpers/pureFunctions'
import Button from 'components/Button/Button'
import classes from './Box.scss'
import GoalActions from 'components/GoalActions/GoalActions'
import ToggleButton from 'components/ToggleButton/ToggleButton'

export default class Box extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    connectDragSource: PropTypes.func,
    expanded: PropTypes.bool,
    goal: PropTypes.object,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    set: PropTypes.func,
    show: PropTypes.func,
    toggle: PropTypes.func
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['children', 'expanded', 'goal', 'id'],
      this.props, nextProps)
  }

  render () {
    const { children, className, connectDragSource, expanded, goal, id, set,
      show, toggle } = this.props

    return (
      <Panel className={classNames(className, classes.panel)}>
        <div className={classes.actionLeft}>
          <ToggleButton active={expanded} className='btn-sm'
            onClick={function () { toggle({ id, prop: 'isBoxOpened' }) }} />
          {connectDragSource && connectDragSource(<div><Button bsStyle='link'
            className={classes.dragButton}>
            <MdDragHandle size='18' />
          </Button></div>)}
        </div>
        {goal && <div className={classes.actionRight}>
          <GoalActions goal={goal} show={show}
            editName={function () {
              set({ id, name: goal.name, isEditingName: true })
            }}
            editTarget={function () {
              set({ id, target: goal.target,
                isEditingTarget: true, isBoxOpened: true })
            }} />
        </div>}
        <div className={classes.panelInner}>
          <Grid fluid>
            {children}
          </Grid>
        </div>
      </Panel>
    )
  }
}
