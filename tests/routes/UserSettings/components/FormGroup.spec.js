import React from 'react'
import { mount, shallow } from 'enzyme'
import { FormGroup as BootstrapFormGroup } from 'react-bootstrap'
import FormGroup from 'routes/UserSettings/components/FormGroup/FormGroup'
import classes from 'routes/UserSettings/components/FormGroup/FormGroup.scss'

describe('(Route) UserSettings', () => {
  describe('(Component) FormGroup', () => {
    const getComponent = (props) =>
      <FormGroup>children</FormGroup>

    it('renders as a <BootstrapFormGroup> with correct className', () => {
      const wrapper = mount(getComponent())
      expect(wrapper.find(BootstrapFormGroup)).to.have.length(1)
      expect(wrapper.find(BootstrapFormGroup).prop('className')).to.equal(classes.formGroup)
    })

    it('renders children components', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.containsMatchingElement('children')).to.equal(true)
    })
  })
})
