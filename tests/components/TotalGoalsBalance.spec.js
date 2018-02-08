import React from 'react'
import { FormattedNumber } from 'react-intl'
import { shallow } from 'enzyme'
import mountWithIntl from '../test-helpers/mountWithIntl'
import TotalGoalsBalance from 'components/TotalGoalsBalance'

describe('(Component) TotalGoalsBalance', () => {
  const goals = [
    {
      id: 1,
      name: 'AAA',
      balance: 40.03
    },
    {
      id: 41,
      name: 'BBB',
      balance: 101.94
    },
    {
      id: 42,
      name: 'CCC'
    }
  ]
  const getComponent = (props) =>
    <TotalGoalsBalance goals={goals} {...props} />

  it('renders as a <FormattedNumber />', () => {
    const wrapper = shallow(getComponent())
    expect(wrapper.type()).to.equal(FormattedNumber)
  })

  it('renders the total balance of goals', () => {
    const wrapper = mountWithIntl(getComponent())
    expect(wrapper.containsMatchingElement(<span>141.97</span>)).to.equal(true)
  })

  it('updates on goals change', () => {
    const wrapper = mountWithIntl(getComponent())
    wrapper.setProps({ goals: [goals[0]] })
    expect(wrapper.containsMatchingElement(<span>40.03</span>)).to.equal(true)
  })
})
