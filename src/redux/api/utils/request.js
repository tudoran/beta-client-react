import R from 'ramda'

// getCSRFToken :: document -> String
const getCSRFToken = R.compose(
  R.prop('csrftoken'),
  R.fromPairs,
  R.map(R.split('=')),
  R.map(R.trim),
  R.split(';'),
  R.prop('cookie')
)

export const assignDefaults = request => {
  const csrfToken = getCSRFToken(document)

  const headers = request.method === 'DELETE' ? request.headers || {} : R.merge({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  }, request.headers || {})

  const body = R.contains(request.method, ['POST', 'PUT']) && request.body
    ? JSON.stringify(request.body)
    : request.body

  const other = {
    method: 'GET',
    redirect: 'follow',
    credentials: 'same-origin',
    meta: {}
  }

  return R.mergeAll([
    other,
    request,
    { headers },
    { body }
  ])
}

export const requestFootprint = R.pick(['url', 'method', 'headers'])

export const compareRequests = R.useWith(R.equals, [
  requestFootprint,
  requestFootprint
])
