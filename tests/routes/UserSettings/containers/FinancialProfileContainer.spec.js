import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import mountWithIntl from '../../../test-helpers/mountWithIntl'
import FinancialProfileContainer from 'routes/UserSettings/containers/FinancialProfileContainer'

describe('(Route) UserSettings', () => {
  describe('(Container) FinancialProfileContainer', () => {
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
        employer: 'Government of the United States'
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

    const data = {
      me: [user],
      settings: [settings]
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
          <FinancialProfileContainer user={user} settings={settings}
            refreshProfile={function() {}} {...props} />
        </Provider>
      )
    }

    it('renders as a Connect(ReduxAPI(ConnectedForm))', () => {
      const wrapper = mountWithIntl(getComponent()).find(FinancialProfileContainer)
      expect(wrapper.name()).to.equal('Connect(ReduxAPI(ConnectedForm))')
    })

    it('passes data and state from store cache', () => {
      const wrapper = mountWithIntl(getComponent()).find(FinancialProfileContainer)
      // FIXME: wrapper.props() does not include props injected by connect()
      const {
        user: passedUser,
        settings: passedSettings,
      } = wrapper.props()
      expect(passedUser).to.deep.equal(user)
      expect(passedSettings).to.deep.equal(settings)
    })

    it('passes `handleSubmit`, `updateProfile` actions', () => {
      const wrapper = mountWithIntl(getComponent()).find(FinancialProfileContainer)
      const { refreshProfile } = wrapper.props()
      expect(refreshProfile).to.exist
      // FIXME: wrapper.props() does not include props injected by connect()
      const { updateClient } = wrapper.node.renderedElement.props
      expect(updateClient).to.exist
    })
  })
})
