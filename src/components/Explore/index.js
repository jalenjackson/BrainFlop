import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import ReactGA from "react-ga";

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
      personalityQuizzes: []
    }
  }

  async componentDidMount () {
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview('/explore');
    $(window).scrollTop(0);

    fetch(`${window.location.host}/quizzes/featured?limit=5&skip=0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ featuredQuizzes: body.quizzes })
      })
    }).catch((err) => {
      console.log(err);
    });

    fetch(`${window.location.host}/quizzes/personality-quizzes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ personalityQuizzes: body.quizzes });
      })
    }).catch((err) => {
      console.log(err);
    });

    fetch(`${window.location.host}/tags?limit=8&skipAmount=0`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({
          topTags: body.tags
        }, () => {
          const shouldFetchUsersCustomizedExperience =
            window.Auth.isAuthenticated &&
            window.Auth.userObject.customizedTags !== 'none';
          this.setState({
            previousUserTags: shouldFetchUsersCustomizedExperience
              ? window.Auth.userObject.customizedTags.split(',')
              : this.state.topTags.slice(0, 5)
          }, () => {
            for (let i = 0; i < this.state.previousUserTags.length; i++) {
              let stateKey = `topic${i + 1}Quizzes`;
              fetch(`${window.location.host}/quizzes/quizzes-by-topic`, {
                method: 'POST',
                body: JSON.stringify({ topic: shouldFetchUsersCustomizedExperience
                    ? this.state.previousUserTags[i]
                    : this.state.previousUserTags[i].name
                }),
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
              }).then((response) => {
                response.json().then((body) => {
                  $('.overlay').css({ opacity: 0, pointerEvents: 'none' });
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
        <div className={`col large-one ${section}`}>
          <Route render={({ history }) => (
            <div onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI]._id, history )} style={{ background: `url(${this.state[section][quizI].quizImage}) center center no-repeat`, backgroundSize: 'cover' }} className="large-img" />
          )} />
          <div className="text-container">
            <div className="text-container">
              <Route render={({ history }) => (
                <h1 onClick={this.redirectToShowQuizPage.bind(this, this.state[section][quizI]._id, history)}>{ this.state[section][quizI].title }</h1>
              )} />
              <p>{ this.state[section][quizI].description }</p>
              <div className="tags">
                <p className="user-name">
                  {this.state[section][quizI].tags.split(',').map((tag, i) => {
                    return (
                      <Route render={({ history }) => (
                        <span onClick={this.routeToTagPage.bind(this, tag, history)} key={i} className="span-color">{tag}</span>
                      )}
                      />
                    )
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  renderTopicSmallSection (quizI, section) {
    if (this.state[section].length >= 4) {
      return (
        <div>
          <div className="item">
            <Route render={({ history }) => (
              <div onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI]._id, history )}
                   style={{
                     background: `url(${ this.state[section][quizI].quizImage}) center center no-repeat`,
                     backgroundSize: 'cover'
                   }} className="side-img"/>
            )} />
            <div className="text-container">
              <Route render={({ history }) => (
                <h1 onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI]._id, history)}>{this.state[section][quizI].title}</h1>
              )} />
              <p>{this.state[section][quizI].description}</p>
              <div className="tags">
                <Route render={({ history }) => (
                  <span onClick={ this.routeToTagPage.bind(this, this.state[section][quizI].tags.split(',')[0], history)} className="span-color">{this.state[section][quizI].tags.split(',')[0]}</span>
                )}
                />
              </div>
            </div>
          </div>
          <div className="item">
            <Route render={({ history }) => (
              <div onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 1]._id, history )} style={{ background: `url(${this.state[section][quizI + 1].quizImage}) center center no-repeat`, backgroundSize: 'cover' }} className="side-img" />
            )} />
            <div className="text-container">
              <Route render={({ history }) => (
                <h1 onClick={ this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 1]._id, history )}>{this.state[section][quizI + 1].title}</h1>
              )} />
              <p>{this.state[section][quizI + 1].description}</p>
              <div className="tags">
                <Route render={({ history }) => (
                  <span onClick={ this.routeToTagPage.bind(this, this.state[section][quizI + 1].tags.split(',')[0], history )} className="span-color">{this.state[section][quizI + 1].tags.split(',')[0]}</span>
                )} />
              </div>
            </div>
          </div>
          <div className="item">
            <Route render={({ history }) => (
              <div onClick={this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 2]._id, history )} style={{background: `url(${this.state[section][quizI + 2].quizImage}) center center no-repeat`, backgroundSize: 'cover' }} className="side-img"/>
            )} />
            <div className="text-container">
              <Route render={({ history }) => (
                <h1 onClick={this.redirectToShowQuizPage.bind(this, this.state[section][quizI + 2]._id, history )}>{this.state[section][quizI + 2].title}</h1>
              )} />
              <p>{this.state[section][quizI + 2].description}</p>
              <div className="tags">
                <Route render={({ history }) => (
                  <span onClick={this.routeToTagPage.bind(this, this.state[section][quizI + 2].tags.split(',')[0], history)} className="span-color">{this.state[section][quizI + 2].tags.split(',')[0]}</span>
                )}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  redirectToShowQuizPage (quizId, history) {
    history.push(`/quiz/${quizId}`)
  }

  routeToTagPage (tagName, history) {
    history.push(`/tags/${tagName.toLowerCase()}`)
  }

  renderTopTags () {
    if (this.state.topTags.length > 0) {
      return this.state.topTags.map(tag => (
        <Route render={({ history }) => (
          <p key={tag._id} onClick={this.routeToTagPage.bind(this, tag.name, history)}>{ tag.name }</p>
        )}
        />
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
          <NavLink to="/register">
            <button>SIGN UP</button>
          </NavLink>
        </div>
        <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />
      </div>
    )
  }

  featuredQuizzes() {
    if (this.state.featuredQuizzes.length > 0) {
      return (
        <div className="featured-text-container">
          <div style={{ marginLeft: '0px' }} className="col featured-1">
            <Route render={({ history }) => (
              <div onClick={
                this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[0]._id, history )}
                   style={{
                     background: `url("${this.state.featuredQuizzes[0].quizImage}") center center no-repeat`,
                     backgroundSize: 'cover'
                   }} className="featured-1-img featured-img-1"/>
            )}
            />
            <div className="text-container">
              <Route render={({ history }) => (
                <h1 onClick={
                  this.redirectToShowQuizPage.bind(
                    this,
                    this.state.featuredQuizzes[0]._id,
                    history
                  )}
                >{this.state.featuredQuizzes[0].title}
                </h1>
              )}
              />
              <p>{this.state.featuredQuizzes[0].description}</p>
              <div className="tags">
                {this.state.featuredQuizzes[0].tags.split(',').map((tag) => (
                  <Route render={({ history }) => (
                    <div>
                      <img src="/static/images/icons/lightbulb.svg" />
                      <span onClick={this.routeToTagPage.bind(this, this.state.featuredQuizzes[0].tags, history)} className="span-color">
                        {this.state.featuredQuizzes[0].tags}
                      </span>
                    </div>
                  )}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="col featured-2">
            <div className="featured-2-item">
              <Route render={({ history }) => (
                <div onClick={
                  this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[1]._id, history )}
                     style={{
                       background: `url("${this.state.featuredQuizzes[1].quizImage}") center center no-repeat`,
                       backgroundSize: 'cover'
                     }} className="side-img"/>
              )}
              />
              <div className="text-container">
                <Route render={({ history }) => (
                  <h1 onClick={
                    this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[1]._id, history )}
                  >{this.state.featuredQuizzes[1].title}</h1>
                )}
                />
                <div className="tags">
                  <Route render={({ history }) => (
                    <div>
                      <img src="/static/images/icons/lightbulb.svg" />
                      <span onClick={this.routeToTagPage.bind(this, this.state.featuredQuizzes[1].tags, history)} className="span-color">{this.state.featuredQuizzes[1].tags}</span>
                    </div>
                  )}
                  />
                </div>
              </div>
            </div>
            <div className="featured-2-item">
              <Route render={({ history }) => (
                <div onClick={
                  this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[2]._id, history )}
                     style={{
                       background: `url("${this.state.featuredQuizzes[2].quizImage}") center center no-repeat`,
                       backgroundSize: 'cover'
                     }} className="side-img"/>
              )}
              />
              <div className="text-container">
                <Route render={({ history }) => (
                  <h1 onClick={
                    this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[2]._id, history )}
                  >{this.state.featuredQuizzes[2].title}</h1>
                )}
                />
                <div className="tags">
                  <Route render={({ history }) => (
                    <div>
                      <img src="/static/images/icons/lightbulb.svg" />
                      <span onClick={this.routeToTagPage.bind(this, this.state.featuredQuizzes[2].tags, history)} className="span-color">{this.state.featuredQuizzes[2].tags}</span>
                    </div>
                  )}
                  />
                </div>
              </div>
            </div>
            <div className="featured-2-item">
              <Route render={({ history }) => (
                <div onClick={
                  this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[3]._id, history )}
                     style={{
                       background: `url("${this.state.featuredQuizzes[3].quizImage}") center center no-repeat`,
                       backgroundSize: 'cover'
                     }} className="side-img"/>
              )}
              />
              <div className="text-container">
                <Route render={({ history }) => (
                  <h1 onClick={
                    this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[3]._id, history )}
                  >{this.state.featuredQuizzes[3].title}</h1>
                )}
                />
                <div className="tags">
                  <Route render={({ history }) => (
                    <div>
                      <img src="/static/images/icons/lightbulb.svg" />
                      <span onClick={this.routeToTagPage.bind(this, this.state.featuredQuizzes[3].tags, history)} className="span-color">{this.state.featuredQuizzes[3].tags}</span>
                    </div>
                  )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col featured-1 featured-1-second">
            <Route render={({ history }) => (
              <div onClick={
                this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[4]._id, history )}
                   style={{
                     background: `url("${this.state.featuredQuizzes[4].quizImage}") center center no-repeat`,
                     backgroundSize: 'cover'
                   }} className="featured-1-img"/>
            )}
            />
            <div className="text-container featured-text-container-2">
              <Route render={({ history }) => (
                <h1 onClick={
                  this.redirectToShowQuizPage.bind(this, this.state.featuredQuizzes[4]._id, history )}
                >{this.state.featuredQuizzes[4].title}
                </h1>
              )}
              />
              <p>{this.state.featuredQuizzes[4].description}</p>
              <div className="tags">
                {this.state.featuredQuizzes[4].tags.split(',').map((tag) => (
                  <Route render={({ history }) => (
                    <div>
                      <img src="/static/images/icons/lightbulb.svg" />
                      <span onClick={this.routeToTagPage.bind(this, tag, history)} className="span-color">{tag}</span>
                    </div>
                  )}
                  />
                ))}
              </div>
            </div>
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
            <Route render={({ history }) => (
              <div onClick={this.redirectToShowQuizPage.bind(this, recentlyPlayed[key]._id, history)}>
                <h1>{recentlyPlayed[key].title}</h1>
              </div>
            )}
            />
          </div>
        </div>
      )
    }
  }

  redirectToSeeMorePage (history) {
    history.push('/all-tags')
  }

  render () {
    const topTags = this.renderTopTags();
    const signUpCTA = this.renderSignUpCTA();
    const featuredQuizzes = this.featuredQuizzes();
    const contentLoader = this.renderContentLoader();

    return (
      <div>
        <div id="explore">
          <div className="overlay">
            <img src="/static/images/icons/logo.svg" />
          </div>
          <div className="upper-nav-tags">
            <div className="tags-container">
              { topTags }
              <Route render={({ history }) => (
                <p onClick={this.redirectToSeeMorePage.bind(this, history)}>MORE</p>
              )}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }} className="tag-topic personality-quizzes">
            <h1 className="tag-title">
              Featured Personality Quizzes
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
            <NavLink to={`/tags/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[0].name === undefined ? this.state.previousUserTags[0] : this.state.previousUserTags[0].name : ''}`}>
              <div className="see-all-links">
                SEE ALL PERSONALITY QUIZZES
              </div>
            </NavLink>
          </div>

          <img style={{ transform: 'translateY(-9px)' }} alt='underline' className="underline underline2 mobile-first-underline" src="/static/images/icons/squiggly.svg" />


          <div className="featured">
            <h1 className="featured-title">Featured Tests
              <img alt='featured image' src="/static/images/icons/star.svg" />
            </h1>
            {this.state.hideContentLoader ? featuredQuizzes : contentLoader}
            <NavLink to={`/featured`}>
              <div className="see-all-links">
                SEE ALL
              </div>
            </NavLink>
          </div>

          <img alt='underline' className="underline underline2 mobile-first-underline" src="/static/images/icons/squiggly.svg" />

          { window.Auth.isAuthenticated ? null : signUpCTA }

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
            <NavLink to={`/tags/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[0].name === undefined ? this.state.previousUserTags[0] : this.state.previousUserTags[0].name : ''}`}>
              <div className="see-all-links">
                SEE ALL
              </div>
            </NavLink>
          </div>
          <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div style={{ background: `url("/static/images/icons/likeusonfacebook.svg") center center no-repeat`, backgroundSize: 'cover', transform: 'translateY(10px)' }} className="sign-up-cta facebook-cta">
            <h1>
              Like us on Facebook
              <img alt='underline' src="/static/images/icons/underline.svg" />
            </h1>
            <a target="_blank" href="https://www.facebook.com/brainflopcorp/">
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
            <NavLink to={`/tags/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[1].name === undefined ? this.state.previousUserTags[1] : this.state.previousUserTags[1].name : ''}`}>
              <div className="see-all-links">
                SEE ALL
              </div>
            </NavLink>
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
            <NavLink to={`/tags/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[2].name === undefined ? this.state.previousUserTags[2] : this.state.previousUserTags[2].name : ''}`}>
              <div className="see-all-links">
                SEE ALL
              </div>
            </NavLink>
          </div>

          <img style={{ transform: 'translateY(15px)' }} alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div className="sign-up-cta create-quiz-cta">
            <h1>
              Create Your Own Quiz
              <img alt='underline' src="/static/images/icons/underline.svg" />
            </h1>
            <p>Want to create your own personalized quiz? Go for it!</p>
            <NavLink to="/create-quiz">
              <button>Create</button>
            </NavLink>
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
            <NavLink to={`/tags/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[3].name === undefined ? this.state.previousUserTags[3] : this.state.previousUserTags[3].name : ''}`}>
              <div className="see-all-links">
                SEE ALL
              </div>
            </NavLink>
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
            <NavLink to={`/tags/${this.state.previousUserTags.length > 0 ? this.state.previousUserTags[4].name === undefined ? this.state.previousUserTags[4] : this.state.previousUserTags[4].name : ''}`}>
              <div className="see-all-links">
                SEE ALL
              </div>
            </NavLink>
          </div>

          <img alt='underline' className="underline underline2" src="/static/images/icons/squiggly.svg" />

          <div style={{ background: `url("/static/images/icons/lookatreviews.svg") center center no-repeat`, backgroundSize: 'cover', transform: 'translateY(10px)' }} className="sign-up-cta facebook-cta">
            <h1>
              Check out our reviews
              <img alt='underline' src="/static/images/icons/underline.svg" />
            </h1>
            <a target="_blank" href="https://www.facebook.com/pg/brainflopcorp/reviews/?ref=page_internal">
              <button>Check it out!</button>
            </a>
          </div>
        </div>
        <div className="explore-footer">
          <h1>Copyright @ 2018 BrainFlop <a style={{ color: 'rgb(200,170,170)' }} href="/privacy-policy">Privacy Policy</a></h1>
        </div>
      </div>
    )
  }
}

export default Explore
