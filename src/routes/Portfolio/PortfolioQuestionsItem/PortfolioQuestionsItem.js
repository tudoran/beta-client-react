import React, { PropTypes } from 'react'
import { Col } from 'react-bootstrap'
import { MdInfo } from 'helpers/icons'
import classes from './PortfolioQuestionsItem.scss'

const PortfolioQuestionsItem = ({ question, show }) => (
  <Col xs={4} className={classes['portfolio-questions-item']}
    onClick={function () { show(question.key) }}>
    <h6 className={classes.category}>{question.category}</h6>
    <div>
      <MdInfo size='15' />
      <span className={classes.title}>{question.title}</span>
    </div>
  </Col>
)

PortfolioQuestionsItem.propTypes = {
  question: PropTypes.object,
  show: PropTypes.func
}

export default PortfolioQuestionsItem
