import React, { Children, Component, createClass, PropTypes } from 'react'
import configureStore from 'redux-mock-store'
import R from 'ramda'
import connect from 'redux/api/components/connect'
import TestUtils from 'react-addons-test-utils'

describe('Redux', () => {
  describe('api', () => {
    describe('connect', () => {
      class Passthrough extends Component {
        render () {
          return <div />
        }
      }

      class ProviderMock extends Component {
        static propTypes = {
          children: PropTypes.object,
          store: PropTypes.object
        };

        static childContextTypes = {
          store: PropTypes.object.isRequired
        };

        getChildContext () {
          return { store: this.props.store }
        }

        render () {
          return Children.only(this.props.children)
        }
      }

      it('should set the displayName correctly', () => {
        expect(connect(state => state)(
          class Foo extends Component {
            render () {
              return <div />
            }
          }
        ).displayName).to.equal('Connect(ReduxAPI(Foo))')

        expect(connect(state => state)(
          createClass({
            displayName: 'Bar',
            render () {
              return <div />
            }
          })
        ).displayName).to.equal('Connect(ReduxAPI(Bar))')

        expect(connect(state => state)(
          createClass({
            render () {
              return <div />
            }
          })
        ).displayName).to.be.oneOf(
          // Different behavior between PhantomJS and Chrome
          ['Connect(ReduxAPI(Component))', 'Connect(ReduxAPI(Constructor))']
        )
      })

      it('exposes the wrapped component as WrappedComponent', () => {
        class Container extends Component {
          render () {
            return <Passthrough />
          }
        }

        const decorated = connect()(Container)

        expect(decorated.InjectDataWrappedComponent).to.equal(Container)
      })

      it('passes state and props to the given component', () => {
        const store = configureStore()({
          foo: 'bar',
          baz: 42,
          hello: 'world'
        })

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const WrappedContainer = connect(
          null,
          ({ foo, baz }) => ({ foo, baz })
        )(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer pass='through' baz={50} />
          </ProviderMock>
        )
        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        expect(stub.props.pass).to.equal('through')
        expect(stub.props.foo).to.equal('bar')
        expect(stub.props.baz).to.equal(42)
        expect(stub.props.hello).to.equal(undefined)
        expect(() =>
          TestUtils.findRenderedComponentWithType(tree, WrappedContainer)
        ).to.not.throw()
      })

      it('allows undefined mapApiToProps and mapStateToProps', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const WrappedContainer = connect()(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        expect(() =>
          TestUtils.findRenderedComponentWithType(tree, WrappedContainer)
        ).to.not.throw()
      })

      it('injects `dispatch` when mapDispatchToProps is undefined', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const WrappedContainer = connect()(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        expect(stub.props.dispatch).to.be.a('function')
      })

      it(`wraps the action creators with the dispatch function when
        mapDispatchToProps is a plain object`, () => {
        const store = configureStore()({})

        class Container extends Component {
          static propTypes = {
            doSomething: PropTypes.func
          }

          render () {
            const { doSomething } = this.props
            return (
              <div className='target'
                onClick={doSomething}>
                <Passthrough {...this.props} />
              </div>
            )
          }
        }

        const doSomething = R.always({ type: 'DO_SOMETHING' })

        const WrappedContainer = connect(null, null, { doSomething })(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const target = TestUtils.findRenderedDOMComponentWithClass(tree, 'target')

        expect(R.length(store.getActions())).to.equal(0)
        TestUtils.Simulate.click(target)
        expect(store.getActions()[0]).to.equal(doSomething())
      })

      it('passes component props to mapApiToProps', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const requests = ({ color }) => ({
          foo: () => ({
            type: 'WHATEVER',
            payload: {
              color
            }
          })
        })

        const WrappedContainer = connect(requests)(Container)

        TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer color='red' />
          </ProviderMock>
        )

        expect(store.getActions()[0].payload.color).to.equal('red')
      })

      it('passes requests to the given component', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const requests = {
          foo: () => ({
            type: 'WHATEVER'
          })
        }

        const WrappedContainer = connect(requests)(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        expect(R.keys(stub.props.requests)).to.deep.equal(['foo'])
      })

      it('passes non-lazy requests results to the given component', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const requests = {
          foo: () => ({
            type: 'WHATEVER',
            payload: {
              selector: R.always('bar')
            }
          })
        }

        const WrappedContainer = connect(requests)(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        expect(stub.props.foo).to.equal('bar')
      })

      it('passes lazy requests results to the given component', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const requests = {
          foo: () => ({
            type: 'WHATEVER',
            payload: {
              lazy: true,
              selector: R.always('bar')
            }
          })
        }

        const WrappedContainer = connect(requests)(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        expect(stub.props.fooValue).to.equal('bar')
      })

      it('passes lazy requests results to the given component in provided key', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const requests = {
          foo: () => ({
            type: 'WHATEVER',
            payload: {
              lazy: true,
              selector: R.always('bar'),
              propKey: 'baz'
            }
          })
        }

        const WrappedContainer = connect(requests)(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        expect(stub.props.baz).to.equal('bar')
      })

      it('passes lazy request actions to the given component', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const requests = {
          foo: () => ({
            type: 'WHATEVER',
            payload: {
              lazy: true,
              selector: R.always('bar')
            }
          })
        }

        const WrappedContainer = connect(requests)(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        expect(stub.props.foo).to.be.a('function')
        expect(R.length(store.getActions())).to.equal(0)
        stub.props.foo({ foo: 'bar' })
        expect(store.getActions()[0].type).to.equal('WHATEVER')
      })

      it('merges passed params to lazy requests actions', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const foo = () => ({
          type: 'WHATEVER',
          payload: {
            lazy: true,
            bar: 39
          }
        })

        const requests = {
          foo
        }

        const WrappedContainer = connect(requests)(Container)

        const tree = TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)
        stub.props.foo({ bar: 21 })
        expect(store.getActions()[0].payload.bar).to.equal(21)
      })

      it(`dispatches requests on componentWillMount (with lazy=true) and on
        componentWillReceiveProps`, () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const requests = {
          foo: () => ({
            type: 'WHATEVER',
            payload: {}
          })
        }

        const WrappedContainer = connect(requests)(Container)

        class OuterContainer extends Component {
          constructor () {
            super()
            this.state = { color: 'blue' }
          }

          render () {
            return (
              <ProviderMock store={store}>
                <WrappedContainer color={this.state.color} />
              </ProviderMock>
            )
          }
        }

        expect(R.length(store.getActions())).to.equal(0)

        const tree = TestUtils.renderIntoDocument(<OuterContainer />)
        const stub = TestUtils.findRenderedComponentWithType(tree, Passthrough)

        expect(stub.props.color).to.equal('blue')
        expect(R.length(store.getActions())).to.equal(1)
        expect(store.getActions()[0].payload.retry).to.equal(true)
        tree.setState({ color: 'red' })
        expect(stub.props.color).to.equal('red')
        expect(R.length(store.getActions())).to.equal(3)
        expect(store.getActions()[1].payload.retry).to.equal(undefined)
        expect(store.getActions()[2].payload.retry).to.equal(undefined)
        expect(store.getActions()[2].payload.hotReload).to.equal(true)
      })

      it('dispatches requests on hot reload', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const WrappedContainerBefore = connect({
          foo: () => ({
            type: 'WHATEVER',
            payload: {
              color: 'blue'
            }
          })
        })(Container)

        const WrappedContainerAfter = connect({
          foo: () => ({
            type: 'WHATEVER',
            payload: {
              color: 'red'
            }
          })
        })(Container)

        class OuterContainer extends Component {
          constructor () {
            super()
            this.state = { trigger: false }
          }

          render () {
            return (
              <ProviderMock store={store}>
                <WrappedContainerBefore trigger={this.state.trigger} />
              </ProviderMock>
            )
          }
        }

        const tree = TestUtils.renderIntoDocument(<OuterContainer />)

        expect(store.getActions()[0].payload.color).to.equal('blue')

        // https://git.io/v6GeQ
        function imitateHotReloading (TargetClass, SourceClass) {
          // Crude imitation of hot reloading that does the job
          Object.getOwnPropertyNames(SourceClass.prototype).filter(key =>
            typeof SourceClass.prototype[key] === 'function'
          ).forEach(key => {
            if (key !== 'render' && key !== 'constructor') {
              TargetClass.prototype[key] = SourceClass.prototype[key]
            }
          })

          // Don't dispatch requests on props change, in order to test
          // hot reload.
          TargetClass.prototype.componentWillReceiveProps = undefined
        }

        imitateHotReloading(WrappedContainerBefore.WrappedComponent,
          WrappedContainerAfter.WrappedComponent)
        tree.setState({ trigger: true })
        expect(store.getActions()[1].payload.color).to.equal('red')
      })

      it('dispatches only non-lazy requests on componentWillMount', () => {
        const store = configureStore()({})

        class Container extends Component {
          render () {
            return <Passthrough {...this.props} />
          }
        }

        const nonLazy = () => ({
          type: 'NON_LAZY',
          payload: {}
        })
        const lazy = () => ({
          type: 'LAZY',
          payload: {
            lazy: true
          }
        })

        const requests = {
          nonLazy,
          lazy
        }

        const WrappedContainer = connect(requests)(Container)

        expect(R.length(store.getActions())).to.equal(0)

        TestUtils.renderIntoDocument(
          <ProviderMock store={store}>
            <WrappedContainer />
          </ProviderMock>
        )

        expect(R.length(store.getActions())).to.equal(1)
        expect(store.getActions()[0].type).to.equal('NON_LAZY')
      })
    })
  })
})
