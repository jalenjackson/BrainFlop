import React, { Component } from 'react';
import {Power3, TweenMax} from "gsap/all";
import $ from 'jquery';
import pluralize from "pluralize";
import ReactGA from "react-ga";
import {Router, Link} from "../../../routes";
import _ from "lodash";

class PersonalityQuizzesComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quizzes: this.props.personalityQuizzes,
      skipIterator: 0,
    };
  }

  componentDidMount() {
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/personality-quizzes`);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
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
          <Link route={`/personality-quiz/${_.kebabCase(quiz.title)}/${quiz._id}`} >
            <a title={`${_.startCase(_.toLower((quiz.title)))} Game`}>
              <div className="quiz-img" style={{ background: `url(${quiz.quizImage}) center center no-repeat`, backgroundSize: 'cover' }} />
              <div className="text-container">
                <h1>{ quiz.title }</h1>
                <p style={{ color: 'rgb(90, 90, 95)' }}>{ quiz.description }</p>
                <Link route={`/category/${_.kebabCase(quiz.tags)}`}>
                  <a title={`${_.startCase(_.toLower(this.pluralizeTopic(quiz.tags)))} Quizzes`}>
                    <div className="tags">
                      <p style={{ marginTop: '10px', marginLeft: '6px' }} className="user-name">
                        { quiz.tags.split(',').map((tag) => (
                          <span className="span-color">{tag}</span>
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
              <Link route='/create-quiz'>
                <a title='Create Your Own Quiz'>
                  <button>Build your own quiz</button>
                </a>
              </Link>
            </div>
            :
            <div className='topic-loader' />
          }
        </div>
        <div id="quizzes">
          <h1 className="quizzes-header">All <span style={{ color: '#17CF86' }}>Personality</span> quizzes</h1>
          <div className='quizzes'>
            { quizzes }
          </div>
        </div>
        <div className="pagination-loader">
          <img src='/static/images/icons/rings.svg' />
        </div>
      </div>
    );
  }
}

export default PersonalityQuizzesComponent
