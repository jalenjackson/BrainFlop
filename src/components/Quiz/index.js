import React from 'react';
import $ from 'jquery';
import TimelineMax from 'gsap/TimelineMax';
import TweenMax, {Power4} from 'gsap/TweenMaxBase';
import ReactGA from 'react-ga';
import {Router, Link} from "../../../routes";
import Cookies from "universal-cookie";
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
    ReactGA.pageview(window.location.pathname);
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

  redirect (quizData, difficulty) {
    if (this.state.questionLength === 0) {
      alert(`${this.state.userThatCreateTheQuiz ? this.state.userThatCreateTheQuiz.name : ''} is still working on this quiz. Come back later when ${this.state.userThatCreateTheQuiz ? this.state.userThatCreateTheQuiz.name : ''} is finished.`)
    } else {
      $("html, body").animate({ scrollTop: 0 }, 350);
      const cookies = new Cookies();
      cookies.set('difficulty', difficulty, { path: '/' });
      Router.pushRoute(`/single-player/answer-choice/${_.kebabCase(quizData.title)}/${quizId}`);
    }
  }

  redirectToUserProfile (history) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/profile/${_.kebabCase(this.state.userThatCreateTheQuiz.name)}/${this.state.userThatCreateTheQuiz._id}`)
  }

  render () {
    const renderQuizData = this.renderQuizData();

    return (
        <div id="quiz-show-page">
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
          <div style={{ height: '350px' }} className="card">
            <img style={{ width: '110px' }} src='/static/images/icons/aeasy.svg' />
            <h3 onClick={() => {  $("html, body").animate({ scrollTop: $(document).height() }, "slow") }} style={{ position: 'absolute', cursor: 'pointer', left: '10px', top: '10px', fontSize: '12px', color: '#13A5FE', letterSpacing: '1px' }}>View Comments</h3>
            <div style={{ transform: 'translateY(-20px)' }}>
              <h1 className="points-amount">Easy Mode</h1>
              <p className="online-count">Earn 5 Points A Question</p>
              <button onClick={this.redirect.bind(this, this.state.quizData ? this.state.quizData.quiz : null, 'easy')}>Play Easy</button>
            </div>
          </div>
          <div className="card card2">
            <img src='/static/images/icons/invite-a-friend.svg' />
            <h1 className="points-amount">Medium Mode</h1>
            <p className="online-count">Earn 10 Points A Question</p>
            <button onClick={this.redirect.bind(this, this.state.quizData ? this.state.quizData.quiz : null, 'medium')}>Play Medium</button>
          </div>
          <div className="card card2">
            <img src='/static/images/icons/ahard.svg' />
            <h1 className="points-amount">Hard Mode</h1>
            <p className="online-count">Earn 20 Points A Question</p>
            <button onClick={this.redirect.bind(this, this.state.quizData ? this.state.quizData.quiz : null, 'hard')}>Play Hard</button>
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
