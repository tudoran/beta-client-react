import React from 'react'
import { mount } from 'enzyme'
import ChangePasswordError from 'routes/UserSettings/components/ChangePasswordError'

describe('(Route) UserSettings', () => {
  describe('(Component) ChangePasswordError', () => {
    const getComponent = (props) =>
      <ChangePasswordError show {...props} />

    it('renders as a <div> with message and correct className', () => {
      const wrapper = mount(getComponent())
      expect(wrapper.find('div.text-danger')).to.have.length(1)
      expect(wrapper.find('div.text-danger').text()).to.equal('Invalid password or question answer.')
    })

    it('does not render when `show` is false', () => {
      const wrapper = mount(getComponent({ show: false }))
      expect(wrapper.find('div.text-danger')).to.have.length(0)
    })
  })
})
