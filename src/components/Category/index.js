import React, { Component } from 'react';
import {Power3, TweenMax} from "gsap/all";
import $ from 'jquery';
import { Router, Link } from '../../../routes';
import ReactGA from "react-ga";
import _ from 'lodash';
let category = null;
require('es6-promise').polyfill();
require('isomorphic-fetch');

export default class CategoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizzes: [],
      skipIterator: 0,
      tagsRendered: false
    };
    category = _.startCase(_.toLower((this.props.router.query.slug.split('-').join(' '))));
  }

  componentDidMount() {
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(this.props.router.asPath);
    document.addEventListener('scroll', this.trackScrolling);
    fetch(`https://api.quizop.com/quizzes/quizzes-by-topic`, {
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
    fetch(`https://api.quizop.com/quizzes/quizzes-by-topic`, {
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

  renderQuizzes() {
    if (this.state.quizzes.length > 0) {
      return this.state.quizzes.map((quiz) => (
          <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} style={{ cursor: 'pointer' }} className="col">
            <Link route={quiz.personalityResults && quiz.personalityResults.length > 0 ? `/personality-quiz/${_.kebabCase(quiz.title)}/${quiz._id}` : `/quiz/${_.kebabCase(quiz.title)}/${quiz._id}` } >
              <a title={`${_.startCase(_.toLower((quiz.title)))} Game`}>
                <div className="quiz-img" style={{ background: `url(${quiz.quizImage}) center center no-repeat`, backgroundSize: 'cover' }} />
                <div className="text-container">
                  <h1>{ quiz.title }</h1>
                  <p style={{ color: 'rgb(90, 90, 90)', letterSpacing: '.5px' }}>{ quiz.description }</p>
                  <div className="tags">
                    <p style={{ marginTop: '10px', marginLeft: '6px' }} className="user-name">
                      { quiz.tags.split(',').map((tag) => (
                        <span className="span-color">{tag}</span>
                      )) }
                    </p>
                  </div>
                </div>
              </a>
            </Link>
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
                  <p>All Of The Best {_.startCase(_.toLower(this.props.topic))} Quizzes</p>
                  <Link route={`/create-quiz`}>
                    <a title='Create Your Own Quiz'>
                      <button onClick={this.redirectToBuildQuizPage.bind(this)}>Create Your Own Quiz</button>
                    </a>
                  </Link>
                </div>
                :
                <div className='topic-loader' />
            }
          </div>
          <div id="quizzes">
            <h1 className="quizzes-header">All <span style={{ color: '#17CF86' }}>{_.startCase(_.toLower(this.props.topic))}</span> Quizzes</h1>
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
