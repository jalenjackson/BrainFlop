import React from 'react'
import FacebookLogin from 'react-facebook-login'
import ReactGA from 'react-ga';

class FaceBookAuthentication extends React.Component {
  responseFacebook = (response) => {
    console.log(response)
    if (!localStorage.getItem('Token')) {
      if (response.hasOwnProperty('status')) {
        if (response.status === 'undefined' || response.status === undefined) {
          return
        }
      }
      fetch(`${QuizOpDomain.host}/users/facebook`, {
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
          console.log(body)
          if (body) {
            this.props.loginUser(body);
            ReactGA.event({
              category: 'User',
              action: `${body.name} used facebook login successfully`
            })
            if (this.props.redirect && this.props.redirect === 'createQuiz') {
              return this.props.history.push('/create-quiz')
            }
            this.props.history.push('/explore')
          } else {
            window.location.href = '/login'
          }
        })
      }).catch((err) => {
        ReactGA.event({
          category: 'User',
          action: `facebook login error occured ${err}`
        })
        console.log(err)
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
