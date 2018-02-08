import React, { PropTypes } from 'react'
import { mapIndexed } from 'helpers/pureFunctions'

const FieldError = ({ for: { error, touched }, afterTouch = true }) => {
  const show = error && (touched || !afterTouch)
  const output = show && mapIndexed((item, index) =>
    <div key={index}>{item}</div>, error)
  return (
    <div className='text-danger'>{output}</div>
  )
}

FieldError.propTypes = {
  afterTouch: PropTypes.bool,
  for: PropTypes.object.isRequired
}

export default FieldError
