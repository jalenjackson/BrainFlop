import React, { Component } from 'react';
import {Power3, TweenMax} from "gsap/all";
import $ from 'jquery';
import ReactGA from "react-ga";
import {verifyFrontEndAuthentication} from "../verifyFrontEndAuthentication";
import {Router} from "../../../routes";
import _ from "lodash";
let userData = {};
let host = null;

class PersonalityQuizzesComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      skipIterator: 0,
      tagsRendered: false
    };
    userData = verifyFrontEndAuthentication(this.props.userObject, this.props.isAuthenticated);
  }

  componentDidMount() {
    host = window.location.protocol + '//' + window.location.host;
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/personality-quizzes`);
    document.addEventListener('scroll', this.trackScrolling);
    fetch(`${host}/api/quizzes/personality-quizzes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizzes: body.quizzes });
        setTimeout(() => {
          this.setState({ tagsRendered: true })
        }, 200)
      });
    }).catch((err) => {
      console.log(err)
    })
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
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

  async fetchMoreQuizzes() {
    await this.setState({ skipIterator: this.state.skipIterator + 8 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    fetch(`${host}/api/quizzes/quizzes-by-topic`, {
      method: 'POST',
      body: JSON.stringify({
        topic: this.props.router.query.tagName,
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
        });
      });
    }).catch(() => {
      window.location.href = '/error'
    })
  }

  navigateToTagPage (tagName) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    history.push(`/category/${tagName}`)
  }

  navigateToQuizPage (quizTitle, quizId) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/personality-quiz/${_.kebabCase(quizTitle)}/${quizId}`)
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

  redirectToBuildQuizPage () {
    Router.pushRoute(`/create-quiz`)
  }

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

  render() {

    const quizzes = this.renderQuizzes();
    const contentLoader = this.renderContentLoader();

    return (
      <div id="tags">
        <div style={{ background: `url(${'/static/images/background-images/stars.svg'}) center center no-repeat`, backgroundSize: 'cover' }} className="topic-header">
          { this.state.quizzes.length > 0
            ?
            <div className="text-container">
              <h1>Personality Quizzes
                <img src='/static/images/icons/underline.svg' />
              </h1>
              <p>All of the best personality quizzes</p>
              <button onClick={this.redirectToBuildQuizPage.bind(this)}>Build your own quiz</button>
            </div>
            :
            <div className='topic-loader' />
          }
        </div>
        <div id="quizzes">
          <h1 className="quizzes-header">All <span style={{ color: '#17CF86' }}>Personality</span> quizzes</h1>
          {
            this.state.tagsRendered ?
              <div className='quizzes'>
                { quizzes }
              </div>
              :
              contentLoader
          }
        </div>
        <div className="pagination-loader">
          <img src='/static/images/icons/rings.svg' />
        </div>
      </div>
    );
  }
}

export default PersonalityQuizzesComponent
