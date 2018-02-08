import React from 'react'
import { shallow } from 'enzyme'
import classes from 'components/Text/Text.scss'
import Text from 'components/Text'

describe('(Component) Text', () => {
  const getComponent = (props) =>
    <Text {...props}>
      <span>Foo</span>
      <div>Bar</div>
    </Text>

  it('renders as a <span />', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.type()).to.equal('span')
  })

  it('renders with correct className', () => {
    const wrapper = shallow(getComponent({ className: 'baz', size: 'large' }))
    expect(wrapper.prop('className')).to.equal(`${classes.large} baz`)
  })

  it('renders children', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.containsMatchingElement(<span>Foo</span>)).to.equal(true)
    expect(wrapper.containsMatchingElement(<div>Bar</div>)).to.equal(true)
  })

  it('throws warning when passed size prop is other than {small, normal, large, xlarge}', () => {
    const consoleStub = sinon.stub(console, 'error')
    shallow(getComponent({ size: 'xxlarge' }))
    consoleStub.should.have.been.calledOnce
    expect(consoleStub.getCall(0).args[0]).to.match(/Invalid prop `size` of value `xxlarge`/)
  })

  it('updates on children change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ children: React.createElement('span', null, 'BAZ') })
    expect(wrapper.containsMatchingElement(<span>BAZ</span>)).to.equal(true)
  })

  it('updates on className change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ className: 'qux' })
    expect(wrapper.prop('className')).to.equal(`${classes.normal} qux`)
  })

  it('updates on size change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ size: 'small' })
    expect(wrapper.prop('className')).to.equal(classes.small)
  })

  it('updates on style change', () => {
    const wrapper = shallow(getComponent())
    wrapper.setProps({ style: { color: 'yellow' } })
    expect(wrapper.prop('style')).to.deep.equal({ color: 'yellow' })
  })
})
