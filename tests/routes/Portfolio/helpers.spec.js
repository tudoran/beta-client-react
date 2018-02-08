import { holdingName, sortHoldings, unallocatedForGoal } from 'routes/Portfolio/helpers'

const holdings = [
  {
    assetClass: {
      display_name: 'One',
    },
    percent: 25,
    value: 25000
  }, {
    assetClass: {
      display_name: 'B',
    },
    percent: 50,
    value: 50000
  }
]

describe('(Route) Portfolio', () => {
  describe('(Helper) holdingName', () => {
    it('returns the holding name if present', () => {
      expect(holdingName(holdings[0])).to.eq('One')
    })

    it('returns an empty string if the holding name is absent', () => {
      expect(holdingName({})).to.eq('')
    })
  })

  describe('(Helper) sortHoldings', () => {
    it('alphabetically sorts the holdings by name case insensatively', () => {
      expect(sortHoldings(holdings).map(holdingName)).to.deep.eq(['B', 'One'])
    })
  })

  describe('(Helper) unallocatedForGoal', () => {
    const unalloc = unallocatedForGoal({balance: 100000}, holdings)

    it('correctly calculates the unallocated value', () => {
      expect(unalloc.value).to.eq(25000)
    })

    it('correctly calculates the unallocated percent', () => {
      expect(unalloc.percent).to.eq(25)
    })

    it('names the holding "Unallocated Funds"', () => {
      expect(holdingName(unalloc)).to.eq('Unallocated Funds')
    })
  })
})
