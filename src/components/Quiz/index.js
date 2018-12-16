import React from 'react';
import $ from 'jquery';
import TimelineMax from 'gsap/TimelineMax';
import TweenMax, {Power4} from 'gsap/TweenMaxBase';
import ReactGA from 'react-ga';
import {Router, Link} from "../../../routes";
let quizId = null;
let SplitText = null;

export default class QuizShowPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      quizData: this.props.quizData,
      userThatCreateTheQuiz: this.props.quizData.user,
      questionLength: this.props.quizData.quizQuestionsLength
    };
  }

  componentDidMount () {
    $(".fb-comments").attr("data-href", window.location.href);
    quizId = window.location.pathname.split('/')[3];
    SplitText = require('../../gsap/SplitText');
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/quiz/${quizId}`);
    $(window).scrollTop(0);

    fetch(`https://api.quizop.com/questions/get-quiz-questions`, {
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

    fetch(`https://api.quizop.com/quizzes/${quizId}`, {
      method: 'GET'
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizData: body }, () => {
          fetch(`https://api.quizop.com/users/get-user`, {
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

  renderQuizData () {
    if (this.state.quizData) {
      return (
          <div className="quiz-data">
            <h1>{this.state.quizData.quiz.title}</h1>
          </div>
      )
    }
  }

  redirect (location, quizData) {
    if (this.state.questionLength === 0) {
      alert(`${this.state.userThatCreateTheQuiz ? this.state.userThatCreateTheQuiz.name : ''} is still working on this quiz. Come back later when ${this.state.userThatCreateTheQuiz ? this.state.userThatCreateTheQuiz.name : ''} is finished.`)
    } else {
      if ((location === 'online' || location === 'invite') && !this.props.isAuthenticated) {
        $('.not-signed-in-container').css({opacity: 1, pointerEvents: 'auto'});
        return this.renderNotSignedInOnlineModal()
      }
      $("html, body").animate({ scrollTop: 0 }, 350);
      if (location === 'online') Router.pushRoute(`/online/answer-choice/${_.kebabCase(quizData.title)}/${quizData._id}`);
      if (location === 'alone') Router.pushRoute(`/single-player/answer-choice/${_.kebabCase(quizData.title)}/${quizId}`);
      if (location === 'invite') Router.pushRoute(`/invite-friend/answer-choice/${_.kebabCase(quizData.title)}/${quizId}/${this.props.userObject.userId}`);
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
            <button onClick={() => { Router.pushRoute('/register') }}>SIGN UP</button>
          </div>
        </div>
    )
  }

  redirectToUserProfile (history) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/profile/${_.kebabCase(this.state.userThatCreateTheQuiz.name)}/${this.state.userThatCreateTheQuiz._id}`)
  }

  render () {
    const renderQuizData = this.renderQuizData();
    const notSignedInOnlineModal = this.renderNotSignedInOnlineModal();

    return (
        <div id="quiz-show-page">
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
            <h3 onClick={() => {  $("html, body").animate({ scrollTop: $(document).height() }, "slow") }} style={{ position: 'absolute', cursor: 'pointer', left: '10px', top: '10px', fontSize: '12px', color: '#13A5FE', letterSpacing: '1px' }}>View Comments</h3>
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
          <div className="fb-comments" data-href={this.props.router.asPath} data-width="470" data-num-posts="10"></div>
        </div>
    )
  }
}