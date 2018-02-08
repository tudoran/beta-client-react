import React, { Component, PropTypes } from 'react'
import { connectNeedsUser } from 'helpers/auth'
import CreateAccountModal
  from 'containers/CreateAccountModal/CreateAccountModal'
import Footer from 'components/Footer/Footer'
import Header from 'containers/Header/Header'
import SessionMonitor from 'containers/SessionMonitor'

class Client extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
    routeParams: PropTypes.object
  };

  static childContextTypes = {
    clientId: PropTypes.string
  };

  getChildContext () {
    const { clientId } = this.props.routeParams
    return { clientId }
  }

  render () {
    const { children, routeParams: { clientId }, location } = this.props

    return (
      <div>
        <Header clientId={clientId} location={location} />
        {children}
        <Footer />
        <CreateAccountModal />
        <SessionMonitor />
      </div>
    )
  }
}

export default connectNeedsUser('/a/login')(Client)
