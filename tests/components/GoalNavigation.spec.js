import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { mount, shallow } from 'enzyme'
import R from 'ramda'
import GoalNavigation from 'components/GoalNavigation/GoalNavigation'

describe('(Component) GoalNavigation', () => {
  const goals = [
    { id: 1, name: 'BBB Second', state: 0 },
    { id: 2, name: 'AAA First', state: 0 },
    { id: 3, name: 'CCC Third', state: 0 }
  ]

  const getLabel = (wrapper) => wrapper.find('.dropdown-toggle span').first().text()

  const getItems = (wrapper) => R.map(
    item => item.text(),
    wrapper.find('.dropdown-menu li a')
  )

  const getComponent = (props) =>
    <GoalNavigation onSelect={function () {}} goals={goals} {...props} />

  it('renders as a <Dropdown />', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.type()).to.equal(Dropdown)
  })

  it('renders <Dropdown.Toggle />', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.find(Dropdown.Toggle)).to.have.length(1)
  })

  it('renders <Dropdown.Menu />', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.find(Dropdown.Menu)).to.have.length(1)
  })

  it('renders passed label', () => {
    const wrapper = mount(getComponent({ label: 'FooLabel' }))
    expect(wrapper.containsMatchingElement(<span>FooLabel</span>)).to.equal(true)
    expect(getLabel(wrapper)).to.equal('FooLabel')
  })

  it('renders name of selected goal', () => {
    const wrapper = mount(getComponent({ selectedGoalId: '1' }))
    expect(wrapper.containsMatchingElement(<span>BBB Second</span>)).to.equal(true)
    expect(getLabel(wrapper)).to.equal('BBB Second')
  })

  it('renders \'Select a goal\' when no \'label\' or \'selectedGoalId\' is passed', () => {
    const wrapper = mount(getComponent())
    expect(getLabel(wrapper)).to.equal('Select a goal')
  })

  it('lists goals sorted by name', () => {
    const wrapper = mount(getComponent())
    expect(getItems(wrapper)).to.deep.equal([
      'AAA First',
      'BBB Second',
      'CCC Third'
    ])
  })

  it('call onSelect(goal) on clicking goal item', () => {
    const onSelect = sinon.spy()
    const wrapper = mount(getComponent({ onSelect }))
    onSelect.should.not.have.been.called
    wrapper.find('.dropdown-menu li a').first().simulate('click')
    onSelect.should.have.been.calledOnce
    onSelect.should.have.been.calledWith(goals[1])
  })

  it('renders children', () => {
    const wrapper = mount(getComponent({
      children: [
        React.createElement(MenuItem, { key: 'foo' }, 'foo'),
        React.createElement(MenuItem, { key: 'bar' }, 'bar')
      ]
    }))
    expect(getItems(wrapper)).to.deep.equal([
      'AAA First',
      'BBB Second',
      'CCC Third',
      'foo',
      'bar'
    ])
  })

  it('renders a divider only when children are passed', () => {
    const wrapper = mount(getComponent())
    expect(wrapper.find('.divider')).to.have.length(0)
    const wrapperWithChildren = mount(getComponent({
      children: React.createElement(MenuItem, null, 'foo')
    }))
    expect(wrapperWithChildren.find('.divider')).to.have.length(1)
  })

  it('updates on children change', () => {
    const wrapper = mount(getComponent())
    wrapper.setProps({ children: React.createElement(MenuItem, null, 'fooBar') })
    expect(wrapper.containsMatchingElement(<a>fooBar</a>)).to.equal(true)
  })

  it('updates on goals change', () => {
    const wrapper = mount(getComponent())
    wrapper.setProps({ goals: R.tail(goals) })
    expect(getItems(wrapper)).to.deep.equal([
      'AAA First',
      'CCC Third',
    ])
  })

  it('updates on label change', () => {
    const wrapper = mount(getComponent())
    expect(getLabel(wrapper)).to.equal('Select a goal')
    wrapper.setProps({ label: 'BAR' })
    expect(getLabel(wrapper)).to.equal('BAR')
  })

  it('updates on onSelect change', () => {
    const wrapper = mount(getComponent())
    const onSelect = sinon.spy()
    wrapper.setProps({ onSelect })
    onSelect.should.not.have.been.called
    wrapper.find('.dropdown-menu li a').first().simulate('click')
    onSelect.should.have.been.calledOnce
    onSelect.should.have.been.calledWith(goals[1])
  })

  it('updates on selectedGoalId change', () => {
    const wrapper = mount(getComponent({ selectedGoalId: '1' }))
    expect(getLabel(wrapper)).to.equal('BBB Second')
    wrapper.setProps({ selectedGoalId: '2' })
    expect(getLabel(wrapper)).to.equal('AAA First')
  })
})
