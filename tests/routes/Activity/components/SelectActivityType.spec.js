import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { shallow } from 'enzyme'
import SelectActivityType from 'routes/Activity/components/SelectActivityType'

describe('(Route) Activity', () => {
  describe('(Component) SelectActivityType', () => {
    const activityTypes = [
      {
        id: 1,
        name: 'Foo'
      },
      {
        id: 2,
        name: 'Bar'
      }
    ]
    const activeType = activityTypes[0]
    const set = sinon.spy()

    const getComponent = (props) =>
      <SelectActivityType activeType={activeType} activityTypes={activityTypes} set={set}
        {...props} />

    it('renders as a <Dropdown />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal(Dropdown)
    })

    it('renders current activity type in <Dropdown.Toggle />', () => {
      const wrapper = shallow(getComponent())
      const toggle = wrapper.find(Dropdown.Toggle)
      expect(toggle).to.have.length(1)
      expect(toggle.containsMatchingElement(<span>{activeType.name}</span>)).to.equal(true)
    })

    it('renders list of activity type as <MenuItem />\'s in <Dropdown.Menu />', () => {
      const wrapper = shallow(getComponent())
      const menu = wrapper.find(Dropdown.Menu)
      expect(menu).to.have.length(1)
      expect(menu.children()).to.have.length(2)
      expect(menu.containsAllMatchingElements([
        <MenuItem>{activityTypes[0].name}</MenuItem>,
        <MenuItem>{activityTypes[1].name}</MenuItem>
      ])).to.equal(true)
    })

    it('calls set({ activeTypeId: id }) on activityType click', () => {
      const wrapper = shallow(getComponent())
      const item = wrapper.find(MenuItem).first()
      set.should.not.have.been.called
      item.simulate('click')
      set.should.have.been.calledOnce
      set.should.have.been.calledWith({ activeTypeId: 1 })
    })
  })
})
