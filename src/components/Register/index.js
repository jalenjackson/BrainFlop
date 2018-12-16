import React from 'react'
import { TweenMax, TimelineMax, Power4 } from 'gsap/all'
import $ from 'jquery'
import FaceBookAuthentication from "../facebook-login";
import ReactGA from "react-ga";
import {Router, Link} from '../../../routes';
let SplitText = null;
import Cookies from "universal-cookie";
let host = null;

class Register extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      'name': '',
      'email': '',
      'password': '',
      errorOccurred: false,
      errorMessage: '',
      userWithEmailFailure: false
    };
  }

  componentDidMount () {
    host = window.location.protocol + '//' + window.location.host;
    SplitText = require('../../gsap/SplitText');
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(window.location.pathname);
    Register.init()
  }

  setInputState (field, e) {
    this.setState({
      [field]: e.target.value,
      errorOccurred: false,
      errorMessage: ''
    })
  }

  tryToSignUpUser () {
    if (!this.validateEmail()) {
      this.setState({
        errorOccurred: true,
        userWithEmailFailure: false,
        errorMessage: 'Please enter a valid email address.'
      })
    } else {
      if (this.state.name && this.state.email && this.state.password) {
        const data = JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name
        })
        $.ajax({
          type: 'POST',
          url: `https://api.quizop.com/users/signup`,
          data,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success: (response) => {
            this.setState({ errorMessage: '' });

            const userObject = {
              isAuthenticated: true,
              userObject: response
            };
            const cookies = new Cookies();
            cookies.set('userObject', userObject, { path: '/' });

            Router.pushRoute('/customize-experience');
          },
          error: (err) => {
            ReactGA.event({
              category: 'User',
              action: `error occured signing up user ${err}`
            });
            this.setState({ errorOccurred: false, userWithEmailFailure: true, errorMessage: '' });
          }
        })
      } else {
        this.setState({
          errorOccurred: true,
          userWithEmailFailure: false,
          errorMessage: 'Please make sure all fields are filled in.'
        })
      }
    }
  }

  validateEmail() {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email)
  }

  allowEnter (e) {
    if (e.key === 'Enter') {
      this.tryToSignUpUser()
    }
  }

  render () {
    return (
      <div id="register">
        <div className="register-form">
          <h1 className="register-form-header">Join BrainFlop</h1>
          { this.state.errorOccurred ? <p>{ this.state.errorMessage }</p> : null }
          { this.state.userWithEmailFailure ? <p>It looks like you already have an account <Link href='/login' style={{ color: '#4D88FF' }}><a>Login</a></Link></p> : null }
          <form>
            <input onKeyPress={this.allowEnter.bind(this)} onChange={this.setInputState.bind(this, 'name')} className="input-1" type="text" placeholder="Name" />

            <input onKeyPress={this.allowEnter.bind(this)} onChange={this.setInputState.bind(this, 'email')} className="input-2" type="email" placeholder="Email" />

            <input onKeyPress={this.allowEnter.bind(this)} onChange={this.setInputState.bind(this, 'password')} className="input-3" type="password" placeholder="Password" />

            <button className="register-button" onClick={this.tryToSignUpUser.bind(this)} type="button">SIGN UP</button>

            <FaceBookAuthentication />

            <p>Already have an account? <Link href='/login' >Login</Link></p>
            <p>By signing up you agree to the BrainFlop
               <span onClick={() => Router.pushRoute('/terms-and-conditions') }> Terms Of Service</span>
            </p>
          </form>
        </div>
      </div>
    )
  }

  static init () {
    const T1Split = new SplitText(
      '.register-form-header',
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

export default Register
