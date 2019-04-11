import React from 'react'
let token = null

export default class ForgotPasswordComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newPassword: '',
      headerText: 'Reset Password'
    }

    token = this.props.pathName.split('/')[4]
  }

  updatePasswordState (e) {
    this.setState({ newPassword: e.target.value })
  }

  changePassword (e) {
    e.preventDefault()
    fetch(`http://api.quizop.com/users/forgot/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password: this.state.newPassword, token }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      response.json().then(() => {
        this.setState({ headerText: 'Password Changed!' });
        setTimeout( () => {
          window.location.href = '/login'
        }, 1000)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  render () {
    return (
        <div id='reset-pass'>
          <h1>{this.state.headerText}</h1>
          <input onChange={this.updatePasswordState.bind(this)} type='password' placeholder='Enter A New Password' />
          <button onClick={this.changePassword.bind(this)} type="submit">Submit</button>
        </div>
    )
  }
}