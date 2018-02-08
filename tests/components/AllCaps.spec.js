import React from 'react'
import { shallow } from 'enzyme'
import AllCaps from 'components/AllCaps'
import classes from 'components/AllCaps/AllCaps.scss'

describe('(Component) AllCaps', () => {
  const getComponent = (props) =>
    <AllCaps value='Foo' {...props} />

  it('renders as a \'tagName\'', () => {
    const wrapper = shallow(getComponent({ tagName: 'h6' }))
    expect(wrapper.type()).to.equal('h6')
  })

  it('renders with correct className', () => {
    const wrapper = shallow(getComponent({ className: 'baz' }))
    expect(wrapper.prop('className')).to.equal(`baz ${classes.caps}`)
  })

  it('renders the passed value', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.containsMatchingElement(<span>Foo</span>)).to.equal(true)
  })

  it('updates on className change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ className: 'qux' })
    expect(wrapper.prop('className')).to.equal(`qux ${classes.caps}`)
  })

  it('updates on tagName change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ tagName: 'em' })
    expect(wrapper.type()).to.equal('em')
  })

  it('updates on value change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ value: 'BAR' })
    expect(wrapper.containsMatchingElement(<span>BAR</span>)).to.equal(true)
  })
})
