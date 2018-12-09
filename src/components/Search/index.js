import React, { Component } from 'react';
import {Power3, Power4, TweenMax} from "gsap/all";
import $ from 'jquery';
import TimelineMax from "gsap/TimelineMax";
import ReactGA from "react-ga";
import {verifyFrontEndAuthentication} from "../verifyFrontEndAuthentication";
let userData = {};
import {Router} from '../../../routes.js'
let host = null;
let searchTerm = null;

export default class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      skipIterator: 0,
      tagsRendered: false
    };
    searchTerm = this.props.router.query.searchQuery.split('-').join(' ');
    userData = verifyFrontEndAuthentication(this.props.userObject, this.props.isAuthenticated);
  }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  componentDidMount() {
    host = window.location.protocol + '//' + window.location.host;
    SplitText = require('../../gsap/SplitText').SplitText;
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/search/${this.props.router.query.searchQuery}`);
    $(window).scrollTop(0)
    document.addEventListener('scroll', this.trackScrolling);

    const T1Split = new SplitText(
      '.topic-header h1',
      {type: 'words'}
    )
    const T1Animation = new TimelineMax()
    TweenMax.set(
      '#split',
      {opacity: 1}
    )
    T1Animation.staggerFrom(
      T1Split.words,
      0.2,
      {
        y: 10,
        opacity: 0,
        ease: Power4.easeOut,
        delay: 0.3
      },
      0.02, '+=0')

    fetch(`${host}/api/search/quizzes?term=${searchTerm}&skipIterator=${this.state.skipIterator}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({
          quizzes: body.quizzesFound,
          tagsRendered: true
        })
      })
    }).catch(() => {
      window.location.href = '/error'
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
    await this.setState({ skipIterator: this.state.skipIterator + 9 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    fetch(`${host}/api/search/quizzes?term=${searchTerm}&skipIterator=${this.state.skipIterator}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      response.json().then((body) => {
        let tmpArr = this.state.quizzes;
        tmpArr.push(...body.quizzesFound);
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
    Router.pushRoute(`/category/${_.kebabCase(tagName)}`);
  }

  navigateToQuizPage (quizTitle, quizId) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/quiz/${_.kebabCase(quizTitle)}/${quizId}`);
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
        <div style={{ background: '#ec526d', display: 'block', overflow: 'hidden' }} className="topic-header">

          { this.state.quizzes.length > 0 ?
            <div style={{ background: `url(${this.state.quizzes[0].quizImage}) center center no-repeat`, backgroundSize: 'cover', filter: 'blur(35px)', transform: 'scale(1.2)'}} className="search-header" />
            :
            null
          }

          <div className="text-container">
            <h1 style={{ color: 'white', paddingTop: '150px' }}>{searchTerm}</h1>
            <button onClick={this.redirectToBuildQuizPage.bind(this)}>Build Your Own Quiz</button>
          </div>
        </div>
        <div id="quizzes">
          {
            this.state.quizzes.length > 0 ?
              <div>
                <h1 className="quizzes-header">
                  All <span style={{ color: '#17CF86' }}>{this.toTitleCase(searchTerm)}</span> quizzes
                </h1>
              </div>
              :
              <div>
                <h1 className="quizzes-header">
                  No <span style={{ color: '#17CF86' }}>{searchTerm}</span> quizzes found
                </h1>
              </div>
          }

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
