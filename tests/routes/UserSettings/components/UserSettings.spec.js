import React from 'react'
import { Grid } from 'react-bootstrap'
import { shallow } from 'enzyme'
import PageTitle from 'components/PageTitle'
import PersonalProfile from 'routes/UserSettings/containers/PersonalProfileContainer'
import UserSettings from 'routes/UserSettings/components/UserSettings'

describe('(Route) UserSettings', () => {
  describe('(Component) UserSettings', () => {
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

    const refreshProfile = function() {}

    const getComponent = (props) =>
      <UserSettings settings={settings} refreshProfile={refreshProfile} user={user} />

    it('renders as a <Grid />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal(Grid)
    })

    it('renders <PageTitle />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(PageTitle)).to.have.length(1)
    })

    it('renders <PersonalProfile />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(PersonalProfile)).to.have.length(1)
    })

    it('passes `refreshProfile`, `settings`, `user` to <PersonalProfile />', () => {
      const wrapper = shallow(getComponent())
      const personalProfile = wrapper.find(PersonalProfile)
      const {
        user: passedUser,
        settings: passedSettings,
        refreshProfile: passedRefreshProfile
      } = personalProfile.props()
      expect(passedSettings).to.deep.equal(settings)
      expect(passedUser).to.deep.equal(user)
      expect(passedRefreshProfile).to.exist
    })
  })
})
