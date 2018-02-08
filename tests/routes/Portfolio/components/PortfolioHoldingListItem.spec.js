import React from 'react'
import { shallow } from 'enzyme'
import PortfolioHoldingListItem from 'routes/Portfolio/components/PortfolioHoldingListItem'

describe('(Route) Portfolio', () => {
  describe('(Component) PortfolioHoldingListItem', () => {
    const getComponent = (props) =>
      <PortfolioHoldingListItem {...props} />

    it('renders as a <tr>', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal('tr')
    })

    it('uses FormattedNumer to render the value', () => {
      const formattedNumber = shallow(getComponent({value: 100}))
        .findWhere(el => el.name() === 'FormattedNumber')

      expect(formattedNumber.length).to.eq(1)
    })
  })
})
