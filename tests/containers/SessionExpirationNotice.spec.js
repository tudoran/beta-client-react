import React from 'react'
import { Modal } from 'react-bootstrap'
import { shallow } from 'enzyme'
import moment from 'moment'
import { KEEP_ALIVE_REQUEST_INIT, KEEP_ALIVE_REQUEST_PENDING } from 'redux/api/modules/session'
import { SessionExpirationNotice } from 'containers/SessionExpirationNotice/SessionExpirationNotice'
import SessionTimeLeft from 'components/SessionTimeLeft'

describe('(Component) SessionExpirationNotice', () => {
  const getComponent = (props) =>
    <SessionExpirationNotice show handleHide={function () {}} {...props} />
  const session = {
    expiresAt: moment().add(29, 'seconds').toISOString(),
    requestStatus: KEEP_ALIVE_REQUEST_INIT
  }
  const keepAlive = sinon.spy()
  const logout = sinon.spy()
  const wrapper = shallow(getComponent({ session, keepAlive, logout }))

  it('renders Modal', () => {
    expect(wrapper.find(Modal)).to.have.length(1)
  })

  it('renders SessionTimeLeft inside modal', () => {
    expect(wrapper.find(SessionTimeLeft)).to.have.length(1)
  })

  it('renders `Stay logged in` button inside modal', () => {
    expect(wrapper.find({ bsStyle: 'primary' }).text()).to.equal('<Button />')
  })

  it('renders `Logout` button inside modal', () => {
    expect(wrapper.find({ bsStyle: 'danger' }).text()).to.equal('<Button />')
  })

  it('makes keep-alive request on `Stay logged in` button click', () => {
    const keepAlive = sinon.spy()
    const logout = sinon.spy()
    const wrapper = shallow(getComponent({ session, keepAlive, logout }))
    wrapper.find({ bsStyle: 'primary' }).simulate('click')
    keepAlive.should.have.been.called
  })

  it('makes logout request on `Logout` button click', () => {
    const keepAlive = sinon.spy()
    const logout = sinon.spy()
    const wrapper = shallow(getComponent({ session, keepAlive, logout }))
    wrapper.find({ bsStyle: 'danger' }).simulate('click')
    logout.should.have.been.called
    keepAlive.should.not.have.been.called
  })

  it('renders confirm message with `Stay logged in` button disabled while request is pending', () => {
    const session = {
      expiresAt: moment().add(29, 'seconds').toISOString(),
      requestStatus: KEEP_ALIVE_REQUEST_PENDING
    }
    const wrapper = shallow(getComponent({ session, keepAlive, logout }))
    expect(wrapper.find('.pending')).to.have.length(1)
    expect(wrapper.find({ bsStyle: 'primary' }).prop('disabled')).to.equal(true)
  })
})
