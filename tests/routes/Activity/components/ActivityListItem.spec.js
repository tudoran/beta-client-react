import React from 'react'
import { FormattedDate, FormattedNumber } from 'react-intl'
import { OverlayTrigger } from 'react-bootstrap'
import { shallow } from 'enzyme'
import moment from 'moment'
import R from 'ramda'
import { MdInfo } from 'helpers/icons'
import ActivityListItem from 'routes/Activity/components/ActivityListItem'

describe('(Route) Activity', () => {
  describe('(Component) ActivityListItem', () => {
    const allGoals = false
    const goal = { id: '1', name: 'Foo' }
    const time = parseInt(moment('2012', 'YYYY').valueOf() / 1000, 10)
    const item = {
      id: 9,
      amount: 20,
      balance: 19500,
      data: [1, 2],
      time,
      type: 1,
      memos: [
        'Reducing the target to reduce the risk',
        'Changing the target as I reckon I can get more'
      ]
    }
    const description = '1 + 1 = 2'

    const getComponent = (props) =>
      <ActivityListItem goal={goal} allGoals={allGoals} item={item} description={description}
        {...props} />

    it('renders as a <tr />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal('tr')
    })

    it('renders the name of the goal, when allGoals = true', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.containsMatchingElement(<td>Foo</td>)).to.equal(false)
      const wrapperWithAllGoals = shallow(getComponent({ allGoals: true }))
      expect(wrapperWithAllGoals.containsMatchingElement(<td>Foo</td>)).to.equal(true)
    })

    it('renders time of activity with <FormattedDate />', () => {
      const wrapper = shallow(getComponent())
      const date = wrapper.find(FormattedDate)
      expect(date).to.have.length(1)
      expect(date.prop('value')).to.equal(time * 1000)
      expect(date.prop('format')).to.equal('dayMonthAndYear')
    })

    it('renders description of activity', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.containsMatchingElement(<span>{description}</span>)).to.equal(true)
    })

    it('renders an <MdInfo /> inside <OverlayTrigger />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(OverlayTrigger).find(MdInfo)).to.have.length(1)
    })

    it('renders the memos in a Tooltip', () => {
      const wrapper = shallow(getComponent())
      const overlay = wrapper.find(OverlayTrigger)
      const tooltip = shallow(overlay.prop('overlay'))
      expect(tooltip.prop('id')).to.equal(`memos-${item.id}`)
      expect(tooltip.containsMatchingElement(<div>{item.memos[0]}</div>)).to.equal(true)
      expect(tooltip.containsMatchingElement(<div>{item.memos[1]}</div>)).to.equal(true)
    })

    it('doesn\'t render <OverlayTrigger /> when memos are not present', () => {
      const itemWithoutMemos = R.omit(['memos'], item)
      const wrapper = shallow(getComponent({ item: itemWithoutMemos }))
      expect(wrapper.find(OverlayTrigger)).to.have.length(0)
    })

    it('renders amount and balance of activity with <FormattedNumber />', () => {
      const wrapper = shallow(getComponent())
      const numbers = wrapper.find(FormattedNumber)
      expect(numbers).to.have.length(2)
      expect(numbers.first().prop('value')).to.equal(item.amount)
      expect(numbers.first().prop('format')).to.equal('currency')
      expect(numbers.last().prop('value')).to.equal(item.balance)
      expect(numbers.last().prop('format')).to.equal('currency')
    })

    it('doesn\'t render amount and balance when they are not present', () => {
      const itemWithoutAmount = R.omit(['amount', 'balance'], item)
      const wrapper = shallow(getComponent({ item: itemWithoutAmount }))
      expect(wrapper.find(FormattedNumber)).to.have.length(0)
    })
  })
})
