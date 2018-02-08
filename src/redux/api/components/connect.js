import { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect as reduxConnect } from 'react-redux'
import R from 'ramda'
import { actions as requestActions } from '../modules/requests'
import { requestSelector } from '../selectors'
import isPlainObject from '../utils/isPlainObject'

// ------------------------------------
// Helpers
// ------------------------------------

// defaultMapApiToProps :: _ -> Object
const defaultMapApiToProps = R.always({})

// defaultMapStateToProps :: _ -> Object
const defaultMapStateToProps = R.always({})

// defaultMapDispatchToProps :: Function -> Object
const defaultMapDispatchToProps = dispatch => ({ dispatch })

// getDisplayName :: Function -> String
const getDisplayName = (WrappedComponent) => WrappedComponent.displayName ||
  WrappedComponent.name || 'Component'

// wrapActionCreators :: Object -> Function -> Object
const wrapActionCreators = actionCreators => dispatch =>
  bindActionCreators(actionCreators, dispatch)

// requestCreators :: Object|Function, Object -> Object
const requestCreators = R.compose(
  R.filter(R.is(Function)),
  R.defaultTo({}),
  (mapApi, props) => isPlainObject(mapApi) ? mapApi : mapApi(props)
)

// requestCreatorsValues :: Object|Function, Object -> [Function]
const requestCreatorsValues = R.compose(
  R.values,
  requestCreators
)

// resolveRequest :: Function -> Object
const resolveRequest = R.flip(R.call)(requestActions)

// resolveRequests :: Object|Function, Object -> [Object]
const resolveRequests = R.compose(
  R.map(resolveRequest),
  requestCreators
)

// hasSelector :: (Object) Action -> Boolean
const hasSelector = R.compose(
  R.not,
  R.isNil,
  R.path(['payload', 'selector'])
)

// isLazyRequestAction :: (Object) Action -> Boolean
const isLazyRequestAction = R.path(['payload', 'lazy'])

// nonLazyDataProps :: Object|Function, Object, Object -> Object
const nonLazyDataProps = (mapApi, state, props) =>
  R.map(
    R.compose(
      R.flip(R.apply)([state, props]),
      R.path(['payload', 'selector'])
    ),
    R.compose(
      R.reject(isLazyRequestAction),
      R.filter(hasSelector),
      resolveRequests
    )(mapApi, props)
  )

// lazyDataProps :: Object|Function, Object, Object -> Object
const lazyDataProps = (mapApi, state, props) =>
  R.reduce((acc, pair) =>
    R.assoc(
      R.compose(
        R.defaultTo(R.concat(pair[0], 'Value')),
        R.path(['payload', 'propKey'])
      )(pair[1]),
      R.compose(
        R.flip(R.apply)([state, props]),
        R.path(['payload', 'selector'])
      )(pair[1]),
      acc
    ),
    {},
    R.compose(
      R.toPairs,
      R.filter(isLazyRequestAction),
      R.filter(hasSelector),
      resolveRequests
    )(mapApi, props)
  )

// requestProps :: Object|Function, Object, Object -> Object
const requestProps = (mapApi, state, props) =>
  R.map(
    R.compose(
      R.flip(R.apply)([state, props]),
      requestSelector,
      R.prop('payload'),
      resolveRequest,
    ),
    requestCreators(mapApi, props)
  )

// requestProps :: Object|Function, Function, Object -> Object
const requestsDispatch = (mapApi, dispatch, props) =>
  R.map(
    actionObj => (params = {}) => dispatch(R.assoc(
      'payload',
      R.merge(actionObj.payload, params),
      actionObj
    )),
    R.compose(R.filter(isLazyRequestAction), resolveRequests)(mapApi, props)
  )

// ------------------------------------
// Decorator
// ------------------------------------

// Helps track hot reloading.
let nextVersion = 0

export default function connect (mapApiToProps, mapStateToProps,
  mapDispatchToProps, ...otherParams) {
  // Safe defaults
  const mapApi = mapApiToProps || defaultMapApiToProps
  const mapState = mapStateToProps || defaultMapStateToProps
  const mapDispatch = isPlainObject(mapDispatchToProps)
    ? wrapActionCreators(mapDispatchToProps)
    : mapDispatchToProps || defaultMapDispatchToProps

  // Helps track hot reloading.
  const version = nextVersion++

  // In addition to mapStateToProps, inject:
  // - status and errors of requests (`requests` object)
  // - requests `data` response
  const finalMapStateToProps = (state, props) =>
    R.mergeAll([
      mapState(state, props),
      lazyDataProps(mapApi, state, props),
      nonLazyDataProps(mapApi, state, props),
      { requests: requestProps(mapApi, state, props) }
    ])

  // In addition to mapDispatchToProps, inject:
  // - lazy requests (typically POST, PUT & DELETE) actions
  const finalMapDispatchToProps = (dispatch, props) => {
    const actions = mapDispatch(dispatch, props)
    return R.mergeAll([
      actions,
      requestsDispatch(mapApi, dispatch, props)
    ])
  }

  return WrappedComponent => {
    const contextTypes = R.merge(WrappedComponent.contextTypes, {
      store: PropTypes.object
    })

    class InjectData extends WrappedComponent {
      static contextTypes = contextTypes;

      componentWillMount () {
        super.componentWillMount && super.componentWillMount()

        // Retry previously failed requests when component is re-mounted
        this.dispatchRequests({ retry: true })
      }

      componentWillReceiveProps (nextProps) {
        super.componentWillReceiveProps &&
          super.componentWillReceiveProps(nextProps)

        this.dispatchRequests({}, nextProps)
      }

      dispatchRequests (requestProps = {}, props = this.props) {
        const { dispatch } = this.context.store
        R.forEach(requestCreator => {
          const actionObject = resolveRequest(requestCreator)
          if (!isLazyRequestAction(actionObject)) {
            dispatch(R.assoc(
              'payload',
              R.merge(actionObject.payload, requestProps),
              actionObject)
            )
          }
        }, requestCreatorsValues(mapApi, props))
      }
    }

    if (!__PROD__) {
      InjectData.prototype.componentWillUpdate = function componentWillUpdate () {
        if (this.version === version) {
          return
        }

        // We are hot reloading!
        this.version = version
        this.dispatchRequests({ hotReload: true })
      }
    }

    InjectData.displayName = `ReduxAPI(${getDisplayName(WrappedComponent)})`
    InjectData.InjectDataWrappedComponent = WrappedComponent

    return reduxConnect(finalMapStateToProps, finalMapDispatchToProps,
      ...otherParams)(InjectData)
  }
}
