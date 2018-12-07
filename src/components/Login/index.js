import React from 'react';
import { TweenMax, TimelineMax, Power4 } from 'gsap/all'
import FaceBookAuthentication from '../facebook-login';
import Link from 'next/link';
import $ from 'jquery';
let SplitText = null;
import './login.sass';
let host = null;
import ReactGA from 'react-ga';

class LoginComponent extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
      forgotPasswordEmail: '',
      showModal: false,
      emailSent: false,
      errorMsg: ''
    }
  }

  componentDidMount () {
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview('/login');
    SplitText = require('../../gsap/SplitText').SplitText;
    $(window).scrollTop(0);
    LoginComponent.init();
    host = window.location.protocol + '//' + window.location.host;
  }

  setInputValue (key, e) {
    this.setState({ [key]: e.target.value })
  }

  tryToSignInUser () {
    if (this.state.email && this.state.password) {
      if (!this.validateEmail()) {
        this.setState({ errorMessage: 'Email address is invalid' })
      } else {
        let data = {
          email: this.state.email,
          password: this.state.password
        };
        this.setState({ errorMessage: '' });
        $.ajax({
          type: 'POST',
          url: `${host}/api/users/login`,
          data: JSON.stringify(data),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: (response) => {
            this.setState({ errorMessage: '' });
            
            ReactGA.event({
              category: 'User',
              action: `${response.name} successfully logged in`
            });
            console.log('logged in');
            //history.push('/explore')
          },
          error: () => {
            ReactGA.event({
              category: 'User',
              action: `login attempt failed`
            });
            this.setState({ errorMessage: 'Authorization failed' })
          }
        })
      }
    } else {
      this.setState({ errorMessage: 'Please make sure all fields are filled in.' })
    }
  }

  validateEmail() {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email)
  }

  allowEnter (e) {
    if (e.key === 'Enter') {
      this.tryToSignInUser()
    }
  }

  sendForgotPasswordEmail (e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.forgotPasswordEmail) {
      $('.forgot-password-text').css({ filter: 'grayscale(100%)' });
      $.ajax({
        type: 'POST',
        url: `${host}/api/users/forgot`,
        data: JSON.stringify({ email: this.state.forgotPasswordEmail }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: (response) => {
          this.setState({ emailSent: true });
          $('.forgot-password-text').css({ filter: 'grayscale(0)' });
        },
        error: (err) => {
          $('.forgot-password-text').css({ filter: 'grayscale(0)' });
          this.setState({ errorMsg: 'That email address does not exist' })
        }
      });
    } else {
      this.setState({ errorMsg: 'Please enter a valid email address' })
    }
  }

  updateForgotPasswordEmail (e) {
    this.setState({ forgotPasswordEmail: e.target.value })
  }

  openModal() {
    this.setState({ showModal: true })
  }

  closeModal() {
    this.setState({ showModal: false })
  }

  render () {
    return (
        <div id="login">
          <div className="login-form">
            <h1>Welcome Back</h1>
            <p>{this.state.errorMessage}</p>
            <form>
              <input onKeyPress={this.allowEnter.bind(this)} onChange={this.setInputValue.bind(this, 'email')} className="input-1" type="email" placeholder="Email" />
              <input onKeyPress={this.allowEnter.bind(this)} onChange={this.setInputValue.bind(this, 'password')} className="input-2" type="password" placeholder="Password"/>
              <button className="login-button" onClick={this.tryToSignInUser.bind(this)} type="button">SIGN IN</button>
              <FaceBookAuthentication />
              <p onClick={this.openModal.bind(this)}>Forgot Password?</p>
              <p className="no-account">Don't have an account <Link href='/register'><a>Register</a></Link></p>
            </form>
          </div>
          { this.state.showModal
              ?
              <div className="overlay-modal">
                <div className="forgot-password-modal">
                  <img onClick={this.closeModal.bind(this)} className='close-forgot-modal' src='/static/images/icons/close.png' />
                  <form>
                    <img className='main-icon' src='/static/images/icons/thumbsup.svg' />
                    { !this.state.emailSent
                        ?
                        <div className='forgot-password-text'>
                          <h1>Don't worry we got you covered</h1>
                          <p>Please enter your email address</p>
                          <span>{this.state.errorMsg}</span>
                          <input onChange={this.updateForgotPasswordEmail.bind(this)} type="email" placeholder="Email" />
                          <button onClick={this.sendForgotPasswordEmail.bind(this)}>CONTINUE</button>
                        </div>
                        :
                        <div>
                          <h1>Email Sent!</h1>
                          <p>Please click the link in the email we sent to you. If you do not see the email please check your junk.</p>
                        </div>
                    }
                  </form>
                </div>
              </div>
              : null
          }
        </div>
    )
  }

  static init () {
    const T1Split = new SplitText(
        '.login-form h1',
        { type: 'chars' }
    )
    const T1Animation = new TimelineMax()
    TweenMax.set(
        '#split',
        { opacity: 1 }
    )
    T1Animation.staggerFrom(
        T1Split.chars,
        0.3,
        {
          y: 10,
          opacity: 0,
          ease: Power4.easeOut,
          delay: 0.3
        },
        0.03, '+=0')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loginUser: (userObject) => {
      const action = {
        type: LOGIN_USER,
        userObject
      }
      dispatch(action)
    }
  }
}

function mapStateToProps (state) {
  return {
    auth: state.auth
  };
}

export default LoginComponent
