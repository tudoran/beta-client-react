import React from 'react'
import { Form } from 'react-bootstrap'
import { mount, shallow } from 'enzyme'
import PersonalProfile from 'routes/UserSettings/components/PersonalProfile/PersonalProfile'

describe('(Route) UserSettings', () => {
  describe('(Component) PersonalProfile', () => {
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

    const fields = {
      first_name: {
        name: 'first_name',
        value: 'John'
      },
      last_name: {
        name: 'last_name',
        value: 'Doe'
      },
      'middle_name': {
        name: 'middle_name',
        value: 'M'
      },
      'email': {
        name: 'email',
        value: 'johndoe@example.org'
      },
      'phone_num': {
        name: 'phone_num',
        value: '123456789'
      },
      'gender': {
        name: 'gender',
        value: 'Male'
      },
      'date_of_birth': {
        name: 'date_of_birth',
        value: '1972-09-12'
      },
      'tax_file_number': {
        name: 'tax_file_number',
        value: '55555'
      },
      'civil_status': {
        name: 'civil_status',
        value: 0
      }
    }

    const handleSubmit = sinon.spy()

    const getComponent = (props) => (
      <PersonalProfile settings={settings} updateProfile={function() {}}
        handleSubmit={handleSubmit} errors={{}} fields={fields} {...props} />
    )

    it('renders as a <Form />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal(Form)
    })

    it('populates initial values from `fields`', () => {
      const wrapper = mount(getComponent())
      expect(wrapper.find('input[name="first_name"]').get(0).value).to.equal(fields.first_name.value)
      expect(wrapper.find('input[name="last_name"]').get(0).value).to.equal(fields.last_name.value)
      expect(wrapper.find('input[name="middle_name"]').get(0).value).to.equal(fields.middle_name.value)
      expect(wrapper.find('input[name="email"]').get(0).value).to.equal(fields.email.value)
      expect(wrapper.find('input[name="phone_num"]').get(0).value).to.equal(fields.phone_num.value)
      expect(wrapper.find('input[name="gender"]').get(0).value).to.equal(fields.gender.value)
      expect(wrapper.find('input[name="date_of_birth"]').get(0).value).to.equal(fields.date_of_birth.value)
      expect(wrapper.find('input[name="tax_file_number"]').get(0).value).to.equal(fields.tax_file_number.value)
      expect(parseInt(wrapper.find('select[name="civil_status"]').get(0).value, 10)).to.equal(fields.civil_status.value)
    })

    it('disables `Update Info` button when field errors exist.', () => {
      const errors = {
        first_name: ["First Name is required."]
      }
      const wrapper = mount(getComponent({ errors }))
      expect(wrapper.find({type: 'submit', disabled: true})).to.have.length(1)
    })

    it('triggers `handleSubmit` on UpdateInfo button click.', () => {
      const wrapper = mount(getComponent())
      wrapper.find({type: 'submit'}).simulate('click')
      handleSubmit.should.have.been.called
    })
  })
})
