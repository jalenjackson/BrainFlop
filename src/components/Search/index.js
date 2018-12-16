import React, { Component } from 'react';
import {Power3, Power4, TweenMax} from "gsap/all";
import $ from 'jquery';
import TimelineMax from "gsap/TimelineMax";
import ReactGA from "react-ga";
import {Router, Link} from '../../../routes.js'
let SplitText = null
import _ from 'lodash';
import pluralize from "pluralize";
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
  }

  componentDidMount() {
    SplitText = require('../../gsap/SplitText');
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(window.location.pathname);
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

    fetch(`https://api.quizop.com/search/quizzes?term=${searchTerm}&skipIterator=${this.state.skipIterator}`, {
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
    fetch(`https://api.quizop.com/search/quizzes?term=${searchTerm}&skipIterator=${this.state.skipIterator}`, {
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

  pluralizeTopic(topic) {
    return pluralize.isPlural(topic)
      ? pluralize.singular(topic)
      : topic;
  }

  renderQuizzes() {
    if (this.state.quizzes.length > 0) {
      return this.state.quizzes.map((quiz) => (
        <div className="col">
          <Link route={quiz.personalityResults && quiz.personalityResults.length > 0 ? `/personality-quiz/${_.kebabCase(quiz.title)}/${quiz._id}` : `/quiz/${_.kebabCase(quiz.title)}/${quiz._id}` } >
            <a title={`${_.startCase(_.toLower((quiz.title)))} Game`}>
              <div className="quiz-img" style={{ background: `url(${quiz.quizImage}) center center no-repeat`, backgroundSize: 'cover' }} />
              <div className="text-container">
                <h1>{ quiz.title }</h1>
                <p style={{ color: 'rgb(90, 90, 95)' }}>{ quiz.description }</p>
                <Link route={`/category/${_.kebabCase(quiz.tags)}`}>
                  <a title={`${_.startCase(_.toLower(this.pluralizeTopic(quiz.tags)))} Quizzes`}>
                    <div className="tags">
                      <p style={{ marginTop: '10px', marginLeft: '6px' }} className="user-name">
                        <span className="span-color">{quiz.tags}</span>
                      </p>
                    </div>
                  </a>
                </Link>
              </div>
            </a>
          </Link>
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
                  All <span style={{ color: '#17CF86' }}>{_.startCase(_.toLower((searchTerm)))}</span> quizzes
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
