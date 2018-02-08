import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import mountWithIntl from '../../../test-helpers/mountWithIntl'
import UserSettingsContainer from 'routes/UserSettings/containers/UserSettingsContainer'

describe('(Route) UserSettings', () => {
  describe('(Container) UserSettingsContainer', () => {
    const user = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      middle_name: 'm',
      email:'johndoe@example.org',
      client: {
        id: 2,
        date_of_birth: '1972-09-22',
        gender: 'Male',
        phone_num: '+61424888888',
        civil_status: null,
        tax_file_number: '85755',
        net_worth: 2000000,
        occupation: 'President',
        employer: 'Government of the United States',
        residential_address: {
          id: 171,
          region: {
            id: 50,
            name: 'NSW',
            code: 'NSW',
            country: 'AU'
          },
          address: '18 Mitchell Street\nPaddington\nSydney',
          post_code: '2021',
          global_id: null
        }
      }
    }

    const settings = {
      civil_statuses: [
        {
          id: 0,
          name: 'SINGLE'
        },
        {
          id: 1,
          name: "MARRIED"
        }
      ],
      employment_statuses: [
        {
          id: 0,
          name: "Employed (full-time)"
        },
        {
          id: 1,
          name: "Employed (part-time)"
        },
        {
          id: 2,
          name: "Self-employed"
        }
      ]
    }

    const securityQuestions = [{
      id: 245,
      question: "What was the name of your favorite childhood friend?",
      user: 6
    }]

    const data = {
      me: [user],
      settings: [settings],
      securityQuestions
    }

    const state = {
      api: {
        data
      },
      modal: {

      },
      form: {

      }
    }
    const getComponent = (props) => {
      const store = configureStore()(state)
      return (
        <Provider store={store}>
          <UserSettingsContainer {...props} />
        </Provider>
      )
    }

    it('renders as a Connect(ReduxAPI(UserSettings))', () => {
      const wrapper = mountWithIntl(getComponent()).find(UserSettingsContainer)
      expect(wrapper.name()).to.equal('Connect(ReduxAPI(UserSettings))')
    })

    it('passes data and state from store cache', () => {
      const wrapper = mountWithIntl(getComponent()).find(UserSettingsContainer)
      // FIXME: wrapper.props() does not include props injected by connect()
      const {
        user: passedUser,
        settings: passedSettings,
        securityQuestions: passedSecurityQuestions
      } = wrapper.node.renderedElement.props
      expect(passedUser).to.deep.equal(user)
      expect(passedSettings).to.deep.equal(settings)
      expect(passedSecurityQuestions).to.deep.equal(securityQuestions)
    })

    it('passes `show`, `refreshProfile` actions', () => {
      const wrapper = mountWithIntl(getComponent()).find(UserSettingsContainer)
      // FIXME: wrapper.props() does not include props injected by connect()
      const { show, refreshProfile } = wrapper.node.renderedElement.props
      expect(show).to.exist
      expect(refreshProfile).to.exist
    })
  })
})
