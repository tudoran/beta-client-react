import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import classNames from 'classnames'
import R from 'ramda'
import { getDriftScore, getDuration, getRebalance, getRebalanceThreshold,
  getRisk } from 'routes/Allocation/helpers'
import { MdChevronRight } from 'helpers/icons'
import classes from './PortfolioDiagramBlock.scss'
import PieChart from 'components/PieChart/PieChart'
import Rebalance from 'containers/Rebalance/Rebalance'
import RiskDescription from 'containers/RiskDescription/RiskDescription'

export default class PortfolioDiagramBlock extends Component {
  static propTypes = {
    selectedPortfolio: PropTypes.array,
    goal: PropTypes.object,
    goalId: PropTypes.string,
    isPending: PropTypes.bool
  };

  static contextTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string
  };

  render () {
    const { selectedPortfolio, goal, goalId, isPending } = this.props
    const { accountId, clientId } = this.context
    const risk = goal && getRisk(goal.selected_settings)
    const rebalanceValues = goal && {
      rebalance: getRebalance(goal.selected_settings),
      rebalanceThreshold: getRebalanceThreshold(goal.selected_settings)
    }
    const portfolioForPieChart = R.filter(
      R.propEq('type', 'portfolioItem'),
      selectedPortfolio
    )

    return (
      <div className={classNames('portfolio-diagram-block',
        classes['portfolio-diagram-block'])}>
        <p className={classes.title}>Your Selected Portfolio</p>
        <PieChart datum={portfolioForPieChart} isPending={isPending} />
        <Row className={classes.allocation}>
          <Col xs={4} className={classes.allocationLabels}>
            <div>Risk Score</div>
          </Col>
          <Col xs={8} className={classes.allocationValue}>
            {goal &&
              <RiskDescription goalId={goal.id} risk={risk} withRiskScore
                years={getDuration(goal.selected_settings, 'years')} />}
          </Col>
        </Row>
        {goal && <Rebalance driftScore={getDriftScore(goal)}
          values={rebalanceValues} viewOnly />}
      </div>
    )
  }
}
