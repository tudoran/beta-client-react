import React, { Component } from 'react'
import { MdLocalPhone, MdMailOutline } from 'helpers/icons'
import classes from './Footer.scss'
import logo from './betasmartz-logo.png'

export default class Footer extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <footer className={classes['main-footer']}>
        <div id={classes['footerLinks']}>
          <div className='container'>
            <ul className={classes['advised-user-only']}>
              <li>Technical support</li>
              <li>
                <MdMailOutline size='18' className={classes.icon} />&nbsp;
                <a href='mailto:support@betasmartz.com'>Email us</a>
              </li>
              <li>
                <MdLocalPhone size='18' className={classes.icon} /> Call 1800-888-8888
              </li>
            </ul>
          </div>
        </div>
        <div className={'container ' + classes['disclosure']}>
          <div className={classes['powered-by']}>Powered by</div>
          <figure className={classes['logo'] + ' text-center'}><img src={logo}
            alt='BetaSmartz' /></figure>
          <figcaption>© BetaSmartz Pty Ltd </figcaption>
          <p className={classes['pad']}>
            By initiating transactions in your BetaSmartz account you agree to
            BetaSmartz's&nbsp;
            <a href='http://www.betasmartz.com/terms-and-conditions/'>
              <u>Terms &amp; Conditions</u>
            </a>.
          </p>
          <p>
            This website is operated and maintained by BetaSmartz
            Pty Ltd ABN 80 609 111 140, a Corporate Authorised
            Representative (No. 001239522) of BR Securities Australia Pty
            Ltd (AFS Licence No. 456663). Any advice contained in this website
            is general advice only and has been prepared without considering
            your objectives, financial situation or needs except in
            circumstances where you have provided your personal financial
            details via our online application process and received a Statement
            of Advice from us. Before making any investment decision we
            recommend that you consider whether it is appropriate for your
            situation and seek appropriate taxation and legal advice. Please
            read our <a href='http://www.betasmartz.com/fsg/'>Financial Services
            Guide</a> before deciding whether to obtain financial services from
            us.
          </p>
          <p>
            Investing in securities involves risks, and the income derived from
            them can go down as well as up. Past performance is not a reliable
            indicator of future returns and you may not get back your original
            investment, all investment outcomes being hypothetical in nature.
            Before investing, consider your investment objectives and
            BetaSmartz's charges and expenses. Not an offer, solicitation of an
            offer, or advice to buy or sell securities in jurisdictions where
            BetaSmartz is not registered.
          </p>
          <p>
            BetaSmartz and RetireSmartz are trademarks of BetaSmartz Pty Ltd.
          </p>
        </div>
      </footer>
    )
  }
}
