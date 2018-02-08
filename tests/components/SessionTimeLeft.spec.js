import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import SessionTimeLeft from 'components/SessionTimeLeft'

describe('(Component) SessionTimeLeft', () => {
  const getComponent = (props) =>
    <SessionTimeLeft {...props} />

  it('renders session expiration time left', () => {
    const session = {
      expiresAt: moment().add(29, 'seconds').toISOString()
    }
    const wrapper = shallow(getComponent({ session }))
    expect(wrapper.contains(wrapper.instance().state.timeLeft)).to.equal(true)
  })
})
