import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import R from 'ramda'
import Button from 'components/Button/Button'
import classes from './Selector.scss'

const renderOption = ({ activeOptionKey, key, value, setActiveOption }) => {
  const linkClasses = classNames({
    [classes.optionButton]: true,
    [classes.optionButtonActive]: R.equals(key, activeOptionKey)
  })

  return (
    <li key={key} className={classes.option}>
      <Button bsStyle='link' className={linkClasses}
        onClick={function () { setActiveOption(key) }}>
        {value.label}
      </Button>
    </li>
  )
}

renderOption.propTypes = {
  activeOptionKey: PropTypes.string,
  key: PropTypes.string,
  value: PropTypes.object,
  setActiveOption: PropTypes.func
}

export default class Selector extends Component {
  static propTypes = {
    activeOptionKey: PropTypes.string,
    options: PropTypes.object,
    setActiveOption: PropTypes.func
  };

  render () {
    const { activeOptionKey, options, setActiveOption } = this.props

    return (
      <ul className={classes.selector}>
        {R.map(([key, value]) =>
          renderOption({ activeOptionKey, key, value, setActiveOption })
        , R.toPairs(options))}
      </ul>
    )
  }
}
