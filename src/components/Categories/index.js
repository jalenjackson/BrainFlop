import React, { Component } from 'react';
import {Power3, TweenMax} from "gsap/all";
import $ from 'jquery';
import { Router, Link } from '../../../routes.js'
import ReactGA from "react-ga";
import _ from 'lodash';
import pluralize from "pluralize";
require('es6-promise').polyfill();
require('isomorphic-fetch');

export default class TagPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      skipIterator: 0,
      tagsRendered: false
    };
  }

  componentDidMount() {
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview('/categories');
    document.addEventListener('scroll', this.trackScrolling);
    fetch(`https://api.quizop.com/tags?limit=9&skipAmount=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ tags: body.tags });
        setTimeout(() => {
          this.setState({ tagsRendered: true })
        }, 200)
      });
    }).catch((err) => {
      console.log(err)
    })
  }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  isBottom(el) {
    return $(window).scrollTop() > ($(document).height() / 2) - ($(window).height() / 2)
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("quizzes");
    if (this.isBottom(wrappedElement)) {
      this.fetchMoreQuizzes();
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };

  pluralizeTopic(topic) {
    return pluralize.isPlural(topic)
      ? pluralize.singular(topic)
      : topic;
  }

  async fetchMoreQuizzes() {
    await this.setState({ skipIterator: this.state.skipIterator + 9 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    fetch(`https://api.quizop.com/tags?limit=9&skipAmount=${this.state.skipIterator}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      response.json().then((body) => {
        let tmpArr = this.state.tags;
        tmpArr.push(...body.tags);
        document.addEventListener('scroll', this.trackScrolling);
        this.setState({ tags: tmpArr }, () => {
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
    if (this.state.tags.length > 0) {
      return this.state.tags.map((tag) => (
        <div className="col">
          <Link route={`/category/${_.kebabCase(tag.name)}`} >
            <a title={`${this.toTitleCase(this.pluralizeTopic(tag.name))} Quizzes`}>
              <div className="quiz-img all-tags-img">
                <div className="text-container">
                  <h1>{ this.toTitleCase(tag.name) }</h1>
                </div>
              </div>
            </a>
          </Link>
        </div>
      ))
    }
  }

  redirectToBuildQuizPage (history) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    history.push(`/create-quiz`)
  }

  renderContentLoader () {
    return (
      <main style={{ marginTop: '50px' }} className="page">
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
        <div id="quizzes">
          <h1 style={{ fontSize: '30px' }} className="quizzes-header all-tags-header">Explore Categories </h1>
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
