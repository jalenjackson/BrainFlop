import React from 'react';
import $ from 'jquery';
import TimelineMax from 'gsap/TimelineMax';
import TweenMax, {Power4} from 'gsap/TweenMaxBase';
import ReactGA from 'react-ga';
import './quiz.sass';
import Navbar from '../Navbar'
let quizId = null;
let SplitText = null;

export default class QuizShowPage extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      quizData: null,
      userThatCreateTheQuiz: null,
      questionLength: 0
    };
  }

  componentDidMount () {
    quizId = window.location.pathname.split('/')[3];
    SplitText = require('../../gsap/SplitText').SplitText;
    const host = window.location.protocol + '//' + window.location.host;
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/quiz/${quizId}`);
    $(window).scrollTop(0);

    fetch(`${host}/api/questions/get-quiz-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ quizId })
    })
    .then((response) => {
      response.json().then((body) => {
        this.setState({
          questionLength: body.questions.length
        })
      })
    }).catch((err) => {
      console.log(err)
    });

    fetch(`${host}/api/quizzes/${quizId}`, {
      method: 'GET'
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizData: body }, () => {
          fetch(`${host}/api/users/get-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ userId: this.state.quizData.quiz.userId })
          }).then((response) => {
            response.json().then((body) => {
              if (body.user) {
                this.setState({ userThatCreateTheQuiz: body.user })
              }
              const T1Split = new SplitText(
                  '.quiz-data h1',
                  {type: 'words'}
              );
              const T1Animation = new TimelineMax();
              TweenMax.set(
                  '#split',
                  {opacity: 1}
              );
              T1Animation.staggerFrom(
                  T1Split.words,
                  0.5,
                  {
                    y: 10,
                    opacity: 0,
                    ease: Power4.easeOut,
                    delay: 0.3
                  },
                  0.02, '+=0')
            })
          }).catch((err) => {
            console.log(err)
          })
        });
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  navigateToTagPage (tagName, history) {
    history.push(`/tags/${tagName}`)
  }

  renderQuizData () {
    if (this.state.quizData) {
      return (
          <div className="quiz-data">
            <h1>{this.state.quizData.quiz.title}</h1>
          </div>
      )
    }
  }

  redirect (location, history, quizData) {
    if (this.state.questionLength === 0) {
      alert(`${this.state.userThatCreateTheQuiz ? this.state.userThatCreateTheQuiz.name : ''} is still working on this quiz. Come back later when ${this.state.userThatCreateTheQuiz ? this.state.userThatCreateTheQuiz.name : ''} is finished.`)
    } else {
      if ((location === 'online' || location === 'invite') && !window.Auth.isAuthenticated) {
        $('.not-signed-in-container').css({opacity: 1, pointerEvents: 'auto'});
        return this.renderNotSignedInOnlineModal()
      }
      if (location === 'online') history.push(`/quizzes/traditional/${quizId}?quizTitle=${quizData.title}&quizDescription=${quizData.description}`)
      if (location === 'alone') history.push(`/quizzes/play/${quizId}?quizTitle=${quizData.title}&quizDescription=${quizData.description}`)
      if (location === 'invite') history.push(`/quizzes/traditional/${quizId}/${window.Auth.userObject.userId}?quizTitle=${quizData.title}&quizDescription=${quizData.description}`)
    }
  }

  closeNotSignedInOnlineModal () {
    $('.not-signed-in-container').css({ opacity: 0, pointerEvents: 'none' })
  }

  renderNotSignedInOnlineModal () {
    return (
        <div className="not-signed-in-container">
          <div className="card not-signed-in-online-modal">
            <img className="top-header-img" src='/static/images/icons/online-play.svg' />
            <h1>Join BrainFlop to play online with millions of other players!</h1>
            <img onClick={this.closeNotSignedInOnlineModal.bind(this)} className="close" src='/static/images/icons/close.png' />
            <button>SIGN UP</button>
          </div>
        </div>
    )
  }

  redirectToUserProfile (history) {
    history.push(`/profile/${this.state.userThatCreateTheQuiz._id}`)
  }

  render () {
    const renderQuizData = this.renderQuizData();
    const notSignedInOnlineModal = this.renderNotSignedInOnlineModal();

    return (
        <div id="quiz-show-page">
          <Navbar />
          {notSignedInOnlineModal}
          <div className="quiz-data-container">
            <img className="header-img" src={this.state.quizData ? this.state.quizData.quiz.quizImage : null} />
            {renderQuizData}
            { !this.state.quizData
                ?
                <div className='topic-loader'>
                  <img className="topic-header-img" src='/static/images/icons/loader.svg' />
                </div>
                :
                null
            }
          </div>
          <div className="card">
            <img src='/static/images/icons/piggybank.svg' />
            <h1 className="points-amount">Single Player</h1>
            <p className="online-count">Play single player and earn points</p>
            <button onClick={this.redirect.bind(this, 'alone', this.state.quizData ? this.state.quizData.quiz : null)}>Play Single Player</button>
          </div>
          <div className="card card2">
            <img src='/static/images/icons/invite-a-friend.svg' />
            <h1 className="points-amount">Play Against A Friend</h1>
            <p className="online-count">Invite a friend and go head to head!</p>
            <button onClick={this.redirect.bind(this, 'invite', this.state.quizData ? this.state.quizData.quiz : null)}>Play Against A Friend</button>
          </div>
          <div className="card card2">
            <img src='/static/images/icons/rocket-ship.svg' />
            <h1 className="points-amount">Online Multiplayer</h1>
            <p className="online-count">Play against someone random around the world</p>
            <button onClick={this.redirect.bind(this, 'online', this.state.quizData ? this.state.quizData.quiz : null)}>Play Online</button>
          </div>
          <div className="card">
            <img src='/static/images/icons/open-book.svg' />
            <h1>Details</h1>
            <h3 onClick={this.redirectToUserProfile.bind(this)}>
              Created by <span style={{ color: '#ec526d', cursor: 'pointer' }}>{this.state.userThatCreateTheQuiz ? this.state.userThatCreateTheQuiz.name : null}</span>
            </h3>
            <p>{ this.state.quizData ? this.state.quizData.quiz.description : null }</p>
          </div>
        </div>
    )
  }
}