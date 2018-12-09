import React, { Component } from 'react';
import {Power3, TweenMax} from "gsap/all";
import $ from 'jquery';
import { Router } from '../../../routes';
import ReactGA from "react-ga";
let host =  '';
import _ from 'lodash';
let category = null;

export default class CategoryComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      skipIterator: 0,
      tagsRendered: false
    };
    category = this.toTitleCase(this.props.router.query.slug.split('-').join(' '));
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
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/tags/general knowledge`);
    document.addEventListener('scroll', this.trackScrolling);
    fetch(`${host}/api/quizzes/quizzes-by-topic`, {
      method: 'POST',
      body: JSON.stringify({ topic: category, skipIterator: this.state.skipIterator }),
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
    await this.setState({ skipIterator: this.state.skipIterator + 9 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    fetch(`${host}/api/quizzes/quizzes-by-topic`, {
      method: 'POST',
      body: JSON.stringify({
        topic: category,
        skipIterator: this.state.skipIterator,
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
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
    }).catch((err) => {
      console.log(err)
    })
  }

  navigateToQuizPage (quizTitle, quizId, history, personalityResults) {
    if (personalityResults && personalityResults.length > 0) {
      $("html, body").animate({ scrollTop: 0 }, 350);
      return Router.pushRoute(`/quiz/${this.spinalCase(quizTitle)}/${quizId}`)
    }
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/quiz/${_.kebabCase(quizTitle)}/${quizId}`)
  }

  renderQuizzes() {
    if (this.state.quizzes.length > 0) {
      return this.state.quizzes.map((quiz) => (
          <div className="col">
            <div onClick={this.navigateToQuizPage.bind(this, quiz.title, quiz._id, history, quiz.personalityResults)} className="quiz-img" style={{ background: `url(${quiz.quizImage}) center center no-repeat`, backgroundSize: 'cover' }} />
            <div className="text-container">
              <h1 onClick={this.navigateToQuizPage.bind(this, quiz.title, quiz._id, history, quiz.personalityResults)}>{ quiz.title }</h1>
              <p>{ quiz.description }</p>
              <div className="tags">
                <p className="user-name">
                  { quiz.tags.split(',').map((tag) => (
                      <span onClick={this.navigateToQuizPage.bind(this, quiz.title, quiz._id, history, quiz.personalityResults)} className="span-color">{tag}</span>
                  )) }
                </p>
              </div>
            </div>
          </div>
      ))
    }
  }

  redirectToBuildQuizPage () {
    $("html, body").animate({ scrollTop: 0 }, 350);
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
        <div style={{ marginTop: '-20px' }} id="tags">
          <div className="topic-header">
            { this.state.quizzes.length > 0
                ?
                <div className="text-container">
                  <h1>{category}
                    <img src='/static/images/icons/underline.svg' />
                  </h1>
                  <p>All Of The Best {category} Quizzes</p>
                  <button onClick={this.redirectToBuildQuizPage.bind(this)}>Build Your Own Quiz</button>
                </div>
                :
                <div className='topic-loader' />
            }
          </div>
          <div id="quizzes">
            <h1 className="quizzes-header">All <span style={{ color: '#17CF86' }}>{category}</span> Quizzes</h1>
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
            <img src="/static/images/icons/rings.svg" />
          </div>
        </div>
    );
  }
}
