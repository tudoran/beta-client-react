import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connectModal } from 'redux-modal'

class WhyThisETFModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  };

  render () {
    const { handleHide, show } = this.props
    return (
      <Modal show={show}
        animation={false}
        bsSize='large'
        onHide={handleHide}
        aria-labelledby='ModalHeader'>
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>Why these ETFs?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          BetaSmartz exclusively uses open-ended index tracking ETFs rather than mutual or closed-end funds due to their
          low manager risk, low embedded costs and natural tax efficiencies. These structural advantages along with the
          maturation and growth of the global ETF market over the last two decades has led to liquid investments
          covering different asset classes, markets, styles, and geographies. As a result, we can source investment
          vehicles from a market of portfolio components which are versatile, extremely liquid, and easily
          substitutable. However, not all ETFs are exactly alike and the difference between an optimal and a suboptimal
          selection can have non-trivial effects on long-term performance of a portfolio.
          </p>
          <p>
          Excellent security selection requires a thorough process which maximizes the risk-adjusted, after-tax,
          after-cost return for our customers' portfolios. BetaSmartz's approach is to aggregate these frictions into a
          single variable we refer to as the total annual cost of investment. The four key metrics that comprise this
          measure are:
          </p>
          <ol>
            <li>
              Expense ratio: The annual cost paid by shareholders of the ETF to the fund administrator, often incurred
              through reduced dividends passing through from underlying holdings to ETF investors.
            </li>
            <li>
              Liquidity (bid-ask spread): The small price difference between the buying price and selling price inherent
              to all traded securities. More liquid securities will carry a tighter spread. Note that the bid-ask spread
              is only paid when you trade, and so should be scaled by annual portfolio turnover.
            </li>
            <li>
              Tracking error: The degree to which a specific security does not precisely replicate its intended
              underlying index. While not an outright cost as with the other criteria discussed, tracking error
              (especially high values) has the ability to introduce noise in the long-term returns of the overall
              portfolio, and reduce the effectiveness of portfolio optimization.
            </li>
            <li>
              Potential market impact: The degree to which ownership and trading activity across the BetaSmartz platform
              could come to dominate ETF assets managed, daily traded volumes, and the security's natural market
              efficiency.
            </li>
          </ol>
          <br />
          This analysis yields a spectrum of the most cost-effective ETFs for our strategic asset allocation portfolio.
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={handleHide}>OK</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connectModal({ name: 'whyThisETF' })(WhyThisETFModal)
