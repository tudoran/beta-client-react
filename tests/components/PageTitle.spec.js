import React from 'react'
import { shallow } from 'enzyme'
import classes from 'components/PageTitle/PageTitle.scss'
import PageTitle from 'components/PageTitle'

describe('(Component) PageTitle', () => {
  const getComponent = (props) =>
    <PageTitle title='Foo' />

  it('renders as a <h1> with correct className', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.type()).to.equal('h1')
    expect(wrapper.prop('className')).to.equal(classes.pageTitle)
  })

  it('renders the title', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.containsMatchingElement(<h1>Foo</h1>)).to.equal(true)
  })
})
