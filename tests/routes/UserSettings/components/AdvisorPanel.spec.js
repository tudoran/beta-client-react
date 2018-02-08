import React from 'react'
import { FormGroup, FormControl } from 'react-bootstrap'
import { mount } from 'enzyme'
import AdvisorPanel from 'routes/UserSettings/components/AdvisorPanel/AdvisorPanel'

describe('(Route) UserSettings', () => {
  describe('(Component) AdvisorPanel', () => {

    const user = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      middle_name: 'm',
      advisor: {
        id: 2,
        gender: 'Male',
        work_phone_num: '1234567890',
        email: 'advisor@example.org',
        user: {
          id: 3,
          first_name: 'Lachlan',
          middle_name: 'M',
          last_name: 'Macquarie'
        }
      },
      secondary_advisors: [
        {
          id: 4,
          gender: 'Male',
          work_phone_num: '1122334455',
          email: 'advisor2@example.org',
          user: {
            id: 5,
            first_name: 'Jimmy',
            middle_name: '',
            last_name: 'Doe'
          }
        },
        {
          id: 6,
          gender: 'Male',
          work_phone_num: null,
          email: 'advisor3@example.org',
          user: {
            id: 7,
            first_name: 'Harry',
            middle_name: '',
            last_name: 'Potter'
          }
        }
      ]
    }

    const user2 = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      middle_name: 'm',
      advisor: {
        id: 2,
        gender: 'Male',
        work_phone_num: '1234567890',
        email: 'advisor@example.org',
        user: {
          id: 3,
          first_name: 'Lachlan',
          middle_name: 'M',
          last_name: 'Macquarie'
        }
      }
    }

    const getComponent = (props) =>
      <AdvisorPanel user={user} {...props} />

    it('renders primary advisor info', () => {
      const wrapper = mount(getComponent())
      const text = wrapper.find(FormGroup).at(0).find(FormControl.Static).text()
      expect(text.replace(/ +/, ' ')).to.equal('Lachlan M Macquarie, 1234567890, advisor@example.org')
    })

    it('renders secondary advisors info', () => {
      const wrapper = mount(getComponent())
      const advisorsWrapper = wrapper.find(FormGroup).at(1)
      expect(advisorsWrapper.contains([
        <FormControl.Static>Jimmy  Doe, 1122334455, advisor2@example.org</FormControl.Static>,
        <FormControl.Static>Harry  Potter, N/A, advisor3@example.org</FormControl.Static>
      ])).to.equal(true)
    })

    it('renders N/A if secondary advisors are not available.', () => {
      const wrapper = mount(getComponent({user: user2}))
      const advisorsWrapper = wrapper.find(FormGroup).at(1).find(FormControl.Static)
      expect(advisorsWrapper.text()).to.equal('N/A')
    })
  })
})
