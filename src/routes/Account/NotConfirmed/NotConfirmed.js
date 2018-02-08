import React, { Component, PropTypes } from 'react'
import { Col, Panel, Row } from 'react-bootstrap'
import classNames from 'classnames'
import { MdWarning } from 'helpers/icons'
import classes from './NotConfirmed.scss'

const header = ({ account: { account_name: accountName } }) => // eslint-disable-line react/prop-types
  <div>{accountName}</div>

export default class NotConfirmed extends Component {
  static propTypes = {
    account: PropTypes.object
  };

  render () {
    return (
      <div className={classNames('page', classes.page)}>
        <div className='container'>
          <Row>
            <Col xs={6} xsOffset={3}>
              <Panel bsStyle='warning' header={header(this.props)}>
                <div className={classes.panelBody}>
                  <MdWarning size={120} className={classes.icon} />
                  <span className={classes.text}>
                    Your account setup is not yet complete.<br />
                    <a href='http://www.betasmartz.com/todo-labgroup-link'
                      target='_blank'>
                      Click here to complete it
                    </a>.
                  </span>
                </div>
              </Panel>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
