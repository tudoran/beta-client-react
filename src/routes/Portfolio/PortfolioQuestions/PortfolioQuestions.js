import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import classes from './PortfolioQuestions.scss'
import PortfolioQuestionsItem
  from '../PortfolioQuestionsItem/PortfolioQuestionsItem'
import Row from 'react-bootstrap/lib/Row'

export default class PortfolioQuestions extends Component {
  static propTypes = {
    questions: PropTypes.array,
    show: PropTypes.func
  };

  render () {
    const { questions, show } = this.props
    const questionList = R.map(question => {
      return <PortfolioQuestionsItem question={question} key={question.key}
        show={show} />
    }, questions)

    return (
      <Row className={classes.portfolioQuestions}>
        {questionList}
      </Row>
    )
  }
}
