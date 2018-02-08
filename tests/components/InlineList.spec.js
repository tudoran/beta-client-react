import React from 'react'
import { shallow } from 'enzyme'
import classes from 'components/InlineList/InlineList.scss'
import InlineList from 'components/InlineList'

describe('(Component) InlineList', () => {
  const getComponent = (props) =>
    <InlineList {...props}>
      <h1>Hello</h1>
      <h2>World</h2>
    </InlineList>

  it('renders as a <div />', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.type()).to.equal('div')
  })

  it('renders with correct className', () => {
    const wrapper = shallow(getComponent({ className: 'baz' }))
    expect(wrapper.prop('className')).to.equal(`baz ${classes.inlineList}`)
  })

  it('renders children', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.containsMatchingElement(<h1>Hello</h1>)).to.equal(true)
    expect(wrapper.containsMatchingElement(<h2>World</h2>)).to.equal(true)
  })

  it('updates on className change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ className: 'qux' })
    expect(wrapper.prop('className')).to.equal(`qux ${classes.inlineList}`)
  })

  it('updates on children change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ children: React.createElement('div', null, 'bar') })
    expect(wrapper.containsMatchingElement(<div>bar</div>)).to.equal(true)
  })
})
