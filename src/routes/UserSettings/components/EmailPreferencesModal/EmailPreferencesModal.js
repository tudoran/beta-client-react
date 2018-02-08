import React, { Component, PropTypes } from 'react'
import { Button, Checkbox, FormGroup, Modal } from 'react-bootstrap'
import { connectModal } from 'redux-modal'
import { MdEmail } from 'helpers/icons'
import classes from './EmailPreferencesModal.scss'

class EmailPreferencesModal extends Component {
  static propTypes = {
    handleHide: PropTypes.func.isRequired,
    show: PropTypes.bool
  };

  render () {
    const { handleHide, show } = this.props

    return (
      <Modal show={show} onHide={handleHide} aria-labelledby='EmailPreferencesModal'
        dialogClassName={classes.emailPreferencesModal}>
        <Modal.Header closeButton>
          <Modal.Title>Email Preferences</Modal.Title>
        </Modal.Header>
        <form className='form-horizontal'>
          <Modal.Body>
            <p className={classes.headline}>
              We want to keep in touch in ways that you find helpful.
            </p>
            <h3 className={classes.listHeading}>
              <span className={classes.listHeadingIcon}>
                <MdEmail size='28' />
              </span>
              Transaction Confirmations
            </h3>
            <p className={classes.listNote}>
              SEC regulations require that we notify our customers when
              confirmations are available
            </p>
            <div className={classes.listSection}>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  When my deposits are invested
                </Checkbox>
              </FormGroup>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  When my withdrawals have traded and are en route back to me
                </Checkbox>
              </FormGroup>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  When my dividends are reinvested
                </Checkbox>
              </FormGroup>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  When my transfer or allocation change completes
                </Checkbox>
              </FormGroup>
            </div>
            <h3 className={classes.listHeading}>
              <span className={classes.listHeadingIcon}>
                <MdEmail size='28' />
              </span>
              Alerts
            </h3>
            <div className={classes.listSection}>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  To remind me a day before my automatic deposits will be
                  transferred
                </Checkbox>
              </FormGroup>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  When I make changes to my account (required for your security)
                </Checkbox>
              </FormGroup>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  When my quarterly statement is available (required by the SEC)
                </Checkbox>
              </FormGroup>
              <FormGroup className={classes.listItem}>
                <Checkbox disabled checked className={classes.listItemCheckbox}>
                  When my account balance hits $10,000,000
                </Checkbox>
              </FormGroup>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' bsStyle='primary'>
              Update Preferences
            </Button>
            <Button onClick={handleHide}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
}

export default connectModal({ name: 'emailPreferencesModal' })(EmailPreferencesModal)
