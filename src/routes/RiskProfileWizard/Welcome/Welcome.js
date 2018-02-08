import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import classNames from 'classnames'
import R from 'ramda'
import { goTo } from 'redux/modules/router'
import classes from './Welcome.scss'
import logo from './logo.png'

class Welcome extends Component {
  static propTypes = {
    accountId: PropTypes.string,
    clientId: PropTypes.string,
    goTo: PropTypes.func,
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  };

  handleClick = () => {
    const { accountId, clientId, goTo, handleHide } = this.props
    handleHide()
    goTo(`/${clientId}/account/${accountId}/risk-profile-wizard`)
  }

  render () {
    const { handleHide, show } = this.props

    return (
      <Modal animation={false} show={show} onHide={handleHide}
        aria-labelledby='ModalHeader'>
        <Modal.Body className='text-center'>
          <Row className={classes.row}>
            <Col xs={12}>
              <img className={classes.logo} src={logo} />
            </Col>
          </Row>
          <Row className={classes.row}>
            <Col xs={12}>
              <h3>Welcome to your account!</h3>
            </Col>
          </Row>
          <Row className={classNames(classes.row, classes.bodyText)}>
            <Col xs={12}>
               The following questionnaire has been prepared to help you
               consider investment risks and to understand how they impact on
               your personal circumstances. The questions define your attitude
               to security and the level of risk you are prepared to accept for
               your investments. By answering these questions you will assist
               us in developing an appropriate investment strategy that will
               meet your financial and lifestyle objectives.
            </Col>
          </Row>
          <Row className={classes.row}>
            <Col xs={12}>
              <Button bsStyle='primary' onClick={this.handleClick}>
                Continue to Risk Profile Wizard
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    )
  }
}

const actions = { goTo }

export default R.compose(
  connect(null, actions),
  connectModal({ name: 'welcomeAccount' })
)(Welcome)
