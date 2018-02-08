import React, { PropTypes } from 'react'
import R from 'ramda'
import Loader from 'components/Loader/Loader'
import Error from 'components/Error/Error'

const isAnyRequest = status => R.compose(
  R.any(R.compose(R.propEq('status', status), R.defaultTo({}))),
  R.values
)

const isAnyRequestRejected = isAnyRequest('rejected')
const isAnyRequestPending = isAnyRequest('pending')

export default function dataFetchingPresenter (Component) {
  return class DataFetchingPresenterComponent extends Component {
    static propTypes = R.merge(Component.propTypes, {
      requests: PropTypes.object
    })

    requests () {
      if (super.requests) {
        return super.requests()
      } else {
        const { requests } = this.props
        return requests || []
      }
    }

    render () {
      const requests = this.requests()

      if (isAnyRequestPending(requests)) {
        return <Loader />
      } else if (isAnyRequestRejected(requests)) {
        return <Error />
      } else {
        return super.render()
      }
    }
  }
}
