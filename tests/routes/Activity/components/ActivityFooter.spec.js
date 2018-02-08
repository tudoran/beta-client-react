import React from 'react'
import { mount, shallow } from 'enzyme'
import { MdFileDownload } from 'helpers/icons'
import ActivityFooter from 'routes/Activity/components/ActivityFooter'
import classes from 'routes/Activity/components/ActivityFooter/ActivityFooter.scss'

describe('(Route) Activity', () => {
  describe('(Component) ActivityFooter', () => {
    const component = <ActivityFooter />

    it('renders as a <div />', () => {
      const wrapper = shallow(component)
      expect(wrapper.type()).to.equal('div')
    })

    it('renders a link to download Adobe Reader', () => {
      const wrapper = mount(component)
      expect(wrapper.find(`.${classes.downloadAdobeReader} a`)).to.have.length(1)
    })

    it('renders a link to download activity', () => {
      const wrapper = mount(component)
      expect(wrapper.find(`a.${classes.downloadActivityLink}`)).to.have.length(1)
    })

    it('renders <MdFileDownload /> icon', () => {
      const wrapper = mount(component)
      const icon = wrapper.find(`a.${classes.downloadActivityLink}`).find(MdFileDownload)
      expect(icon).to.have.length(1)
    })

    it('renders download activity description', () => {
      const wrapper = mount(component)
      expect(wrapper.find(`span.${classes.downloadActivityText}`)).to.have.length(1)
    })
  })
})
