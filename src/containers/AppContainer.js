import React, { Component, PropTypes } from 'react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import config from 'config'

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  render () {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <IntlProvider {...config.intl}>
          <div style={{ height: '100%' }}>
            <Router history={history} children={routes} />
          </div>
        </IntlProvider>
      </Provider>
    )
  }
}

export default AppContainer
