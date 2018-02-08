import { bind } from 'redux-effects'
import { cookie } from 'redux-effects-cookie'
import { createAction, handleActions } from 'redux-actions'
import R from 'ramda'
import { findSingle } from 'redux/api/modules/requests'

// ------------------------------------
// Constants
// ------------------------------------
export const AUTHENTICATE = 'AUTHENTICATE'
const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS'
const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL'

export const PARTNER_AUTHENTICATE = 'PARTNER_AUTHENTICATE'
const PARTNER_AUTHENTICATE_SUCCESS = 'PARTNER_AUTHENTICATE_SUCCESS'
const PARTNER_AUTHENTICATE_FAIL = 'PARTNER_AUTHENTICATE_FAIL'

// ------------------------------------
// Actions
// ------------------------------------
const authenticateSuccess = createAction(AUTHENTICATE_SUCCESS)
const authenticateFail = createAction(AUTHENTICATE_FAIL)

export const logout = () => [
  authenticateFail()
]

export const login = ({ create, findSingle }) => create({
  url: '/login',
  type: 'login',
  success: [authenticateSuccess, () => getProfile({ findSingle })],
  fail: [authenticateFail]
})

export const authenticate = () => {
  const handleSuccess = (token = '') => bind(
    () => getProfile({ findSingle }),
    authenticateFail
  )

  return bind(
    cookie('token'),
    handleSuccess,
    authenticateFail
  )
}

export const getProfile = ({ findSingle }) => findSingle({
  type: 'me',
  success: authenticateSuccess,
  fail: authenticateFail
})

const partnerAuthenticateSuccess = createAction(PARTNER_AUTHENTICATE_SUCCESS)
const partnerAuthenticateFail = createAction(PARTNER_AUTHENTICATE_FAIL)

export const partnerLogout = () => [
  partnerAuthenticateFail()
]

export const partnerLogin = ({ create, findSingle }) => create({
  url: '/login',
  type: 'login',
  success: [partnerAuthenticateSuccess, () => getPartnerProfile({ findSingle })],
  fail: [partnerAuthenticateFail]
})

export const getPartnerProfile = ({ findSingle }) => findSingle({
  type: 'partner',
  url: '/me?partner',
  success: partnerAuthenticateSuccess,
  fail: partnerAuthenticateFail
})

// ------------------------------------
// Reducer
// ------------------------------------
export const isAuthenticated = handleActions({
  [AUTHENTICATE_SUCCESS]: R.always(true),

  [AUTHENTICATE_FAIL]: R.always(false)
}, null)

export const isPartnerAuthenticated = handleActions({
  [PARTNER_AUTHENTICATE_SUCCESS]: R.always(true),

  [PARTNER_AUTHENTICATE_FAIL]: R.always(false)
}, null)

export default isAuthenticated
