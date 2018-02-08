import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, Form, FormGroup, Radio, Row } from 'react-bootstrap'
import R from 'ramda'
import Button from 'components/Button/Button'
import classes from './Question.scss'

const unanswered = R.compose(
  R.isEmpty,
  R.defaultTo(''),
  R.prop('value'),
  R.defaultTo({})
)

export default class Question extends Component {
  static propTypes = {
    field: PropTypes.object,
    goTo: PropTypes.func,
    index: PropTypes.number,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    next: PropTypes.func,
    previous: PropTypes.func,
    question: PropTypes.object,
    save: PropTypes.func
  };

  render () {
    const { field, index, isFirst, isLast, next, previous, question,
      save } = this.props
    const nextDisabled = unanswered(field)

    return (
      <Form className={classes.question} horizontal>
        <Row>
          <Col xs={1} className={classes.numberColumn}>
            <FormGroup>
              <ControlLabel className={classes.label}>
                {index + 1}.
              </ControlLabel>
            </FormGroup>
          </Col>
          <Col xs={11}>
            <FormGroup>
              <Col xs={12}>
                <ControlLabel className={classes.label}>
                  {question.text}
                </ControlLabel>
                <div className={classes.options}>
                  {R.map(option =>
                    <Radio className={classes.option} key={option.id} {...field}
                      value={option.id}
                      checked={R.equals(parseInt(field.value, 10), option.id)}>
                      {option.text}
                    </Radio>
                  , question.answers)}
                </div>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={12}>
                {isFirst
                ? <Button className={classes.button} disabled>Previous</Button>
                : <Button className={classes.button} onClick={previous}>
                  Previous
                </Button>}
                {isLast
                ? <Button className={classes.button} bsStyle='primary'
                  disabled={nextDisabled} onClick={save}>
                  Submit
                </Button>
                : <Button className={classes.button} bsStyle='primary'
                  disabled={nextDisabled} onClick={next}>
                  Next
                </Button>}
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    )
  }
}
