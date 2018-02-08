import React from 'react'
import { Form } from 'react-bootstrap'
import { shallow } from 'enzyme'
import FinancialProfile from 'routes/UserSettings/components/FinancialProfile/FinancialProfile'
import mountWithIntl from '../../../test-helpers/mountWithIntl'

describe('(Route) UserSettings', () => {
  describe('(Component) PersonalProfile', () => {
    const settings = {
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
      employment_status: {
        name: 'employment_status',
        value: 1
      },
      occupation: {
        name: 'occupation',
        value: 'President'
      },
      'employer': {
        name: 'employer',
        value: 'Government of the United States'
      },
      'income': {
        name: 'income',
        value: 20000
      }
    }

    const handleSubmit = sinon.spy()

    const getComponent = (props) => (
      <FinancialProfile settings={settings} updateProfile={function() {}}
        handleSubmit={handleSubmit} errors={{}} fields={fields} {...props} />
    )

    it('renders as a <Form />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal(Form)
    })

    it('populates initial values from `fields`', () => {
      const wrapper = mountWithIntl(getComponent())
      expect(parseInt(wrapper.find('select[name="employment_status"]').get(0).value))
        .to.equal(fields.employment_status.value)
      expect(wrapper.find('input[name="occupation"]').get(0).value).to.equal(fields.occupation.value)
      expect(wrapper.find('input[name="employer"]').get(0).value).to.equal(fields.employer.value)
      expect(parseInt(wrapper.find('input[name="income"]').get(0).value)).to.equal(fields.income.value)
    })

    it('disables `Update Info` button when field errors exist.', () => {
      const errors = {
        employment_status: ["Employment Status is required."]
      }
      const wrapper = mountWithIntl(getComponent({ errors }))
      expect(wrapper.find({type: 'submit', disabled: true})).to.have.length(1)
    })

    it('triggers `handleSubmit` on UpdateInfo button click.', () => {
      const wrapper = mountWithIntl(getComponent())
      wrapper.find({type: 'submit'}).simulate('click')
      handleSubmit.should.have.been.called
    })
  })
})
