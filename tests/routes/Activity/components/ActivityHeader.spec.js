import React from 'react'
import { mount, shallow } from 'enzyme'
import { Row } from 'react-bootstrap'
import ActivityHeader from 'routes/Activity/components/ActivityHeader'
import GoalBalance from 'components/GoalBalance'
import GoalNavigation from 'components/GoalNavigation'
import GoalTargetContainer from 'containers/GoalTargetContainer'
import SelectActivityType from 'routes/Activity/components/SelectActivityType'
import SelectDateRange from 'routes/Activity/components/SelectDateRange'

describe('(Route) Activity', () => {
  describe('(Component) ActivityHeader', () => {
    const params = {
      accountId: 1,
      clientId: 2,
      goalId: 41
    }
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
        name: 'AAA',
        state: 0
      },
      {
        id: 41,
        name: 'BBB',
        state: 0
      }
    ]
    const activeType = activityTypes[0]

    const getComponent = (props) =>
      <ActivityHeader params={params} activeType={activeType} activityTypes={activityTypes}
        goals={goals} goTo={function () {}} set={function () {}} {...props} />

    it('renders as a <Row />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal(Row)
    })

    it('passes the right props to <GoalNavigation />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(GoalNavigation).prop('goals')).to.equal(goals)
      expect(wrapper.find(GoalNavigation).prop('label')).to.equal(null)
      expect(wrapper.find(GoalNavigation).prop('selectedGoalId')).to.equal(params.goalId)

      const wrapperAllGoals = shallow(getComponent({ allGoals: true }))
      expect(wrapperAllGoals.find(GoalNavigation).prop('label')).to.equal('All Goals')
    })

    it('renders <GoalBalance />, unless viewing \'All Goals\'', () => {
      const wrapper = shallow(getComponent())
      const goalBalance = wrapper.find(GoalBalance)
      expect(goalBalance).to.have.length(1)
      expect(goalBalance.prop('goal')).to.deep.equal(goals[1])
      const wrapperAllGoals = shallow(getComponent({ allGoals: true }))
      expect(wrapperAllGoals.find(GoalBalance)).to.have.length(0)
    })

    it('renders <GoalTargetContainer />, unless viewing \'All Goals\'', () => {
      const wrapper = shallow(getComponent())
      const goalTargetContainer = wrapper.find(GoalTargetContainer)
      expect(goalTargetContainer).to.have.length(1)
      expect(goalTargetContainer.prop('goal')).to.deep.equal(goals[1])
      const wrapperAllGoals = shallow(getComponent({ allGoals: true }))
      expect(wrapperAllGoals.find(GoalTargetContainer)).to.have.length(0)
    })

    it('renders <SelectActivityType />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(SelectActivityType)).to.have.length(1)
    })

    it('renders <SelectDateRange />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find(SelectDateRange)).to.have.length(1)
    })

    it(`navigates to goal activity page and sets allGoals to 'false' on selecting a goal in
      <GoalNavigation />`, () => {
      const goTo = sinon.spy()
      const set = sinon.spy()
      const wrapper = mount(getComponent({ allGoals: true, goTo, set }))
      const { accountId, clientId } = params
      wrapper.find('.dropdown-menu li a').first().simulate('click')
      goTo.should.have.been.called
      goTo.should.have.been.calledWith(
        `/${clientId}/account/${accountId}/goal/${goals[0].id}/activity`
      )
      set.should.have.been.called
      set.should.have.been.calledWith({ allGoals: false })
    })

    it('sets allGoals to \'true\' on selecting \'All Goals\' in <GoalNavigation />', () => {
      const goTo = sinon.spy()
      const set = sinon.spy()
      const wrapper = mount(getComponent({ allGoals: true, goTo, set }))
      wrapper.find('.dropdown-menu').first().find('li a').last().simulate('click')
      set.should.have.been.calledOnce
      set.should.have.been.calledWith({ allGoals: true })
    })

    xit('updates on activeDateRange', () => {

    })

    xit('updates on activeType', () => {

    })

    xit('updates on activityTypes', () => {

    })

    xit('updates on allGoals', () => {

    })

    xit('updates on goals', () => {

    })

    xit('updates on params', () => {

    })
  })
})
