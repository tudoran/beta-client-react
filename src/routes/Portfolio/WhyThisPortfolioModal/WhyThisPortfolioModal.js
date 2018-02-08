import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connectModal } from 'redux-modal'

class WhyThisPortfolioModal extends Component {
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
          <Modal.Title id='ModalHeader'>Why this Portfolio?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          BetaSmartz constructs globally diversified strategic asset allocation portfolios appropriate for an investor's
          goals and time horizon. Each portfolio is selected as the result of a systematic portfolio optimization
          process that simultaneously balances forecasts for long-run expected returns for each asset class against both
          historical and forward-looking downside behavior for the portfolio as a whole.
          </p>
          <p>
          In forecasting expected returns, we utilize the Black-Litterman Global Portfolio Optimization model to
          appropriately combine market expectations extracted from historical performance and current price levels with
          BetaSmartz's views on long-run asset class behaviour and correlations. Our advice is based on expected returns
          as well as downside risk and uncertainty as measured by historical episodes of underperformance and simulated
          stress tests of the asset performance. The result is a portfolio that provides an optimal blend of asset class
          exposures across different economic regions, investment styles and security types to deliver the best possible
          risk-adjusted returns for every level of risk.
          </p>
          <p>
          The long-term performance of a portfolio can be negatively impacted by interest rates and inflation. Our fully
          diversified global portfolio helps smooth out the impact of these factors since different areas of the world
          experience them at different times and with varying severity. Our portfolio also avoids a common behavioural
          error of investors called home-bias, or the tendency to own companies from the country you live in.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={handleHide}>OK</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connectModal({ name: 'whyThisPortfolio' })(WhyThisPortfolioModal)
