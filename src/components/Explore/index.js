import React from 'react';
import './explore.sass';
import $ from 'jquery';
import _ from 'lodash';
import ReactGA from "react-ga";
import pluralize from "pluralize";
import { Router, Link } from '../../../routes';
require('es6-promise').polyfill();
require('isomorphic-fetch');

class Explore extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      'topic1Quizzes': [],
      'topic2Quizzes': [],
      'topic3Quizzes': [],
      'topic4Quizzes': [],
      'topic5Quizzes': [],
      featuredQuizzes: [],
      topTags: [],
      previousUserTags: [],
      skipIterator: 0,
      hideContentLoader: false,
      personalityQuizzes: [],
    };
  }


  async componentDidMount () {
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview('/explore');

    fetch(`https://api.quizop.com/quizzes/featured?limit=5&skip=0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ featuredQuizzes: body.quizzes })
      })
    }).catch((err) => {
      console.log(err);
    });

    fetch(`https://api.quizop.com/quizzes/personality-quizzes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ personalityQuizzes: body.quizzes });
      })
    }).catch((err) => {
      console.log(err);
    });

    fetch(`https://api.quizop.com/tags?limit=8&skipAmount=0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({
          topTags: body.tags
        }, () => {
          const shouldFetchUsersCustomizedExperience =
            this.props.isAuthenticated &&
            this.props.userObject.customizedTags !== 'none';
          this.setState({
            previousUserTags: shouldFetchUsersCustomizedExperience
              ? this.props.userObject.customizedTags.split(',')
              : this.state.topTags.slice(0, 5)
          }, () => {
            for (let i = 0; i < this.state.previousUserTags.length; i++) {
              let stateKey = `topic${i + 1}Quizzes`;
              fetch(`https://api.quizop.com/quizzes/quizzes-by-topic`, {
                method: 'POST',
                body: JSON.stringify({ topic: shouldFetchUsersCustomizedExperience
                    ? this.state.previousUserTags[i]
                    : this.state.previousUserTags[i].name
                }),
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
              }).then((response) => {
                response.json().then((body) => {
                  this.setState({ [stateKey]: body.quizzes, hideContentLoader: true });
                  $('.see-all-links').css({ display: 'flex' });
                })
              }).catch((err) => {
                console.log(err);
              })
            }
          })
        })
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  renderTopicSection (quizI, section) {
    if (this.state[section].length >= 4) {
      return (
        <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className={`col large-one ${section}`}>
          <Link route={!this.state[section][quizI].personalityResults || this.state[section][quizI].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state[section][quizI].title)}/${this.state[section][quizI]._id}` : `/personality-quiz/${_.kebabCase(this.state[section][quizI].title)}/${this.state[section][quizI]._id}`} >
            <a title={`${_.startCase(_.toLower((this.state[section][quizI].title)))} Game`}>
              <div style={{ background: `url(${this.state[section][quizI].quizImage}) center center no-repeat`, backgroundSize: 'cover' }} className="large-img" />
              <div className="text-container">
                <div className="text-container">
                  <h1 onClick={this.redirectToShowQuizPage.bind(this, this.state[section][quizI].personalityResults, this.state[section][quizI].title, this.state[section][quizI]._id)}>{ this.state[section][quizI].title }</h1>
                  <p style={{ color: 'rgb(90, 90, 95)' }}>{ this.state[section][quizI].description }</p>
                  <Link route={`/category/${_.kebabCase(this.state[section][quizI].tags)}`}>
                    <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state[section][quizI].tags))))} Quizzes`}>
                      <div className="tags">
                        <p className="user-name">
                          {this.state[section][quizI].tags.split(',').map((tag, i) => {
                            return (
                              <span onClick={this.routeToTagPage.bind(this, tag)} key={i} className="span-color">{tag}</span>
                            )
                          })}
                        </p>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </a>
          </Link>
        </div>
      )
    }
  }

  renderTopicSmallSection (quizI, section) {
    if (this.state[section].length >= 4) {
      return (
        <div>
          <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className="item">
            <Link route={!this.state[section][quizI].personalityResults || this.state[section][quizI].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state[section][quizI].title)}/${this.state[section][quizI]._id}` : `/personality-quiz/${_.kebabCase(this.state[section][quizI].title)}/${this.state[section][quizI]._id}`} >
              <a title={`${_.startCase(_.toLower((this.state[section][quizI].title)))} Game`}>
                <div style={{background: `url(${ this.state[section][quizI].quizImage}) center center no-repeat`, backgroundSize: 'cover'}} className="side-img"/>
                <div className="text-container">
                  <h1 onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI].personalityResults, this.state[section][quizI].title, this.state[section][quizI]._id)}>{this.state[section][quizI].title}</h1>
                  <p style={{ color: 'rgb(90, 90, 95)' }}>{this.state[section][quizI].description}</p>
                  <Link route={`/category/${_.kebabCase(this.state[section][quizI].tags)}`}>
                    <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state[section][quizI].tags))))} Quizzes`}>
                      <div className="tags">
                        <span onClick={ this.routeToTagPage.bind(this, this.state[section][quizI].tags.split(',')[0])} className="span-color">{this.state[section][quizI].tags.split(',')[0]}</span>
                      </div>
                    </a>
                  </Link>
                </div>
              </a>
            </Link>
          </div>
          <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className="item">
            <Link route={!this.state[section][quizI + 1].personalityResults || this.state[section][quizI + 1].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state[section][quizI + 1].title)}/${this.state[section][quizI + 1]._id}` : `/personality-quiz/${_.kebabCase(this.state[section][quizI + 1].title)}/${this.state[section][quizI + 1]._id}`} >
              <a title={`${_.startCase(_.toLower((this.state[section][quizI + 1].title)))} Game`}>
                <div onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 1].personalityResults, this.state[section][quizI + 1].title, this.state[section][quizI + 1]._id)} style={{ background: `url(${this.state[section][quizI + 1].quizImage}) center center no-repeat`, backgroundSize: 'cover' }} className="side-img" />
                <div className="text-container">
                  <h1 onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 1].personalityResults, this.state[section][quizI + 1].title, this.state[section][quizI + 1]._id )}>{this.state[section][quizI + 1].title}</h1>
                  <p style={{ color: 'rgb(90, 90, 95)' }}>{this.state[section][quizI + 1].description}</p>
                  <Link route={`/category/${_.kebabCase(this.state[section][quizI + 1].tags)}`}>
                    <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state[section][quizI + 1].tags))))} Quizzes`}>
                      <div className="tags">
                        <span onClick={ this.routeToTagPage.bind(this, this.state[section][quizI + 1].tags.split(',')[0] )} className="span-color">{this.state[section][quizI + 1].tags.split(',')[0]}</span>
                      </div>
                    </a>
                  </Link>
                </div>
              </a>
            </Link>

          </div>
          <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className="item">
            <Link route={!this.state[section][quizI + 2].personalityResults || this.state[section][quizI + 2].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state[section][quizI + 2].title)}/${this.state[section][quizI + 2]._id}` : `/personality-quiz/${_.kebabCase(this.state[section][quizI + 2].title)}/${this.state[section][quizI + 2]._id}`} >
              <a title={`${_.startCase(_.toLower((this.state[section][quizI + 2].title)))} Game`}>
                <div onClick={this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 2].personalityResults, this.state[section][quizI + 2].title, this.state[section][quizI + 2]._id )} style={{background: `url(${this.state[section][quizI + 2].quizImage}) center center no-repeat`, backgroundSize: 'cover' }} className="side-img"/>
                <div className="text-container">
                  <h1 onClick={this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 2].personalityResults, this.state[section][quizI + 2].title, this.state[section][quizI + 2]._id )}>{this.state[section][quizI + 2].title}</h1>
                  <p style={{ color: 'rgb(90, 90, 95)' }}>{this.state[section][quizI + 2].description}</p>
                  <Link route={`/category/${_.kebabCase(this.state[section][quizI + 2].tags)}`}>
                    <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state[section][quizI + 2].tags))))} Quizzes`}>
                      <div className="tags">
                        <span onClick={this.routeToTagPage.bind(this, this.state[section][quizI + 2].tags.split(',')[0])} className="span-color">{this.state[section][quizI + 2].tags.split(',')[0]}</span>
                      </div>
                    </a>
                  </Link>
                </div>
              </a>
            </Link>
          </div>
        </div>
      );
    }
  }

  redirectToShowQuizPage (personalityResults, quizTitle, quizId) {
    if (!personalityResults || personalityResults.length === 0) {
      $("html, body").animate({ scrollTop: 0 }, 350);
      Router.pushRoute(`/quiz/${_.kebabCase(quizTitle)}/${quizId}`)
    } else {
      $("html, body").animate({ scrollTop: 0 }, 350);
      Router.pushRoute(`/personality-quiz/${_.kebabCase(quizTitle)}/${quizId}`)
    }
  }

  routeToTagPage (tagName) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/category/${_.kebabCase(tagName)}`)
  }

  renderTopTags () {
    if (this.state.topTags.length > 0) {
      return this.state.topTags.map(tag => (
        <Link route={`/category/${_.kebabCase(tag.name)}`}>
          <a title={`${_.startCase(_.toLower((this.pluralizeTopic(tag.name))))} Quizzes`}>
            <p key={tag._id}>{ tag.name }</p>
          </a>
        </Link>
      ))
    }
  }

  renderSignUpCTA () {
    return (
      <div>
        <div className="sign-up-cta">
          <h1>
            Welcome to BrainFlop
            <img alt='underline' src="/static/images/icons/underline.svg" />
          </h1>
          <p>We offer the best quizzing experience there is! Sign Up Today!</p>

          <Link href="/register">
            <a title="Register To BrainFlop">
              <button>SIGN UP</button>
            </a>
          </Link>
        </div>
        <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />
      </div>
    )
  }

  pluralizeTopic(topic) {
    return pluralize.isPlural(topic)
      ? pluralize.singular(topic)
      : topic;
  }

  featuredQuizzes() {
    if (this.state.featuredQuizzes.length > 0) {
      return (
        <div className="featured-text-container">
          <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} style={{ marginLeft: '0px' }} className="col featured-1">
            <Link route={!this.state.featuredQuizzes[0].personalityResults || this.state.featuredQuizzes[0].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state.featuredQuizzes[0].title)}/${this.state.featuredQuizzes[0]._id}` : `/personality-quiz/${_.kebabCase(this.state.featuredQuizzes[0].title)}/${this.state.featuredQuizzes[0]._id}`} >
              <a title={`${_.startCase(_.toLower((this.state.featuredQuizzes[0].title)))} Game`}>
                <div style={{background: `url("${this.state.featuredQuizzes[0].quizImage}") center center no-repeat`, backgroundSize: 'cover'}} className="featured-1-img featured-img-1" />
                <div className="text-container">
                  <h1>{this.state.featuredQuizzes[0].title}</h1>
                  <p style={{ color: 'rgb(90, 90, 95)' }}>{this.state.featuredQuizzes[0].description}</p>
                  <Link route={`/category/${_.kebabCase(this.state.featuredQuizzes[0].tags)}`}>
                    <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state.featuredQuizzes[0].tags))))} Quizzes`}>
                      <div className="tags">
                        <div>
                          <img src="/static/images/icons/lightbulb.svg" />
                          <span className="span-color">
                            {this.state.featuredQuizzes[0].tags}
                          </span>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </a>
            </Link>
          </div>
          <div className="col featured-2">
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className="featured-2-item">
              <Link route={!this.state.featuredQuizzes[1].personalityResults || this.state.featuredQuizzes[1].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state.featuredQuizzes[1].title)}/${this.state.featuredQuizzes[1]._id}` : `/personality-quiz/${_.kebabCase(this.state.featuredQuizzes[1].title)}/${this.state.featuredQuizzes[1]._id}`} >
                <a title={`${_.startCase(_.toLower((this.state.featuredQuizzes[1].title)))} Game`}>
                  <div style={{background: `url("${this.state.featuredQuizzes[1].quizImage}") center center no-repeat`, backgroundSize: 'cover'}} className="side-img"/>
                  <div className="text-container">
                    <h1 onClick={this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[1].personalityResults, this.state.featuredQuizzes[1].title, this.state.featuredQuizzes[1]._id, history )}>{this.state.featuredQuizzes[1].title}</h1>
                    <Link route={`/category/${_.kebabCase(this.state.featuredQuizzes[1].tags)}`}>
                      <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state.featuredQuizzes[1].tags))))} Quizzes`}>
                        <div className="tags">
                          <div>
                            <img src="/static/images/icons/lightbulb.svg" />
                            <span onClick={this.routeToTagPage.bind(this, this.state.featuredQuizzes[1].tags, history)} className="span-color">{this.state.featuredQuizzes[1].tags}</span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                </a>
              </Link>
            </div>
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className="featured-2-item">
              <Link route={!this.state.featuredQuizzes[2].personalityResults || this.state.featuredQuizzes[2].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state.featuredQuizzes[2].title)}/${this.state.featuredQuizzes[2]._id}` : `/personality-quiz/${_.kebabCase(this.state.featuredQuizzes[2].title)}/${this.state.featuredQuizzes[2]._id}`} >
                <a title={`${_.startCase(_.toLower((this.state.featuredQuizzes[2].title)))} Game`}>
                  <div style={{background: `url("${this.state.featuredQuizzes[2].quizImage}") center center no-repeat`, backgroundSize: 'cover'}} className="side-img"/>
                  <div className="text-container">
                    <h1 onClick={this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[2].personalityResults, this.state.featuredQuizzes[2].title, this.state.featuredQuizzes[2]._id, history )}>{this.state.featuredQuizzes[2].title}</h1>
                    <Link route={`/category/${_.kebabCase(this.state.featuredQuizzes[2].tags)}`}>
                      <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state.featuredQuizzes[2].tags))))} Quizzes`}>
                        <div className="tags">
                          <div>
                            <img src="/static/images/icons/lightbulb.svg" />
                            <span onClick={this.routeToTagPage.bind(this, this.state.featuredQuizzes[2].tags, history)} className="span-color">{this.state.featuredQuizzes[2].tags}</span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                </a>
              </Link>
            </div>
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className="featured-2-item">
              <Link route={!this.state.featuredQuizzes[3].personalityResults || this.state.featuredQuizzes[3].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state.featuredQuizzes[3].title)}/${this.state.featuredQuizzes[3]._id}` : `/personality-quiz/${_.kebabCase(this.state.featuredQuizzes[3].title)}/${this.state.featuredQuizzes[3]._id}`} >
                <a title={`${_.startCase(_.toLower((this.state.featuredQuizzes[3].title)))} Game`}>
                  <div style={{background: `url("${this.state.featuredQuizzes[3].quizImage}") center center no-repeat`, backgroundSize: 'cover'}} className="side-img"/>
                  <div className="text-container">
                    <h1 onClick={this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[3].personalityResults, this.state.featuredQuizzes[3].title, this.state.featuredQuizzes[3]._id, history )}>{this.state.featuredQuizzes[3].title}</h1>
                    <Link route={`/category/${_.kebabCase(this.state.featuredQuizzes[3].tags)}`}>
                      <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state.featuredQuizzes[3].tags))))} Quizzes`}>
                        <div className="tags">
                          <div>
                            <img src="/static/images/icons/lightbulb.svg" />
                            <span onClick={this.routeToTagPage.bind(this, this.state.featuredQuizzes[3].tags, history)} className="span-color">{this.state.featuredQuizzes[3].tags}</span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                </a>
              </Link>
            </div>
          </div>
          <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)} className="col featured-1 featured-1-second">
            <Link route={!this.state.featuredQuizzes[4].personalityResults || this.state.featuredQuizzes[4].personalityResults.length === 0 ? `/quiz/${_.kebabCase(this.state.featuredQuizzes[4].title)}/${this.state.featuredQuizzes[4]._id}` : `/personality-quiz/${_.kebabCase(this.state.featuredQuizzes[4].title)}/${this.state.featuredQuizzes[4]._id}`} >
              <a title={`${_.startCase(_.toLower((this.state.featuredQuizzes[4].title)))} Game`}>
                <div style={{background: `url("${this.state.featuredQuizzes[4].quizImage}") center center no-repeat`, backgroundSize: 'cover'}} className="featured-1-img"/>
                <div className="text-container featured-text-container-2">
                  <h1>{this.state.featuredQuizzes[4].title}</h1>
                  <p style={{ color: 'rgb(90, 90, 95)' }}>{this.state.featuredQuizzes[4].description}</p>
                  <Link route={`/category/${_.kebabCase(this.state.featuredQuizzes[4].tags)}`}>
                    <a title={`${_.startCase(_.toLower((this.pluralizeTopic(this.state.featuredQuizzes[4].tags))))} Quizzes`}>
                      <div className="tags">
                        {this.state.featuredQuizzes[4].tags.split(',').map((tag) => (
                          <div>
                            <img src="/static/images/icons/lightbulb.svg" />
                            <span onClick={this.routeToTagPage.bind(this, tag, history)} className="span-color">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </a>
                  </Link>
                </div>
              </a>
            </Link>
          </div>
        </div>
      )
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

  renderRecentlyPlayed () {
    let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed'))
    if (!_.isEmpty(recentlyPlayed)) {
      return Object.keys(recentlyPlayed).map(key =>
        <div>
          <div className="inside-slider">
            <div onClick={this.redirectToShowQuizPage.bind(this, recentlyPlayed[key]._id)}>
              <h1>{recentlyPlayed[key].title}</h1>
            </div>
          </div>
        </div>
      )
    }
  }

  redirectToSeeMorePage () {
    Router.pushRoute('/categories')
  }

  render () {
    const topTags = this.renderTopTags();
    const signUpCTA = this.renderSignUpCTA();
    const featuredQuizzes = this.featuredQuizzes();
    const contentLoader = this.renderContentLoader();

    return (
      <div>
        <div id="explore">
          <div className="upper-nav-tags">
            <div className="tags-container">
              { topTags }
              <Link route='/categories'>
                <a title='View Categories'>
                  <p>MORE</p>
                </a>
              </Link>
            </div>
          </div>

          <div className="featured">
            <h1 className="featured-title">Featured Quizzes
              <img alt='featured image' src="/static/images/icons/star.svg" />
            </h1>
            {this.state.hideContentLoader ? featuredQuizzes : contentLoader}
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)}>
              <Link route='/featured'>
                <a title='Featured Quizzes' style={{ cursor: 'pointer' }}>
                  <div className="see-all-links">
                    SEE ALL
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <img style={{ transform: 'translateY(25px)' }} alt='underline' className="underline underline2 mobile-first-underline" src="/static/images/icons/squiggly.svg" />

          <div style={{ marginBottom: '30px' }} className="tag-topic personality-quizzes">
            <h1 style={{ transform: 'translateY(0px)' }} className="tag-title">
              Personality Quizzes
              <img style={{ transform: 'translate(4px, 8px)' }} alt='icon' src="/static/images/icons/personality-section.svg" />
            </h1>
            { this.state.hideContentLoader ?
              <div className="tag-topic-text-container">
                {this.renderTopicSection(0, 'personalityQuizzes')}
                <div className="col small-multiple">
                  {this.renderTopicSmallSection(1, 'personalityQuizzes')}
                </div>
              </div>
              :
              contentLoader
            }
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)}>
              <Link route='/personality-quizzes'>
                <a title='Personality Quizzes' style={{ cursor: 'pointer' }}>
                  <div className="see-all-links">
                    SEE ALL PERSONALITY QUIZZES
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <img style={{ transform: 'translateY(2px)' }} alt='underline' className="underline underline2 mobile-first-underline" src="/static/images/icons/squiggly.svg" />

          {this.props.isAuthenticated
            ? null
            : signUpCTA
          }

          <div className="tag-topic tag-topic1">
            <h1 className="tag-title">
              {
                this.state.previousUserTags.length > 0
                  ? this.state.previousUserTags[0].name || this.state.previousUserTags[0]
                  : ''
              }
              <img alt='icon' src="/static/images/icons/diamond.svg" />
            </h1>
            { this.state.hideContentLoader ?
              <div className="tag-topic-text-container">
                {this.renderTopicSection(0, 'topic1Quizzes')}
                <div className="col small-multiple">
                  {this.renderTopicSmallSection(1, 'topic1Quizzes')}
                </div>
              </div>
              :
              contentLoader
            }
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)}>
              <Link route={`/category/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[0].name === undefined ? _.kebabCase(this.state.previousUserTags[0]) : _.kebabCase(this.state.previousUserTags[0].name) : ''}`}>
                <a title={`${_.startCase(_.toLower(this.pluralizeTopic((this.state.previousUserTags.length > 0 ? this.state.previousUserTags[0].name === undefined ? this.state.previousUserTags[0] : this.state.previousUserTags[0].name : ''))))} Quizzes`} style={{ cursor: 'pointer' }}>
                  <div className="see-all-links">
                    SEE ALL
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div style={{ background: `url("/static/images/icons/likeusonfacebook.svg") center center no-repeat`, backgroundSize: 'cover', transform: 'translateY(10px)' }} className="sign-up-cta facebook-cta">
            <h1>
              Like us on Facebook
              <img alt='underline' src="/static/images/icons/underline.svg" />
            </h1>
            <a title="Like Us On Facebook" target="_blank" href="https://www.facebook.com/brainflopcorp/">
              <button>Like</button>
            </a>
          </div>

          <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div className="tag-topic tag-topic2">
            <h1 className="tag-title">
              {
                this.state.previousUserTags.length > 0
                  ? this.state.previousUserTags[1].name || this.state.previousUserTags[1]
                  : ''
              }
              <img alt='icon' src="/static/images/icons/diamond.svg" />
            </h1>
            { this.state.hideContentLoader ?
              <div className="tag-topic-text-container">
                <div className="col small-multiple">
                  {this.renderTopicSmallSection(1, 'topic2Quizzes')}
                </div>
                {this.renderTopicSection(0, 'topic2Quizzes')}
              </div>
              :
              contentLoader
            }
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)}>
              <Link route={`/category/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[1].name === undefined ? _.kebabCase(this.state.previousUserTags[1]) : _.kebabCase(this.state.previousUserTags[1].name) : ''}`}>
                <a title={`${_.startCase(_.toLower(this.pluralizeTopic(this.state.previousUserTags.length > 0 ? this.state.previousUserTags[1].name === undefined ? this.state.previousUserTags[1] : this.state.previousUserTags[1].name : '')))} Quizzes`} style={{ cursor: 'pointer' }}>
                  <div className="see-all-links">
                    SEE ALL
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div className="tag-topic tag-topic2">
            <h1 className="tag-title">
              {
                this.state.previousUserTags.length > 0
                  ? this.state.previousUserTags[2].name || this.state.previousUserTags[2]
                  : ''
              }
              <img alt='icon' src="/static/images/icons/diamond.svg" />
            </h1>
            { this.state.hideContentLoader ?
              <div className="tag-topic-text-container">
                {this.renderTopicSection(0, 'topic3Quizzes')}
                <div className="col small-multiple">
                  {this.renderTopicSmallSection(1, 'topic3Quizzes')}
                </div>
              </div>
              :
              contentLoader
            }
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)}>
              <Link route={`/category/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[2].name === undefined ? _.kebabCase(this.state.previousUserTags[2]) : _.kebabCase(this.state.previousUserTags[2].name) : ''}`}>
                <a title={`${_.startCase(_.toLower(this.pluralizeTopic(this.state.previousUserTags.length > 0 ? this.state.previousUserTags[2].name === undefined ? this.state.previousUserTags[2] : this.state.previousUserTags[2].name : '')))} Quizzes`} style={{ cursor: 'pointer' }}>
                  <div className="see-all-links">
                    SEE ALL
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <img style={{ transform: 'translateY(15px)' }} alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div className="sign-up-cta create-quiz-cta">
            <h1>
              Create Your Own Quiz
              <img alt='underline' src="/static/images/icons/underline.svg" />
            </h1>
            <p>Want to create your own personalized quiz? Go for it!</p>
            <div onClick={() => { $("html, body").animate({ scrollTop: 0 }, 350) }}>
              <Link route='/create-quiz' style={{ cursor: 'pointer' }} >
                <a title='Create Your Own Quiz!'>
                  <button>Create</button>
                </a>
              </Link>
          </div>
          </div>


          <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div className="tag-topic">
            <h1 className="tag-title">
              {
                this.state.previousUserTags.length > 0
                  ? this.state.previousUserTags[3].name || this.state.previousUserTags[3]
                  : ''
              }
              <img alt='icon' src="/static/images/icons/diamond.svg" />
            </h1>
            { this.state.hideContentLoader ?
              <div className="tag-topic-text-container">
                <div className="col small-multiple">
                  {this.renderTopicSmallSection(1, 'topic4Quizzes')}
                </div>
                {this.renderTopicSection(0, 'topic4Quizzes')}
              </div>
              :
              contentLoader
            }
            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)}>
              <Link route={`/category/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[3].name === undefined ? _.kebabCase(this.state.previousUserTags[3]) : _.kebabCase(this.state.previousUserTags[3].name) : ''}`}>
                <a title={`${_.startCase(_.toLower(this.pluralizeTopic(this.state.previousUserTags.length > 0 ? this.state.previousUserTags[3].name === undefined ? this.state.previousUserTags[3] : this.state.previousUserTags[3].name : '')))} Quizzes`} style={{ cursor: 'pointer' }}>
                  <div className="see-all-links">
                    SEE ALL
                  </div>
                </a>
              </Link>
            </div>
          </div>

          <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />


          <div className="tag-topic tag-topic2">
            <h1 className="tag-title">
              {
                this.state.previousUserTags.length > 0
                  ? this.state.previousUserTags[4].name || this.state.previousUserTags[4]
                  : ''
              }
              <img alt='icon' src="/static/images/icons/diamond.svg" />
            </h1>
            { this.state.hideContentLoader ?
              <div className="tag-topic-text-container">
                {this.renderTopicSection(0, 'topic5Quizzes')}
                <div className="col small-multiple">
                  {this.renderTopicSmallSection(1, 'topic5Quizzes')}
                </div>
              </div>
              :
              contentLoader
            }

            <div onClick={() => $("html, body").animate({ scrollTop: 0 }, 350)}>
              <Link route={`/category/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[4].name === undefined ? _.kebabCase(this.state.previousUserTags[4]) : _.kebabCase(this.state.previousUserTags[4].name) : ''}`}>
                <a title={`${_.startCase(_.toLower(this.pluralizeTopic(this.state.previousUserTags.length > 0 ? this.state.previousUserTags[4].name === undefined ? this.state.previousUserTags[4] : this.state.previousUserTags[4].name : '')))} Quizzes`} style={{ cursor: 'pointer' }}>
                  <div className="see-all-links">
                    SEE ALL
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className="explore-footer">
          <h1>Copyright @ 2018 BrainFlop <a title='Privacy Policy' style={{ color: 'rgb(200,170,170)', marginLeft: '5px' }} href="/privacy-policy">Privacy Policy</a></h1>
        </div>
      </div>
    )
  }
}

export default Explore
