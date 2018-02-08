import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import { Button, Row, Col, Modal } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { FormattedNumber } from 'react-intl'
import classNames from 'classnames'
import { connect } from 'redux/api'
import { findQuerySelector } from 'redux/api/selectors'
import { propsChanged } from 'helpers/pureFunctions'
import { getDuration, getTarget } from '../helpers'
import { MdCheck } from 'helpers/icons'
import aggregateSelectedPortfolio from 'helpers/aggregateSelectedPortfolio'
import classes from './CreateGoalSuccessModal.scss'
import PieChart from 'components/PieChart/PieChart'

const getBondsPercentage = R.compose(
  R.sum,
  R.map(R.prop('usedWeight')),
  R.filter(
    R.compose(
      R.equals('BONDS'),
      R.path(['assetClass', 'investment_type'])
    )
  )
)

class CreateGoalSuccessModal extends Component {
  static propTypes = {
    assetsClasses: PropTypes.array,
    goal: PropTypes.object,
    handleHide: PropTypes.func,
    positions: PropTypes.array,
    show: PropTypes.bool,
    tickers: PropTypes.array,
    values: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  shouldComponentUpdate (nextProps) {
    return propsChanged(['assetsClasses', 'goal', 'positions', 'show',
      'tickers', 'values'], this.props, nextProps)
  }

  render () {
    const { assetsClasses, goal: { balance, name, selected_settings,
      selected_settings: { portfolio } }, handleHide, positions,
      show, tickers } = this.props
    const { intl: { formatNumber } } = this.context
    const duration = getDuration(selected_settings, 'years')
    const target = getTarget(selected_settings)
    const aggregatedPortfolio = aggregateSelectedPortfolio({ assetsClasses,
      balance, formatNumber, positions, selectedPortfolio: portfolio, tickers })
    const portfolioForPieChart = R.filter(
      R.propEq('type', 'portfolioItem'),
      aggregatedPortfolio
    )
    const bondsPercentage = getBondsPercentage(portfolioForPieChart)

    return (
      <Modal show={show} dialogClassName={classes.modal}>
        <Modal.Header className={classes.header}>
          <Modal.Title className={classes.title}>
            Your '{name}' goal has been set up
          </Modal.Title>
          <div className={classes.checkIconWrapper}>
            <span className={classes.checkIcon}>
              <MdCheck size={40} />
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className={classes.body}>
            You want to invest for {duration} years, so we calculate that a
            portfolio of <FormattedNumber value={1 - bondsPercentage}
              format='percent' /> stocks / <FormattedNumber
                value={bondsPercentage} format='percent' /> bonds will
            maximize your money's potential growth and reduce potential losses.
          </p>

          <Row>
            <Col xs={4}>
              <span className={classes.subtitle}>Your portfolio</span>
              <PieChart datum={portfolioForPieChart} />
            </Col>
            <Col xs={8}>
              <ul className='list-inline'>
                <li className={classes.listItem}>
                  <span className={classes.subtitle}>Target</span>
                  <br />
                  <span className={classes.listItemValue}>
                    <FormattedNumber value={target}
                      format='currencyWithoutCents' />
                  </span>
                </li>
                <li className={classes.listItem}>
                  <span className={classes.subtitle}>Time</span>
                  <br />
                  <span className={classes.listItemValue}>
                    {duration} years
                  </span>
                </li>
              </ul>
              <ul className={classes.bodyList}>
                <li className={classNames(classes.subtitle,
                    classes.bodyListTitle)}>
                  What's happening under the hood:
                </li>
                <li>
                  Our <a href='https://app.betasmartz.com/experts'
                    target='_blank'>team of experts</a>&nbsp;
                  have done all the research so you don't have to.
                </li>
                <li>
                  We've customized a diversified portfolio of&nbsp;
                  <a href='https://app.betasmartz.com/portfolio'
                    target='_blank'>exchange traded funds</a> (ETFs).
                </li>
                <li>
                  We rebalance your portfolio to minimize risk and maximize
                  expected returns.
                </li>
                <li>
                  We reinvest your dividends to increase expected returns.
                </li>
                <li>
                  All for one low cost that covers everything, including
                  trading and advice.
                </li>
              </ul>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className={classes.footer}>
          <Button className={classes.footerBtn} onClick={handleHide}
            bsStyle='primary'>OK</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const requests = ({ goal: { id } }) => ({
  assetsClasses: ({ findAll }) => findAll({
    type: 'assetsClasses',
    url: '/settings/asset-classes'
  }),
  positions: ({ findAll }) => findAll({
    type: 'positions',
    url: `/goals/${id}/positions`,
    selector: findQuerySelector({
      type: 'positions',
      query: { goal: parseInt(id, 10) }
    })
  }),
  tickers: ({ findAll }) => findAll({
    type: 'tickers',
    url: '/settings/tickers'
  })
})

export default R.compose(
  connectModal({ name: 'createGoalSuccess' }),
  connect(requests)
)(CreateGoalSuccessModal)
