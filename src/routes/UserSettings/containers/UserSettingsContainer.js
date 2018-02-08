import { connect } from 'redux/api'
import { getProfile } from 'redux/modules/auth'
import { findSingle } from 'redux/api/modules/requests'
import { show } from 'redux-modal'
import UserSettings from '../components/UserSettings'

const requests = () => ({
  user: getProfile,
  settings: (({ findSingle }) => findSingle({
    type: 'settings',
    url: '/settings'
  })),
  securityQuestions: ({ findAll }) => findAll({
    type: 'securityQuestions',
    url: `/me/security-questions/`
  })
})

const actions = {
  show,
  refreshProfile: () => findSingle({
    type: 'me',
    force: true
  })
}

export default connect(requests, null, actions)(UserSettings)
