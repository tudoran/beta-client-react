import React from 'react'
import { shallow } from 'enzyme'
import R from 'ramda'
import { dateRanges } from 'routes/Activity/helpers'
import classes from 'routes/Activity/components/SelectDateRange/SelectDateRange.scss'
import SelectDateRange from 'routes/Activity/components/SelectDateRange'

describe('(Route) Activity', () => {
  describe('(Component) SelectDateRange', () => {
    const set = sinon.spy()

    const getComponent = (props) =>
      <SelectDateRange set={set} {...props} />

    it('renders as a <ul />', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.type()).to.equal('ul')
    })

    it('renders list of date ranges', () => {
      const wrapper = shallow(getComponent())
      expect(wrapper.find('li')).to.have.length(dateRanges.length)
      const dataRangeEls = R.map(dateRange =>
        <li>{dateRange.label}</li>
      , dateRanges)
      expect(wrapper.containsAllMatchingElements(dataRangeEls)).to.equal(true)
    })

    it('renders active dateRange with active class', () => {
      const activeDateRange = dateRanges[0]
      const wrapper = shallow(getComponent({ activeDateRange }))
      expect(wrapper.find(`li.${classes.activeItem}`)).to.have.length(1)
      expect(wrapper.find('li').first().hasClass(classes.activeItem)).to.equal(true)
    })

    it('calls set({ activeDateRangeLabel: dateRange.label }) on dateRange click', () => {
      const wrapper = shallow(getComponent())
      const dateRange = wrapper.find('li').first()
      set.should.not.have.been.called
      dateRange.simulate('click')
      set.should.have.been.calledOnce
      set.should.have.been.calledWith({ activeDateRangeLabel: dateRanges[0].label })
    })
  })
})
