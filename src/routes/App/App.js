import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { set } from 'redux/modules/routeParams'
import 'styles/core.scss'

const saveRouteParams = ({ params, set }) => set(params)

class App extends Component {
  static propTypes = {
    children: PropTypes.element,
    params: PropTypes.object,
    set: PropTypes.func
  };

  componentWillMount () {
    saveRouteParams(this.props)
  }

  componentWillReceiveProps (nextProps) {
    saveRouteParams(nextProps)
  }

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

const actions = { set }

export default connect(null, actions)(App)
