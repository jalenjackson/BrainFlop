import React from 'react'
import FacebookLogin from 'react-facebook-login'
import ReactGA from 'react-ga';
import Cookies from "universal-cookie";
import {Router} from "../../routes";

class FaceBookAuthentication extends React.Component {
  responseFacebook = (response) => {
    if (!cookies.get('userObject')) {
      if (response.hasOwnProperty('status')) {
        if (response.status === 'undefined' || response.status === undefined) {
          return
        }
      }
      fetch(`https://api.quizop.com/users/facebook`, {
        method: 'POST',
        body: JSON.stringify({
          email: response.email,
          name: response.name
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        }
      }).then((response) => {
        response.json().then((body) => {
          if (body) {
            const userObject = {
              isAuthenticated: true,
              userObject: body
            };

            const cookies = new Cookies();
            cookies.set('userObject', userObject, { path: '/' });

            ReactGA.event({
              category: 'User',
              action: `${body.name} used facebook login successfully`
            })
            if (this.props.redirect && this.props.redirect === 'createQuiz') {
              return Router.pushRoute('/create-quiz')
            }
            Router.pushRoute('/')
          } else {
            window.location.href = '/register'
          }
        })
      }).catch((err) => {
        ReactGA.event({
          category: 'User',
          action: `facebook login error occured ${err}`
        });
      })
    }
  };

  render () {
    let fbContent;

    fbContent = (
        <FacebookLogin
            appId="328619197927561"
            autoLoad={false}
            fields="name,email,picture"
            style={{ paddingBottom: '50px' }}
            textButton="Get Started With Facebook"
            callback={this.responseFacebook} />
    );

    return (
        <div>
          {fbContent}
        </div>
    )
  }
}

export default FaceBookAuthentication
