import React, { Component } from 'react'
import { MdFileDownload } from 'helpers/icons'
import classes from './ActivityFooter.scss'

export default class ActivityFooter extends Component {
  render () {
    return (
      <div>
        <div className={classes.downloadAdobeReader}>
          Statements and confirmations can be viewed as PDFs by downloading
          and installing the free <a target='_blank'
            href='http://get.adobe.com/reader/'>Adobe Reader</a>
        </div>
        <div className={classes.downloadActivity}>
          <a href='#' className={classes.downloadActivityLink}>
            <MdFileDownload size='18' />
            <span className={classes.downloadActivityText}>
              Download Activity as CSV
            </span>
          </a>
        </div>
      </div>
    )
  }
}
