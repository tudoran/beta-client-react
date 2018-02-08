import React from 'react'
import { mount, shallow } from 'enzyme'
import PortfolioHoldingList from 'routes/Portfolio/components/PortfolioHoldingList'
import mountWithIntl from '../../../test-helpers/mountWithIntl'


describe('(Route) Portfolio', () => {
  describe('(Component) PortfolioHoldingList', () => {
    const holdings = [{
      value: 2500,
      percent: 25,
      assetClass: { display_name: 'B' }
    }, {
      value: 4000,
      percent: 40,
      assetClass: { display_name: 'A' }
    }]

    const isUnalloc = td => td.text() === 'Unallocated Funds'

    const getComponent = (props) =>
      <PortfolioHoldingList holdings={holdings} {...props} />

    it('renders as a <Table />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.name()).to.equal('Table')
    })

    it('always renders "Unallocated Funds"', () => {
      const unalloc = mountWithIntl(getComponent())
        .find('tbody td')
        .findWhere(isUnalloc)

      const emptyUnalloc = mountWithIntl(getComponent({holdings: []}))
        .find('tbody td')
        .findWhere(isUnalloc)

      expect(unalloc.length).to.eq(1)
      expect(emptyUnalloc.length).to.eq(1)
    })

    it('renders the correct amount in unallocated funds', () => {
      const unalloc = mountWithIntl(getComponent({goal: {balance: 10000}}))
        .find('td')
        .filterWhere(td => td.text() === '3500')

      expect(unalloc.length).to.eq(1)
    })

    it('always renders alphabetically with "Unallocated Funds" coming last', () => {
      const holdingList = mountWithIntl(getComponent())
        .find('tbody tr')
        .map(tr => tr.find('td').first().text())

      expect(holdingList).to.deep.eq(['A', 'B', 'Unallocated Funds'])
    })
  })
})
