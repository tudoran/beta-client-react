import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import configureStore from 'redux-mock-store'
import moment from 'moment'
import R from 'ramda'
import ActivityContainer from 'routes/Activity/containers/ActivityContainer'

describe('(Route) Activity', () => {
  describe('(Container) ActivityContainer', () => {
    const params = {
      accountId: '1',
      clientId: '2',
      goalId: '41'
    }
    const accountActivity = [
      {
        account: '20',
        amount: 10,
        time: parseInt(moment('2013-01', 'YYYY-MM').valueOf() / 1000, 10),
        type: 1
      },
      {
        account: '1',
        balance: 19500,
        time: parseInt(moment('2016-01', 'YYYY-MM').valueOf() / 1000, 10),
        type: 1
      },
      {
        account: '1',
        amount: 20010,
        time: parseInt(moment('2015-01', 'YYYY-MM').valueOf() / 1000, 10),
        type: 2
      }
    ]
    const goalActivity = [
      {
        goal: '93',
        amount: 100,
        time: parseInt(moment('2011', 'YYYY').valueOf() / 1000, 10),
        type: 2
      },
      {
        goal: '41',
        amount: 20,
        data: [1, 2],
        time: parseInt(moment('2012', 'YYYY').valueOf() / 1000, 10),
        type: 1
      },
      {
        goal: '41',
        amount: 30,
        data: [3, 4],
        time: parseInt(moment('2013', 'YYYY').valueOf() / 1000, 10),
        type: 2
      }
    ]
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
        id: 1,
        name: 'Baz',
        account: 1
      },
      {
        id: 2,
        name: 'Qux',
        account: 1
      }
    ]

    const data = {
      goals,
      activityTypes,
      activity: R.concat(accountActivity, goalActivity)
    }

    const activityState = {
      allGoals: true,
      activeTypeId: 1,
      activeDateRangeLabel: '1 mo'
    }

    const state = {
      activity: activityState,
      api: {
        data
      },
      modal: {

      }
    }

    const getComponent = (props) => {
      const store = configureStore()(state)
      return (
        <Provider store={store}>
          <ActivityContainer params={params} {...props} />
        </Provider>
      )
    }

    it('renders as a Connect(ReduxAPI(Activity))', () => {
      const wrapper = mount(getComponent()).find(ActivityContainer)
      expect(wrapper.name()).to.equal('Connect(ReduxAPI(Activity))')
    })

    it('passes data and state from store cache', () => {
      const wrapper = mount(getComponent()).find(ActivityContainer)
      // FIXME: wrapper.props() does not include props injected by connect()
      const {
        accountActivity: passedAccountActivity,
        activityTypes: passedActivityTypes,
        goalActivity: passedGoalActivity,
        goals: passedGoals,
        activityState: passedActivityState
      } = wrapper.node.renderedElement.props
      expect(passedAccountActivity).to.deep.equal(R.tail(accountActivity))
      expect(passedActivityTypes).to.deep.equal(activityTypes)
      expect(passedGoalActivity).to.deep.equal(R.tail(goalActivity))
      expect(passedGoals).to.deep.equal(goals)
      expect(passedActivityState).to.deep.equal(activityState)
    })

    it('passes `goTo`, `replace` and `set` actions', () => {
      const wrapper = mount(getComponent()).find(ActivityContainer)
      // FIXME: wrapper.props() does not include props injected by connect()
      const { goTo, replace, set } = wrapper.node.renderedElement.props
      expect(goTo).to.exist
      expect(replace).to.exist
      expect(set).to.exist
    })
  })
})
