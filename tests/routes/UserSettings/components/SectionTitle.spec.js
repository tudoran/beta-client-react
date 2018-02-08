import React from 'react'
import { shallow } from 'enzyme'
import classes from 'routes/UserSettings/components/SectionTitle/SectionTitle.scss'
import SectionTitle from 'routes/UserSettings/components/SectionTitle/SectionTitle'

describe('(Route) UserSettings', () => {
  describe('(Component) SectionTitle', () => {
    const getComponent = (props) =>
      <SectionTitle title='Foo' />

    it('renders as a <h3> with correct className', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal('h3')
      expect(wrapper.prop('className')).to.equal(classes.sectionTitle)
    })

    it('renders the section title', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.containsMatchingElement(<h3>Foo</h3>)).to.equal(true)
    })
  })
})
