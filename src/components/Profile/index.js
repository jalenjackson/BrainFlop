import React from 'react'
import ReactChartkick, { PieChart } from 'react-chartkick'
import Chart from 'chart.js'
import $ from 'jquery'
import Cookies from "universal-cookie";
import TweenMax, {Power3} from "gsap/TweenMaxBase";
import ReactGA from "react-ga";
import { Router } from '../../../routes';

ReactChartkick.addAdapter(Chart);


export default class ProfileComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userTitle: '',
      percentageOfQuestionsCorrect: null,
      quizzes: [],
      skipIterator: 0,
      contentRendered: false,
      percentageOfQuestionsCorrectMessage: '',
      editErrorMessage: ''
    };
  }

  componentDidMount () {
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/profile`);
    document.addEventListener('scroll', this.trackScrolling);

    fetch(`https://api.quizop.com/quizzes/user-quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ userId: this.props.userObject.userId, skipIterator: this.state.skipIterator })
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizzes: body.quizzes }, () => {
          setTimeout(() => {
            this.setState({ contentRendered: true })
          }, 200)
        })
      })
    }).catch((err) => {
      console.log(err);
    });

    let currentUserScore = this.props.userObject.points;
    if (currentUserScore < 500) this.setState({ userTitle: 'BrainFlop Rookie' })
    if (currentUserScore < 2000 && currentUserScore > 500) this.setState({ userTitle: 'BrainFlop Beginner' })
    if (currentUserScore < 5000 && currentUserScore > 2000) this.setState({ userTitle: 'BrainFlop Pro' })
    if (currentUserScore < 10000 && currentUserScore > 5000) this.setState({ userTitle: 'BrainFlop Master' })
    if (currentUserScore > 10000) this.setState({ userTitle: 'BrainFlop Ninja' })
    let percentageOfQuestionsCorrect = (Number(this.props.userObject.overallScore.split('/')[0]) / Number(this.props.userObject.overallScore.split('/')[1])).toFixed(2);
    isNaN(percentageOfQuestionsCorrect)
      ? this.setState({ percentageOfQuestionsCorrectMessage: "Your data will appear here once you've taken some quizzes" })
      : this.setState({ percentageOfQuestionsCorrectMessage: `${String(percentageOfQuestionsCorrect).split('.')[1]}% of the questions you've answered were correct` })
    this.setState({ percentageOfQuestionsCorrect: isNaN(percentageOfQuestionsCorrect) ? 0 : String(percentageOfQuestionsCorrect).split('.')[1] })
    this.chart()
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  navigateToQuizEditPage (quizId) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/create-quiz/${quizId}`)
  }

  navigateToTagPage (tagName) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    Router.pushRoute(`/category/${tagName}`)
  }

  async fetchMoreQuizzes() {
    await this.setState({ skipIterator: this.state.skipIterator + 8 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    fetch(`https://api.quizop.com/quizzes/user-quizzes`, {
      method: 'POST',
      body: JSON.stringify({
        userId: this.props.userObject.userId,
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
        })

      });
    }).catch((err) => {
      console.log(err)
    })
  }

  renderQuizzes() {
    if (this.state.quizzes.length > 0) {
      return this.state.quizzes.map((quiz) => (
        <div key={quiz._id} className="col">
          <div onClick={this.navigateToQuizEditPage.bind(this, quiz._id,)} className="quiz-img" style={{ background: `url(${quiz.quizImage}) center center no-repeat`, backgroundSize: 'cover' }} />

          <div className="text-container">
            <h1 onClick={this.navigateToQuizEditPage.bind(this, quiz._id)}>{ quiz.title }</h1>

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

  submitEditInfo () {
    this.setState({ editErrorMessage: '' })
    const data = {
      name: $('.edit-name').val(),
      email: $('.edit-email').val(),
      password: $('.edit-password').val()
    }
    if (data.email) {
      if (!this.validateEmail(data.email)) {
        return this.setState({ editErrorMessage: 'Email is not valid' })
      }
    }
    fetch(`https://api.quizop.com/users/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${this.props.userObject.token}`
      },
      body: JSON.stringify({
        userId: this.props.userObject.userId,
        name: data.name,
        email: data.email,
        password: data.password
      })
    }).then((response) => {
      response.json().then((body) => {
        console.log(body)
        if (body.message) {
          return this.setState({ editErrorMessage: 'You cannot change your email to that' })
        }
        data.name ? $('.top-header h1').html(data.name) : null;
        $('.edit-name').val('')
        $('.edit-email').val('')
        $('.edit-password').val('')
        $(".edit-profile-modal-container, .edit-profile-modal").css({ opacity: 0, pointerEvents: 'none' });
        const newCookie = {
          isAuthenticated: true,
          userObject: body.user
        };
        newCookie.userObject.token = body.token;
        const cookies = new Cookies();
        cookies.set('userObject', newCookie, { path: '/' });
      })
    }).catch(() => {
      window.location.href = '/error'
    })
  }

  validateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)
  }

  removeErrorMessages () {
    this.setState({ editErrorMessage: '' })
  }

  handleEnterSubmit (e) {
    if (e.key === 'Enter') this.submitEditInfo()
  }

  renderEditProfileModal () {
    return (
      <div className="edit-profile-modal-container">
        <div className="edit-profile-modal">
          <img onClick={this.hideEditProfileModal.bind(this)} className="close-modal" src='/static/images/icons/close.png' />
          <h1>Edit Profile</h1>
          <p>Leave the field blank if you do not want to change it</p>
          <p style={{ color: '#ec526d', marginTop: '15px' }}>{this.state.editErrorMessage}</p>
          <input onKeyPress={this.handleEnterSubmit.bind(this)} onChange={this.removeErrorMessages.bind(this)} className='edit-name' type="text" placeholder="Your Name" />
          <input onKeyPress={this.handleEnterSubmit.bind(this)} onChange={this.removeErrorMessages.bind(this)} className='edit-email' type="text" placeholder="email" />
          <input onKeyPress={this.handleEnterSubmit.bind(this)} onChange={this.removeErrorMessages.bind(this)} className='edit-password' type="password" placeholder="password" />
          <button onClick={this.submitEditInfo.bind(this)}>Submit</button>
        </div>
      </div>
    )
  }

  showEditProfileModal () {
    $(".edit-profile-modal-container, .edit-profile-modal").css({ opacity: 1, pointerEvents: 'auto' });
  }

  hideEditProfileModal () {
    $(".edit-profile-modal-container, .edit-profile-modal").css({ opacity: 0, pointerEvents: 'none' });
  }

  signOutUser () {
    const cookies = new Cookies();
    cookies.remove('userObject');
    window.location.href = '/'
  }

  redirectToCustomizeExperience () {
    Router.pushRoute('/customize-experience')
  }

  render () {

    const quizzes = this.renderQuizzes();
    const contentLoader = this.renderContentLoader();
    const editProfileModal = this.renderEditProfileModal();

    return (
      <div className="profile-container">
        {editProfileModal}
        <div id="profile">
          <div className="top-header">
            <div className="text-container">
              <h1>{this.props.userObject.name}</h1>
              <p>{this.state.userTitle}</p>
              <button onClick={this.showEditProfileModal.bind(this)}>EDIT PROFILE</button>
              <button onClick={this.redirectToCustomizeExperience.bind(this)}>CUSTOMIZE EXPERIENCE</button>
              <button onClick={this.signOutUser.bind(this)}>SIGN OUT</button>
            </div>
          </div>
          <div className="card">
            {
              this.state.contentRendered ?
                <div>
                  <img src='/static/images/icons/lightning.svg' />
                  <h1>You've earned {this.props.userObject.points} points</h1>
                  <img className="underline" src='/static/images/icons/underline.svg' />
                </div>
                :
                contentLoader
            }
          </div>
          <div className="card">
            {
              this.state.contentRendered ?
                <div>
                  <h1>Question Right To Wrong Ratio</h1>
                  <PieChart colors={["#2FDC7F", "rgb(246,92,119)"]} donut={true} width="150" height="200px" data={[["Questions Answered Correctly", this.props.userObject.overallScore.split('/')[0]], ["Questions Answered Wrong", Number(this.props.userObject.overallScore.split('/')[1]) - Number(this.props.userObject.overallScore.split('/')[0]) ]]} />
                  <h1>{this.state.percentageOfQuestionsCorrectMessage}</h1>
                </div>
                :
                contentLoader
            }
          </div>
          <div className="card">
            {
              this.state.contentRendered ?
                <div>
                  <h1>Your <span style={{ color: '#ec526d', fontFamily: 'QuizOpFont, sans-serif' }}>FLAWLESS</span> score is {this.props.userObject.numberOfPerfectScores}</h1>
                  <p style={{ width: '80%', display: 'inline-block' }}>Your <span style={{ color: '#ec526d', fontFamily: 'QuizOpFont, sans-serif' }}>FLAWLESS</span> score represent the amount of times you scored a perfect score on a quiz</p>
                </div>
                :
                contentLoader
            }
          </div>
        </div>
        {
          this.state.quizzes.length > 0
            ?
            <div className="card">
              <div id="quizzes">
                <h3>Quizzes you've created</h3>
                <div className='quizzes'>
                  { quizzes }
                </div>
              </div>
            </div>
            :
            null
        }
        <div className="pagination-loader">
          <img src='/static/images/icons/rings.svg' />
        </div>
      </div>
    )
  }

  chart () {

  }
}
