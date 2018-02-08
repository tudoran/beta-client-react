import React, { Component, PropTypes } from 'react'

class ChangePasswordError extends Component{
  static propTypes = {
    show: PropTypes.bool.isRequired
  };

  render () {
    const { show } = this.props
    return show ? (
      <div className='text-danger'>
        Invalid password or question answer.
      </div>
    ) : false
  }
}

export default ChangePasswordError
