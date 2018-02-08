import configureStore from 'redux-mock-store'
import effects from 'redux-effects'
import multi from 'redux-multi'
import R from 'ramda'
import { MAYBE_REQUEST, REQUEST_STARTED } from 'redux/api/modules/requests'
import middleware from 'redux/api/middleware'

describe('Redux', () => {
  describe('api', () => {
    describe('middleware', () => {
      it('handles MAYBE_REQUEST actions', () => {
        const store = configureStore([middleware(), effects, multi])({})

        const maybeRequest = () => ({
          type: MAYBE_REQUEST,
          payload: {

          }
        })

        expect(R.length(store.getActions())).to.equal(0)
        store.dispatch(maybeRequest())
        expect(store.getActions()[0].type).to.equal(REQUEST_STARTED)
      })

      it('passes through other types of actions, besides MAYBE_REQUEST', () => {
        const store = configureStore([middleware(), effects, multi])({})

        const other = () => ({
          type: 'WHATEVER'
        })

        expect(R.length(store.getActions())).to.equal(0)
        store.dispatch(other())
        expect(store.getActions()[0].type).to.equal('WHATEVER')
      })

      xit('always dispatches MAYBE_REQUEST when `cache` is false')
      xit('always dispatches MAYBE_REQUEST when `force` is true')
      xit('always dispatches MAYBE_REQUEST when it is not a GET request')
      xit('dispatches MAYBE_REQUEST when it is not found in cache')
      xit('dispatches MAYBE_REQUEST when previous request has failed and `retry` is true')
    })

    describe('request (action creator)', () => {
      xit('merges default request params')
      xit('returns REQUEST_STARTED and EFFECT_COMPOSE types of actions')
      xit('TODO need more tests')
    })
  })
})
