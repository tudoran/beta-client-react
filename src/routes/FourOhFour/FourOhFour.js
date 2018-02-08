import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router'
import classNames from 'classnames'
import { routeParamsSelector } from 'redux/selectors'
import classes from './FourOhFour.scss'

class FourOhFour extends Component {
  static propTypes = {
    savedRouteParams: PropTypes.object
  };

  render () {
    const { clientId = '' } = this.props.savedRouteParams

    return (
      <div className={classNames('text-center', classes.fourOhFour)}>
        <h1 className={classes.fourOhFourText}>404</h1>
        <span className={classes.notFoundText}>Page not found</span>
        <hr />
        <Link to={`/${clientId}`}>Back To Home View</Link>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  savedRouteParams: routeParamsSelector
})

export default connect(selector)(FourOhFour)
