import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import mountWithIntl from '../../../test-helpers/mountWithIntl'
import PersonalProfileContainer from 'routes/UserSettings/containers/PersonalProfileContainer'
import PersonalProfile from 'routes/UserSettings/components/PersonalProfile'

describe('(Route) UserSettings', () => {
  describe('(Container) PersonalProfileContainer', () => {
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
          name: 'MARRIED'
        }
      ],
      employment_statuses: [
        {
          id: 0,
          name: 'Employed (full-time)'
        },
        {
          id: 1,
          name: 'Employed (part-time)'
        },
        {
          id: 2,
          name: 'Self-employed'
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
          <PersonalProfileContainer user={user} settings={settings}
            refreshProfile={function() {}} {...props} />
        </Provider>
      )
    }

    it('renders as a Connect(ReduxAPI(ConnectedForm))', () => {
      const wrapper = mountWithIntl(getComponent()).find(PersonalProfileContainer)
      expect(wrapper.name()).to.equal('Connect(ReduxAPI(ConnectedForm))')
    })

    it('passes data and state from store cache', () => {
      const wrapper = mountWithIntl(getComponent()).find(PersonalProfileContainer)
      const {
        user: passedUser,
        settings: passedSettings,
      } = wrapper.props()
      expect(passedUser).to.deep.equal(user)
      expect(passedSettings).to.deep.equal(settings)
    })

    it('passes address fields from user props', () => {
      const wrapper = mountWithIntl(getComponent()).find(PersonalProfileContainer)
      const ppWrapper = wrapper.find(PersonalProfile)
      const { fields } = ppWrapper.props()
      expect(fields.address1.value).to.equal('18 Mitchell Street')
      expect(fields.address2.value).to.equal('Paddington')
      expect(fields.city.value).to.equal('Sydney')
      expect(fields.post_code.value).to.equal('2021')
      expect(fields.state.value).to.equal('NSW')
      expect(fields.country.value).to.equal('AU')
    })

    it('passes `handleSubmit`, `updateProfile` actions', () => {
      const wrapper = mountWithIntl(getComponent()).find(PersonalProfileContainer)
      const { refreshProfile } = wrapper.props()
      expect(refreshProfile).to.exist
      // FIXME: wrapper.props() does not include props injected by connect()
      const { updateUser, updateClient } = wrapper.node.renderedElement.props
      expect(updateUser).to.exist
      expect(updateClient).to.exist
    })
  })
})
