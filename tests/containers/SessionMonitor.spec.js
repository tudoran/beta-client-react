import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import moment from 'moment'
import throttle from 'lodash/throttle'
import thunk from 'redux-thunk'
import { sessionModalVisibleSelector } from 'redux/selectors'
import { SessionMonitor } from 'containers/SessionMonitor/SessionMonitor'
import { sessionSelector } from 'redux/api/selectors'
import { monitorUserInteraction, interactionEvent, keepAlive } from 'redux/api/modules/session'

describe('(Component) SessionMonitor', () => {
  const getComponent = (store, props) => {
    const session = sessionSelector(store.getState())
    const sessionModalVisible = sessionModalVisibleSelector(store.getState())
    return (
      <Provider store={store}>
        <SessionMonitor session={session} sessionModalVisible={sessionModalVisible}
          keepAlive={function () {}} monitorUserInteraction={monitorUserInteraction}
          logout={function () {}} {...props} />
      </Provider>
    )
  }

  it('shows SessionExpirationNotice modal if session expires in 30 seconds', () => {
    const sessionExpiresIn30 = {
      expiresAt: moment().add(29, 'seconds').toISOString()
    }
    const initialState = {
      modal: {},
      api: {
        session: sessionExpiresIn30
      }
    }
    const store = configureStore()(initialState)
    const show = sinon.spy()
    mount(getComponent(store, { show }))
    show.should.have.been.calledOnce
    show.should.have.been.calledWith('sessionExpirationNotice')
  })

  it('does not show SessionExpirationNotice modal if session does not expire in 30 seconds', () => {
    const sessionExpiresIn300 = {
      expiresAt: moment().add(300, 'seconds').toISOString()
    }
    const initialState = {
      modal: {},
      api: {
        session: sessionExpiresIn300
      }
    }
    const store = configureStore()(initialState)
    const show = sinon.spy()
    mount(getComponent(store, { show }))
    show.should.not.have.been.called
  })

  it('does not show SessionExpirationNotice modal if session.expiresAt is not set.', () => {
    const sessionExpiresNotSet = {
      expiresAt: null
    }
    const initialState = {
      modal: {},
      api: {
        session: sessionExpiresNotSet
      }
    }
    const store = configureStore()(initialState)
    const show = sinon.spy()
    mount(getComponent(store, { show }))
    show.should.not.have.been.called
  })

  it('makes throttled keep-alive request on user interaction.', () => {
    const sessionExpiresIn300 = {
      expiresAt: moment().add(300, 'seconds').toISOString()
    }
    const initialState = {
      modal: {},
      api: {
        session: sessionExpiresIn300
      }
    }
    const middlewares = [thunk]
    const store = configureStore(middlewares)(initialState)
    const keepAliveSpy = sinon.spy(keepAlive)

    const dispatchKeepAlive = (dispatch) => dispatch(keepAliveSpy())
    const keepAliveThrottled = throttle(
      dispatchKeepAlive,
      60 * 1000
    )

    store.dispatch(interactionEvent(keepAliveThrottled))
    store.dispatch(interactionEvent(keepAliveThrottled))
    expect(keepAliveSpy).to.have.property('callCount', 1)
  })

  it('does not make throttled keep-alive request when modal is shown.', () => {
    const sessionExpiresIn30 = {
      expiresAt: moment().add(29, 'seconds').toISOString()
    }
    const initialState = {
      modal: {
        sessionExpirationNotice: {
          show: true
        }
      },
      api: {
        session: sessionExpiresIn30
      }
    }

    const middlewares = [thunk]
    const store = configureStore(middlewares)(initialState)
    const keepAliveSpy = sinon.spy(keepAlive)

    const dispatchKeepAlive = (dispatch) => dispatch(keepAliveSpy())
    const keepAliveThrottled = throttle(
      dispatchKeepAlive,
      60 * 1000
    )

    store.dispatch(interactionEvent(keepAliveThrottled))
    store.dispatch(interactionEvent(keepAliveThrottled))

    expect(keepAliveSpy).to.have.property('callCount', 0)
  })
})
