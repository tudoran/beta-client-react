import React from 'react'
import { shallow } from 'enzyme'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ChangePasswordModalContainer from 'routes/UserSettings/containers/ChangePasswordModalContainer'

describe('(Route) UserSettings', () => {
  describe('(Container) ChangePasswordModalContainer', () => {
    const securityQuestion = {
      id: 245,
      question: "What was the name of your favorite childhood friend?",
      user: 6
    }

    const state = {
      api: {
        requests: []
      },
      modal: {
        changePasswordModal: {
          show: true
        }
      },
      form: {

      }
    }

    const getComponent = (props) => {
      const store = configureStore()(state)
      return (
        <Provider store={store}>
          <ChangePasswordModalContainer securityQuestion={securityQuestion} {...props} />
        </Provider>
      )
    }

    it('renders as a Connect(ReduxAPI(ConnectedForm))', () => {
      const wrapper = shallow(getComponent()).find(ChangePasswordModalContainer)
      expect(wrapper.name()).to.equal('Connect(ReduxAPI(ConnectedForm))')
    })

    it('passes data and state from store cache', () => {
      const wrapper = shallow(getComponent()).find(ChangePasswordModalContainer)
      const {
        securityQuestion: passedSecurityQuestion
      } = wrapper.props()
      expect(passedSecurityQuestion).to.deep.equal(securityQuestion)
    })
  })
})
