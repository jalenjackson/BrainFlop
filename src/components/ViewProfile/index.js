import React from 'react'
import ReactChartkick, {PieChart} from 'react-chartkick'
import Chart from 'chart.js'
import $ from 'jquery'
import {Router} from '../../../routes.js'
import TweenMax, {Power3} from "gsap/TweenMaxBase";
import ReactGA from "react-ga";
import _ from 'lodash';
import {verifyFrontEndAuthentication} from "../verifyFrontEndAuthentication";
let host = null;
let userData = {};

ReactChartkick.addAdapter(Chart);

export default class ViewProfileComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userTitle: '',
      percentageOfQuestionsCorrect: null,
      quizzes: [],
      skipIterator: 0,
      contentRendered: false,
      percentageOfQuestionsCorrectMessage: '',
      editErrorMessage: '',
      user: {}
    };
    userData = verifyFrontEndAuthentication(this.props.userObject, this.props.isAuthenticated);
  }

  componentDidMount () {
    host = window.location.protocol + '//' + window.location.host;
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/profile/${this.props.router.query.id}`);
    $('body').css({ background: 'rgb(255,245,245)' });
    $(window).scrollTop(0)
    document.addEventListener('scroll', this.trackScrolling);

    fetch(`${host}/api/users/get-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ userId: this.props.router.query.id })
    }).then((response) => {
      response.json().then((body) => {
        if (body.user) {
          this.setState({ user: body.user })
        }
      })
    }).catch((err) => {
      console.log(err);
    });

    fetch(`${host}/api/quizzes/user-quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ userId: this.props.router.query.id, skipIterator: this.state.skipIterator })
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizzes: body.quizzes }, () => {
          setTimeout(() => {
            this.setState({ contentRendered: true })
          }, 200)
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  componentWillUnmount () {
    $('body').css({ background: 'white' });
    document.removeEventListener('scroll', this.trackScrolling);
  }

  navigateToQuizPage (quizName, quizId) {
    $(window).scrollTop(0);
    Router.pushRoute(`/quiz/${_.kebabCase(quizName)}/${quizId}`);
  }

  navigateToTagPage (tagName) {
    $(window).scrollTop(0);
    history.push(`/category/${_.kebabCase(tagName)}`)
  }

  async fetchMoreQuizzes() {
    await this.setState({ skipIterator: this.state.skipIterator + 8 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    fetch(`${host}/api/quizzes/user-quizzes`, {
      method: 'POST',
      body: JSON.stringify({
        userId: this.props.router.query.id,
        skipIterator: this.state.skipIterator,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${userData.userObject.token}`,
      },
    }).then((response) => {
      response.json().then((body) => {
        let tmpArr = this.state.quizzes;
        tmpArr.push(...body.quizzes);
        document.addEventListener('scroll', this.trackScrolling);
        this.setState({ quizzes: tmpArr }, () => {
          setTimeout(() => {
            TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 200%, 0)', ease: Power3.easeOut });
          }, 550)
        })

      });
    }).catch((err) => {
      console.log(err)
    })
  }

  renderQuizzes() {
    if (this.state.quizzes.length > 0) {
      return this.state.quizzes.map((quiz) => (
        <div className="col">
          <div onClick={this.navigateToQuizPage.bind(this, quiz.title, quiz._id)} className="quiz-img" style={{ background: `url(${quiz.quizImage}) center center no-repeat`, backgroundSize: 'cover' }} />
          <div className="text-container">
            <h1 onClick={this.navigateToQuizPage.bind(this, quiz.title, quiz._id)}>{ quiz.title }</h1>
            <p>{ quiz.description }</p>
            <div className="tags">
              <p className="user-name">
                { quiz.tags.split(',').map((tag) => (
                  <span onClick={this.navigateToTagPage.bind(this, tag)} className="span-color">{tag}</span>
                )) }
              </p>
            </div>
          </div>
        </div>
      ))
    }
  }

  isBottom(el) {
    return $(window).scrollTop() == ($(document).height() - $(window).height())
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("quizzes");
    if (this.isBottom(wrappedElement)) {
      this.fetchMoreQuizzes();
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };

  renderContentLoader () {
    return (
      <main className="page">
        <div className="page-content">
          <div className="placeholder-content">
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
            <div className="placeholder-content_item"></div>
          </div>
        </div>
      </main>
    )
  }

  render () {

    const quizzes = this.renderQuizzes();
    const contentLoader = this.renderContentLoader();

    return (
      <div className="profile-container">
        <div id="profile">
          <div style={{ height: '40vh' }} className="top-header">
            <div style={{ position: 'relative' }}  className="text-container">
              <h1 style={{ marginTop: '0%' }}>{this.state.user ? this.state.user.name : null}</h1>
            </div>
          </div>
          <div className="card">
            {
              this.state.contentRendered ?
                <div>
                  <img src='/static/images/icons/lightning.svg' />
                  <h1>{this.state.user ? this.state.user.points : ''} points</h1>
                  <img className="underline" src='/static/images/icons/underline.svg' />
                </div>
                :
                contentLoader
            }
          </div>
          <div className="card">
            {
              this.state.contentRendered ?
                <div>
                  <h1>{this.state.user ? this.state.user.name : ''}'s Right To Wrong Ratio</h1>
                  <PieChart colors={["#2FDC7F", "rgb(246,92,119)"]} donut={true} width="150" height="200px" data={[["Questions Answered Correctly", this.state.user ? this.state.user.overallScore.split('/')[0] : 0], ["Questions Answered Wrong", Number(this.state.user ? this.state.user.overallScore.split('/')[1] : 0) - Number(this.state.user ? this.state.user.overallScore.split('/')[0] : 0) ]]} />
                  <h1>{this.state.percentageOfQuestionsCorrectMessage}</h1>
                </div>
                :
                contentLoader
            }
          </div>
          <div className="card">
            {
              this.state.contentRendered ?
                <div>
                  <h1>{this.state.user ? this.state.user.name : ''}'s <span style={{ color: '#ec526d', fontFamily: 'QuizOpFont, sans-serif' }}>FLAWLESS</span> score is {this.state.user ? this.state.user.numberOfPerfectScores : null}</h1>
                  <p style={{ width: '80%', display: 'inline-block' }}>The <span style={{ color: '#ec526d', fontFamily: 'QuizOpFont, sans-serif' }}>FLAWLESS</span> score represents the amount of times {this.state.user ? this.state.user.name : null} scored a perfect score on a quiz</p>
                </div>
                :
                contentLoader
            }
          </div>
        </div>
        {
          this.state.quizzes.length > 0
            ?
            <div className="card">
              <div id="quizzes">
                <h3>All of {this.state.user ? this.state.user.name : ''}'s quizzes</h3>
                <div className='quizzes'>
                  { quizzes }
                </div>
              </div>
            </div>
            :
            null
        }
        <div className="pagination-loader">
          <img src='/static/images/icons/rings.svg' />
        </div>
      </div>
    )
  }

  chart () {

  }
}
