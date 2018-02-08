import React, { Component, PropTypes } from 'react'
import classes from './SectionTitle.scss'

export class SectionTitle extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render () {
    const { title } = this.props

    return (
      <h3 className={classes.sectionTitle}>{title}</h3>
    )
  }
}

export default SectionTitle
