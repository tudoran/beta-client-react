import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import R from 'ramda'
import ActivityList from 'routes/Activity/components/ActivityList'
import ActivityListItem from 'routes/Activity/components/ActivityListItem'

describe('(Route) Activity', () => {
  describe('(Component) ActivityList', () => {
    const allGoals = false
    const activityTypes = [
      {
        id: 1,
        name: 'Foo',
        format_str: '1 + {} = {}'
      },
      {
        id: 2,
        name: 'Bar',
        format_str: 'Baz'
      }
    ]
    const goals = [
      {
        id: 1,
        name: 'Foo'
      },
      {
        id: 2,
        name: 'Bar'
      }
    ]
    const items = [
      {
        amount: 20,
        data: [1, 2],
        goal: 2,
        time: parseInt(moment('2012', 'YYYY').valueOf() / 1000, 10),
        type: 1
      },
      {
        amount: 30,
        goal: 1,
        time: parseInt(moment('2013', 'YYYY').valueOf() / 1000, 10),
        type: 2
      }
    ]

    const getComponent = (props) =>
      <ActivityList activityTypes={activityTypes} allGoals={allGoals} goals={goals} items={items}
        {...props} />

    it('renders as a <table />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal('table')
    })

    it('renders table header with the correct columns', () => {
      const wrapper = shallow(getComponent())
      const columns = wrapper.find('table > thead > tr > th')
      const columnsText = R.map((el) => el.text(), columns)
      expect(columns).to.have.length(4)
      expect(columnsText).to.deep.equal(['Date', 'Description', 'Change', 'Balance'])
    })

    it('renders table header with the correct columns, when allGoals = true', () => {
      const wrapper = shallow(getComponent({ allGoals: true }))
      const columns = wrapper.find('table > thead > tr > th')
      const columnsText = R.map((el) => el.text(), columns)
      expect(columns).to.have.length(5)
      expect(columnsText).to.deep.equal(['Goal', 'Date', 'Description', 'Change', 'Balance'])
    })

    it('renders 2 <ActivityListItem />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(ActivityListItem)).to.have.length(2)
    })

    it('passes description to each <ActivityListItem />', () => {
      const wrapper = shallow(getComponent())
      const descriptions = R.map(item => item.prop('description') , wrapper.find(ActivityListItem))
      expect(descriptions).to.deep.equal(['1 + 1 = 2', 'Baz'])
    })

    it('passes the goal to each <ActivityListItem />', () => {
      const wrapper = shallow(getComponent())
      const descriptions = R.map(item => item.prop('goal') , wrapper.find(ActivityListItem))
      expect(descriptions).to.deep.equal([goals[1], goals[0]])
    })
  })
})
