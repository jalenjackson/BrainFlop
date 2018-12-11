import React, { Component } from 'react';
import {Power3, TweenMax} from "gsap/all";
import $ from 'jquery';
import ReactGA from "react-ga";
import {Router, Link} from "../../../routes";
import pluralize from "pluralize";
import _ from "lodash";
require('es6-promise').polyfill();
require('isomorphic-fetch');

export default class FeaturedComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      skipIterator: 0,
      tagsRendered: false
    };
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
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview('/featured');
    document.addEventListener('scroll', this.trackScrolling);
    fetch(`https://api.quizop.com/quizzes/featured?limit=9&skip=${this.state.skipIterator}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizzes: body.quizzes, tagsRendered: true })
      })
    }).catch(() => {
      window.location.href = '/error'
    })
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  isBottom() {
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
    fetch(`https://api.quizop.com/quizzes/featured?limit=9&skip=${this.state.skipIterator}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
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
    Router.pushRoute(`/category/${tagName}`)
  }

  navigateToQuizPage (quizTitle, quizId) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/quiz/${_.kebabCase(quizTitle)}/${quizId}`)
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
              <div onClick={this.navigateToQuizPage.bind(this, quiz.title, quiz._id)} className="quiz-img" style={{ background: `url(${quiz.quizImage}) center center no-repeat`, backgroundSize: 'cover' }} />
              <div className="text-container">
                <h1 onClick={this.navigateToQuizPage.bind(this, quiz.title, quiz._id)}>{ quiz.title }</h1>
                <p style={{ color: 'rgb(90, 90, 95)' }}>{ quiz.description }</p>
                <Link route={`/category/${_.kebabCase(quiz.tags)}`}>
                  <a title={`${_.startCase(_.toLower(this.pluralizeTopic(quiz.tags)))} Quizzes`}>
                    <div className="tags">
                      <p style={{ marginTop: '10px', marginLeft: '6px' }} className="user-name">
                        { quiz.tags.split(',').map((tag) => (
                          <span onClick={this.navigateToTagPage.bind(this, tag)} className="span-color">{tag}</span>
                        )) }
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
    Router.pushRoute('/create-quiz')
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
        <div className="topic-header">
          <div className="text-container">
            <h1>Featured
              <img src='/static/images/icons/underline.svg' />
            </h1>
            <p>Most Popular quizzes</p>
            <button onClick={this.redirectToBuildQuizPage.bind(this)}>Build your own quiz</button>
          </div>
        </div>
        <div id="quizzes">
          <h1 className="quizzes-header">Featured quizzes</h1>
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
