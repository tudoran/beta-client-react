import React from 'react'
import { Grid, Panel } from 'react-bootstrap'
import { shallow } from 'enzyme'
import moment from 'moment'
import R from 'ramda'
import { dateRanges, getActivityTypes } from 'routes/Activity/helpers'
import Activity from 'routes/Activity/components/Activity'
import ActivityFooter from 'routes/Activity/components/ActivityFooter'
import ActivityHeader from 'routes/Activity/components/ActivityHeader'
import ActivityList from 'routes/Activity/components/ActivityList'
import PageTitle from 'components/PageTitle'
import Spinner from 'components/Spinner/Spinner'

describe('(Route) Activity', () => {
  describe('(Component) Activity', () => {
    const params = {
      accountId: 1,
      clientId: 2,
      goalId: 41
    }
    const activityState = {
      allGoals: true,
      activeTypeId: 1,
      activeDateRangeLabel: '1 mo'
    }
    const requests = {}
    const activityTypes = [
      {
        id: 1,
        name: 'Foo'
      },
      {
        id: 2,
        name: 'Bar'
      }
    ]
    const goals = [
      {
        id: 1, name: 'Foo'
      }
    ]
    const goalActivity = [
      {
        amount: 20,
        data: [1, 2],
        time: parseInt(moment('2012', 'YYYY').valueOf() / 1000, 10),
        type: 1
      },
      {
        amount: 30,
        data: [3, 4],
        time: parseInt(moment('2013', 'YYYY').valueOf() / 1000, 10),
        type: 2
      }
    ]
    const accountActivity = [
      {
        balance: 19500,
        time: parseInt(moment('2016-01', 'YYYY-MM').valueOf() / 1000, 10),
        type: 1
      },
      {
        amount: 20010,
        time: parseInt(moment('2015-01', 'YYYY-MM').valueOf() / 1000, 10),
        type: 2
      }
    ]
    const goTo = function () {}
    const set = function () {}

    const getComponent = (props) =>
      <Activity accountActivity={accountActivity} goalActivity={goalActivity} params={params}
        activityState={activityState} requests={requests} activityTypes={activityTypes}
        goals={goals} goTo={goTo} set={set} {...props} />

    it('renders as a <Grid />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal(Grid)
    })

    it('renders <PageTitle />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(PageTitle)).to.have.length(1)
    })

    it('renders <Panel />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(Panel)).to.have.length(1)
    })

    it('renders <ActivityHeader /> into Panel\'s header', () => {
      const wrapper = shallow(getComponent())
      const panel = wrapper.find(Panel)
      expect(panel.prop('header').type).to.equal(ActivityHeader)
    })

    it('renders <Spinner /> when accountActivity request is pending and allGoals = true', () => {
      const requests = {
        accountActivity: {
          status: 'pending'
        },
        goalActivity: {
          status: 'whatever'
        }
      }
      const wrapper = shallow(getComponent({ requests }))
      expect(wrapper.find(Spinner)).to.have.length(1)
      expect(wrapper.find(ActivityList)).to.have.length(0)
    })

    it('renders <Spinner /> when goalActivity request is pending and allGoals = false', () => {
      const requests = {
        accountActivity: {
          status: 'whatever'
        },
        goalActivity: {
          status: 'pending'
        }
      }
      const activityState = {
        allGoals: false
      }
      const wrapper = shallow(getComponent({ activityState, requests }))
      expect(wrapper.find(Spinner)).to.have.length(1)
      expect(wrapper.find(ActivityList)).to.have.length(0)
    })

    it('renders <ActivityList /> when accountActivity request is not pending and allGoals = true',
      () => {
      const requests = {
        accountActivity: {
          status: 'whatever'
        },
        goalActivity: {
          status: 'pending'
        }
      }
      const wrapper = shallow(getComponent({ requests }))
      expect(wrapper.find(Spinner)).to.have.length(0)
      expect(wrapper.find(ActivityList)).to.have.length(1)
    })

    it('renders <ActivityList /> when goalActivity request is not pending and allGoals = false',
      () => {
      const requests = {
        accountActivity: {
          status: 'pending'
        },
        goalActivity: {
          status: 'whatever'
        }
      }
      const activityState = {
        allGoals: false
      }
      const wrapper = shallow(getComponent({ activityState, requests }))
      expect(wrapper.find(Spinner)).to.have.length(0)
      expect(wrapper.find(ActivityList)).to.have.length(1)
    })

    it('renders <ActivityFooter />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(ActivityFooter)).to.have.length(1)
    })

    it('passes activeType to <ActivityHeader />', () => {
      const wrapper = shallow(getComponent())
      const header = wrapper.find(Panel).prop('header')
      expect(header.props.activeType.id).to.equal(1)
    })

    it('passes activityTypes to <ActivityHeader /> and <ActivityList />', () => {
      const wrapper = shallow(getComponent())
      const header = wrapper.find(Panel).prop('header')
      const list = wrapper.find(ActivityList)
      const activityIdAndName = R.map(R.pick(['id', 'name']))
      expect(activityIdAndName(header.props.activityTypes))
        .to.deep.equal(activityIdAndName(getActivityTypes({ activityTypes })))
      expect(activityIdAndName(list.prop('activityTypes')))
        .to.deep.equal(activityIdAndName(getActivityTypes({ activityTypes })))
    })

    it('passes activeDateRange to <ActivityHeader />', () => {
      const wrapper = shallow(getComponent())
      const header = wrapper.find(Panel).prop('header')
      expect(header.props.activeDateRange)
        .to.deep.equal(R.find(R.propEq('label', '1 mo'), dateRanges))
    })

    it(`passes all activities to <ActivityList /> when selected dateRange is 'All' and selected
      activityType is 'All'`, () => {
      const activityState = {
        allGoals: true,
        activeTypeId: -1,
        activeDateRangeLabel: 'All'
      }
      const wrapper = shallow(getComponent({ activityState }))
      const list = wrapper.find(ActivityList)
      expect(list.prop('items')).to.deep.equal(accountActivity)
    })

    it('passes activities that occured in the selected date range', () => {
      const activityState = {
        allGoals: true,
        activeTypeId: -1,
        activeDateRangeLabel: '1 yr'
      }
      const wrapper = shallow(getComponent({ activityState }))
      const list = wrapper.find(ActivityList)
      expect(list.prop('items')).to.deep.equal([accountActivity[0]])
    })

    it('passes activities that belong to the selected activity type', () => {
      const activityState = {
        allGoals: true,
        activeTypeId: 2,
        activeDateRangeLabel: 'All'
      }
      const wrapper = shallow(getComponent({ activityState }))
      const list = wrapper.find(ActivityList)
      expect(list.prop('items')).to.deep.equal([accountActivity[1]])
    })
  })
})
