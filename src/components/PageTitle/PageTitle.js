import React, { Component, PropTypes } from 'react'
import classes from './PageTitle.scss'

export class PageTitle extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  };

  render () {
    const { title } = this.props

    return (
      <h1 className={classes.pageTitle}>{title}</h1>
    )
  }
}

export default PageTitle
