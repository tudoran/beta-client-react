import React, { Component, PropTypes } from 'react'
import { getDuration, prettyDuration } from '../helpers'
import { propsChanged } from 'helpers/pureFunctions'
import classes from './Duration.scss'
import InputField from '../InputField/InputField'
import Slider from 'components/Slider/Slider'

export default class Duration extends Component {
  static propTypes = {
    duration: PropTypes.object,
    settings: PropTypes.object
  };

  static defaultProps = {
    settings: {}
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['duration', 'settings'], this.props,
      nextProps)
  }

  render () {
    const { duration, settings } = this.props
    const savedDuration = getDuration(settings, 'months')

    return (
      <InputField
        field={duration}
        savedValue={savedDuration}
        label={
          <span>Time
            <span className='pull-right'>
              {duration && prettyDuration(duration.value)}
            </span>
          </span>
        }
        input={
          <Slider min={1 * 12} max={50 * 12} labelMin='1' labelMax='50'
            className={classes.slider}
            label='years' {...duration} />
        }
      />
    )
  }
}
