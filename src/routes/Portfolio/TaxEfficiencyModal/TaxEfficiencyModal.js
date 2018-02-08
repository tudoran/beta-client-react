import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connectModal } from 'redux-modal'

class TaxEfficiencyModal extends Component {
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
          <Modal.Title id='ModalHeader'>Tax Efficiency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
          BetaSmartz portfolios and the systems that manage them are constructed from the ground up to
          be maximally tax efficient. This begins with security selection, where we use index tracking
          ETFs instead of mutual funds. Unlike actively managed funds, index tracking funds have significantly
          lower turnover resulting in materially lower incidences of capital gains being passed on to investors.
          In addition, the legal and administrative structure of most ETFs differs from mutual funds in the way
          that investors are insulated from each other rather than pooled together. As a result, ETF investors
          are only responsible for their own tax consequences rather than sharing in the collective tax burden
          through distributions. The end result of just holding ETFs is a portfolio with lower capital gains burden
          which is also entirely immune to mutual fund style administrator-driven distribution.
          </p>
          <p>
          The tax impact of BetaSmartz portfolios is also made more efficient through
          a number of automated day-to-day management features:
          </p>
          <ul>
            <li>
              Cash-flows are used to reduce the portfolio drift, which reduces future taxable rebalances.
              For example, a deposit from a dividend or automatic transfer will always buy the most
              underweight asset classes first. Similarly, a withdrawal will sell the most overweight assets first.
            </li>
            <li>
              Tax lot selection is optimized to reduce taxes. Lots with losses are always sold before lots with gains.
              Short term losses are preferred over long term losses, and long term gains are prefered
              over short term gains. Additionally, lots with the highest cost basis, and therefore the
              lowest embedded potential tax burden, are sold first.
            </li>
            <li>
              Rebalancing transactions and portfolio updates are tax aware, and always avoid short-term gains which
              are typically taxed at the highest rates.
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='primary' onClick={handleHide}>OK</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connectModal({ name: 'taxEfficiency' })(TaxEfficiencyModal)
