import React, { Component, PropTypes } from 'react'
import { sessionTimeLeft } from 'redux/api/modules/session'

const UPDATE_TIME_LEFT_EVERY = 500

class SessionTimeLeft extends Component {
  static propTypes = {
    session: PropTypes.object
  };

  constructor (props) {
    super(props)
    this.state = {
      timeLeft: sessionTimeLeft(props.session)
    }
  }

  componentDidMount () {
    this.interval = setInterval(this.updateTimeLeft, UPDATE_TIME_LEFT_EVERY)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  updateTimeLeft = () => {
    const { session } = this.props
    this.setState({ timeLeft: sessionTimeLeft(session) })
  }

  render () {
    const { timeLeft } = this.state
    return (
      <span>{timeLeft}</span>
    )
  }
}

export default SessionTimeLeft
