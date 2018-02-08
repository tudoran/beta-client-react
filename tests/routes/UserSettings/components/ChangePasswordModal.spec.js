import React from 'react'
import { Modal } from 'react-bootstrap'
import { shallow } from 'enzyme'
import ChangePasswordModal from 'routes/UserSettings/components/ChangePasswordModal/ChangePasswordModal'

describe('(Route) UserSettings', () => {
  describe('(Component) ChangePasswordModal', () => {

    const fields = {
      'old_password': {
        name: 'old_password',
        value: 'old'
      },
      'new_password': {
        name: 'new_password',
        value: 'new'
      },
      'question': {
        name: 'question',
        value: 'What was the name of your favorite childhood friend?'
      },
      'answer': {
        name: 'answer',
        value: 'John'
      }
    }

    const handleSubmit = sinon.spy()

    const getComponent = (props) => (
      <ChangePasswordModal show handleHide={function () {}} changePassword={function () {}}
        resetForm={function () {}} handleSubmit={handleSubmit} fields={fields}
        requests={{}} {...props} />
    )

    it('renders as a <Modal />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal(Modal)
    })

    it('triggers `handleSubmit` on Change Password button click.', () => {
      const wrapper = shallow(getComponent())
      wrapper.find({type: 'submit'}).simulate('click')
      handleSubmit.should.have.been.called
    })

    xit('populates initial values from `fields`', () => {
    })

    xit('triggers `handleChange` on Change Password button click.', () => {
    })
  })
})
