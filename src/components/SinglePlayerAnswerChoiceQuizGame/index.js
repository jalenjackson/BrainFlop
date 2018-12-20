import React from 'react'
import $ from 'jquery'
import TweenMax, {Power4} from 'gsap/TweenMaxBase';
import TimelineMax from 'gsap/TimelineMax';
import ReactGA from 'react-ga';
let SplitText = null;
let quizId = null;
let myName = '';
import { Router } from '../../../routes';
import Cookies from "universal-cookie";
let questionTimer = 0;
let difficulty = '';
let pointIterator = 0

class SinglePlayerAnswerChoiceQuizGameComponent extends React.Component {
  constructor (props) {
    super(props)

    difficulty = this.props.difficulty;

    switch (difficulty) {
      case 'easy':
        questionTimer = 10;
        pointIterator = 5;
        break;
      case 'medium':
        questionTimer = 7;
        pointIterator = 10;
        break;
      case 'hard':
        questionTimer = 5;
        pointIterator = 20;
        break;
      default:
        questionTimer = 10;
    }

    this.state = {
      quizQuestions: [],
      currentActiveQuestion: 0,
      gameOver: false,
      yourScore: 0,
      questionTimer,
      startingCountdown: true,
      fetchedQuestions: false,
      answeredQuestion: false,
      questionsShuffled: false,
      shuffledQuizQuestions: ['', '', '', ''],
      quizData: null,
      wasFlawless: false,
      grade: null,
      timeToReadFinished: false,
      timeToReadCounter: 0,
      currentTimeToReadCounterSet: false,
      allAnsweredQuestions: [],
      allAnswered: [],
      allAnswerCompare: [],
    };
  }

  tick () {
    if (this.state.quizQuestions.length > 0) {
      if (!this.state.timeToReadFinished) {
        if (!this.state.currentTimeToReadCounterSet) {
          let moreTime = 5000
          if (this.state.quizQuestions[this.state.currentActiveQuestion].questionImage !== 'none') {
            moreTime = 8000
          }
          this.setState({timeToReadCounter: Math.round(this.state.quizQuestions[this.state.currentActiveQuestion].timeToRead) + moreTime}, () => {
            this.setState({currentTimeToReadCounterSet: true})
          })
        }
        if (this.state.currentTimeToReadCounterSet) {
          this.setState({timeToReadCounter: this.state.timeToReadCounter - 1000}, () => {
            $('#countdown').css({
              '-webkit-animation': 'pulsate 1s infinite',
              'animation': 'pulsate 1s infinite'
            });
            if (this.state.timeToReadCounter < -1000) {
              $('#countdown-number').css({ color: '#ec526d' })
              $('#countdown').css({ animation: 'none' })
              this.setState({
                timeToReadFinished: true,
                currentTimeToReadCounterSet: false,
              })
            }
          })
        }
      }
      if (this.state.startingCountdown && this.state.timeToReadFinished) {
        $('#countdown svg circle').css({animation: `countdown ${questionTimer}s linear 1 forwards`});
        this.setState({startingCountdown: false})
      }
      if (!this.state.answeredQuestion && this.state.timeToReadFinished) {
        this.setState({questionTimer: this.state.questionTimer - 1}, () => {
          if (this.state.questionTimer < 0) {
            if (this.state.currentActiveQuestion >= this.state.quizQuestions.length - 1) {
              this.setState({
                gameOver: true
              })
            } else {
              $('#countdown-number').css({ color: 'rgb(100, 100, 100)' })
              $('.answer').css({background: 'none'});
              $('.answer h1').css({color: 'rgb(80, 80, 85)'});
              $('#countdown svg circle').css({animation: 'none'});
              this.setState({
                currentActiveQuestion: this.state.currentActiveQuestion + 1,
                questionTimer,
                startingCountdown: true,
                questionsShuffled: false,
                timeToReadFinished: false,
              })
            }
          }
        })
      }
    }
  }

  async componentWillMount() {
    this.timer = setInterval(this.tick.bind(this), 1000)
  }

  componentDidMount () {
    SplitText = require('../../gsap/SplitText');
    quizId = window.location.pathname.split('/')[4];
    ReactGA.initialize('UA-129744457-1')
    ReactGA.pageview(window.location.pathname);
    myName = this.props.isAuthenticated ? this.props.userObject.name : 'Me';
    $('body').css({
      background: 'linear-gradient(rgb(255,245,245), rgb(200, 150, 150))',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    });
    $(window).scrollTop(0)

    fetch(`https://api.quizop.com/quizzes/${quizId}`, {
      method: 'GET'
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizData: body.quiz }, () => {
          let event = `Anonymous is playing ${this.state.quizData.title}`
          if (this.props.isAuthenticated) {
            event = `${this.props.userObject.name} is playing ${this.state.quizData.title}`
          }
          ReactGA.event({
            category: 'Answer Choice Quiz',
            action: event
          })
        });
      })
    }).catch((err) => {
      console.log(err)
    })

    fetch(`https://api.quizop.com/questions/get-quiz-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ quizId }),
    })
        .then((response) => {
          response.json().then((body) => {
            this.setState({
              quizQuestions: this.shuffle(body.questions),
              fetchedQuestions: true
            })
          })
        }).catch((err) => {
      console.log(err)
    })
  }

  componentWillUnmount () {
    $('body').css({ background: 'white' });
  }

  submitAnswer (answer, answerText, e) {
    if (!this.state.answeredQuestion) {
      let tmpArr = this.state.allAnswered
      tmpArr.push(answerText)
      this.setState({ allAnswered: tmpArr })
      const isGameOver = this.state.currentActiveQuestion >= this.state.quizQuestions.length - 1;
      this.setState({answeredQuestion: true})
      $('#countdown svg circle').css({animationPlayState: 'paused'})
      if (answer === 'answer1') {
        $('.answer h2').css({color: 'rgb(230, 230, 230)'})
        $('.letter').css({color: 'rgb(230, 230, 230)'})
        $(e.currentTarget).css({background: '#2FDC7F'})
        $(e.currentTarget).find('.letter').css({color: '#2FDC7F'})
        this.setState({yourScore: this.state.yourScore + pointIterator})
      } else {
        $('.answer h2').css({color: 'rgb(230, 230, 230)'})
        $('.letter').css({color: 'rgb(230, 230, 230)'})
        $(e.currentTarget).css({background: '#FD7479'})
        $(e.currentTarget).find('.letter').css({color: '#FD7479'})
      }

      if (!isGameOver) {
        setTimeout(() => {
          $('.text').css({width: '100%', opacity: 1})
        }, 500)
      }

      const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };

      setTimeout(() => {
        $('.text').css({width: '0%', left: 'inherit', right: 0})
        $('#countdown svg circle').css({animation: 'none'})
        $('.answer').css({background: 'none'})
        $('.answer h2').css({color: 'rgb(90, 90, 90)'})
        $('.letter').css({color: 'rgb(200,200,200)'})

        if (isGameOver) {
          this.setState({
            gameOver: true
          }, () => {
            const correct = Number(String(this.state.yourScore).slice(0, -1));
            const total = this.state.quizQuestions.length;
            const score = correct / total // 0.7
            let grade = null
            if (score >= 0.9) grade = 'A';
            if (score >= 0.8 && score < 0.9) grade = 'B';
            if (score >= 0.7 && score < 0.8) grade = 'C';
            if (score >= 0.6 && score < 0.7) grade = 'D';
            if (score < 0.6) grade = 'F';

            this.setState({grade});

            fetch(`https://api.quizop.com/quizzes/analytics/${quizId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                addToTotalPlays: true
              })
            }).then((response) => {
              response.json().then((body) => {
                const correctAnswers = this.state.yourScore === 0 ? '0' : String(this.state.yourScore).slice(0, -1)
                const totalQuestions = String(this.state.quizQuestions.length);
                const score = correctAnswers + '/' + totalQuestions;
                const points = this.state.yourScore;

                if (this.props.isAuthenticated) {
                  fetch(`https://api.quizop.com/users/analytics`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${this.props.userObject.token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      userId: this.props.userObject.userId,
                      score,
                      points
                    })
                  }).then((response) => {
                    response.json().then((body) => {
                      const newCookie = {
                        isAuthenticated: true,
                        userObject: body.user
                      };
                      newCookie.userObject.token = body.token;
                      const cookies = new Cookies();
                      cookies.set('userObject', newCookie, { path: '/' });
                      if (this.state.yourScore > 0) {
                        $('.navbar-points').html(numberWithCommas(body.user.points)).css({ transform: 'translate(45px, 3px) scale(1.5)', color: '#2FDC7F' })
                        setTimeout(() => {
                          $('.navbar-points').css({ transform: 'translate(45px, 3px) scale(1)', color: 'rgb(200, 190, 190)' })
                        }, 600)
                      }

                      if (correctAnswers === totalQuestions) {
                        this.setState({wasFlawless: true, grade: 'A+'});
                        fetch(`https://api.quizop.com/users/analytics`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${this.props.userObject.token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            userId: this.props.userObject.userId,
                            isPerfectScore: true
                          })
                        }).then((response) => {
                          response.json().then((body) => {
                            const newCookie = {
                              isAuthenticated: true,
                              userObject: body.user
                            };
                            newCookie.userObject.token = body.token;
                            const cookies = new Cookies();
                            cookies.set('userObject', newCookie, { path: '/' });
                          })
                        }).catch((err) => {
                          console.log(err)
                        })
                      }
                    })
                  }).catch((err) => {
                    console.log(err)
                  })
                }
              })
            }).catch((err) => {
              console.log(err)
            })
          })
        } else {
          $('#countdown-number').css({ color: 'rgb(100, 100, 100)' })
          this.setState({
            currentActiveQuestion: this.state.currentActiveQuestion + 1,
            questionTimer,
            startingCountdown: true,
            answeredQuestion: false,
            questionsShuffled: false,
            timeToReadFinished: false,
            currentTimeToReadCounterSet: false
          }, () => {
            const T1Split = new SplitText(
                '.question-asked',
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
                  delay: 0.2
                },
                0.02, '+=0')
          })
        }
      }, isGameOver ? 300 : 1100);

      setTimeout(() => {
        $('.text').css({width: '0%', left: '0', right: 'inherit', opacity: 0})
      }, 1600)
    }
  }

  shuffle (a) {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
    }
    return a
  }

  changeBackgroundColor(protocol, e) {
    protocol === 'enter'
        ? e.currentTarget.style.backgroundColor = "rgb(255,245,245)"
        : e.currentTarget.style.backgroundColor = "white"
  }

  renderQuizQuestions () {
    if (this.state.fetchedQuestions) {
      let currentActiveQuestionObject = this.state.quizQuestions[this.state.currentActiveQuestion]

      if (!this.state.questionsShuffled) {
        let quizQuestions = [
          { answer: currentActiveQuestionObject.answer1, key: 'answer1', 'answer1': currentActiveQuestionObject.answer1 },
          { answer: currentActiveQuestionObject.answer2, key: 'answer2', 'answer2': currentActiveQuestionObject.answer2 },
          { answer: currentActiveQuestionObject.answer3, key: 'answer3', 'answer3': currentActiveQuestionObject.answer3 },
          { answer: currentActiveQuestionObject.answer4, key: 'answer4', 'answer4': currentActiveQuestionObject.answer4 }
        ]
        this.setState({
          shuffledQuizQuestions: this.shuffle(quizQuestions),
          questionsShuffled: true
        }, () => {
          let tmpArrQuestions = this.state.allAnsweredQuestions
          tmpArrQuestions.push(currentActiveQuestionObject.question)
          this.setState({ allAnsweredQuestions: tmpArrQuestions })
          this.state.shuffledQuizQuestions.map((question) => {
            if (question.key === 'answer1') {
              let tmpArr = this.state.allAnswerCompare
              tmpArr.push(question.answer)
              this.setState({ allAnswerCompare: tmpArr })
            }
          })
        })
      }

      return (
          <div id="question">

            <div className="question-section-1">
              <h1 className="question-count">Question {this.state.currentActiveQuestion + 1} of {this.state.quizQuestions.length}</h1>

              {currentActiveQuestionObject.questionImage !== 'none'
                  ? <div className="question-image">
                    <img src={currentActiveQuestionObject.questionImage}/>
                  </div>
                  : ''
              }

              <h1 className="question-asked">
                {currentActiveQuestionObject.question}
              </h1>
            </div>

            <div className="question-section-2">
              <div id="countdown">
                <div id="countdown-number">{ this.state.questionTimer }</div>
                <svg>
                  <circle r="18" cx="20" cy="20"/>
                </svg>
              </div>
            </div>

            <div className={`answer ${this.state.shuffledQuizQuestions[0].key}`} onMouseLeave={this.changeBackgroundColor.bind(this, 'leave')} onMouseEnter={this.changeBackgroundColor.bind(this, 'enter')} onClick={this.submitAnswer.bind(this, this.state.shuffledQuizQuestions[0].key, this.state.shuffledQuizQuestions[0].answer)}>
              <div className="letter"><span>A</span></div>
              <h2>{this.state.shuffledQuizQuestions[0].answer}</h2>
            </div>
            <div className={`answer ${this.state.shuffledQuizQuestions[1].key}`} onMouseLeave={this.changeBackgroundColor.bind(this, 'leave')} onMouseEnter={this.changeBackgroundColor.bind(this, 'enter')} onClick={this.submitAnswer.bind(this, this.state.shuffledQuizQuestions[1].key, this.state.shuffledQuizQuestions[1].answer)}>
              <div className="letter"><span>B</span></div>
              <h2>{this.state.shuffledQuizQuestions[1].answer}</h2>
            </div>
            <div className={`answer ${this.state.shuffledQuizQuestions[2].key}`} onMouseLeave={this.changeBackgroundColor.bind(this, 'leave')} onMouseEnter={this.changeBackgroundColor.bind(this, 'enter')} onClick={this.submitAnswer.bind(this, this.state.shuffledQuizQuestions[2].key, this.state.shuffledQuizQuestions[2].answer)}>
              <div className="letter"><span>C</span></div>
              <h2>{this.state.shuffledQuizQuestions[2].answer}</h2>
            </div>
            <div style={{ borderBottomRightRadius: '0.5em', borderBottomLeftRadius: '0.5em' }} className={`answer ${this.state.shuffledQuizQuestions[3].key}`} onMouseLeave={this.changeBackgroundColor.bind(this, 'leave')} onMouseEnter={this.changeBackgroundColor.bind(this, 'enter')} onClick={this.submitAnswer.bind(this, this.state.shuffledQuizQuestions[3].key, this.state.shuffledQuizQuestions[3].answer)}>
              <div className="letter"><span>D</span></div>
              <h2>{this.state.shuffledQuizQuestions[3].answer}</h2>
            </div>
          </div>
      )
    }
  }

  renderQuizGameUI () {
    const renderQuizQuestions = this.renderQuizQuestions()

    return (
        <div>
          <div className="user">
            <h1>{ myName }</h1>
            <p>{this.state.yourScore}</p>
          </div>
          <div className="all-questions">
            <div className="text" />
            {renderQuizQuestions}
          </div>
        </div>
    )
  }

  redirectToSignUp () {
    Router.pushRoute('/register')
  }

  redirectToAction (action, history) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    action === 'again'
        ? window.location.reload()
        : Router.pushRoute('/')
  }

  renderEndGameResults () {
    // modal to show for end game
    if (this.state.gameOver) {
      let results = null
      const correctAnswers = this.state.yourScore !== 0
          ? String(this.state.yourScore).slice(0, -1)
          : String(0)
      const totalQuestions = String(this.state.quizQuestions.length);
      let score = correctAnswers + ' / ' + totalQuestions;
      return (
          <div id='results-page'>
            <img className='results-page-img' src='/static/images/icons/win.svg' />
            <div className='text-container'>
              <h1 className="grade"><span>{this.state.grade}</span></h1>
              <h1><img src='/static/images/icons/diamond.svg' />{this.state.yourScore} points</h1>

              { !this.props.isAuthenticated ?
                  <h2>
                    <span onClick={this.redirectToSignUp.bind(this)}>Sign Up </span>
                    to save your score and compete against others!
                  </h2>
                  :
                  null
              }
              <p>You scored a {score}</p>
              <div className="show-wrong-container">
                <h1>Your results</h1>
                {this.state.allAnswered.map((answer, i) => (
                    <div className="show-wrong">
                      <h1>{this.state.allAnsweredQuestions[i]}</h1>
                      <p>Correct Answer <span style={{ color: '#2FDC7F' }}>{this.state.allAnswerCompare[i]}</span></p>
                      { this.state.allAnswerCompare[i] === this.state.allAnswered[i] ?
                          <div>
                            <p>Your answer was correct!
                              <span style={{ color: '#2FDC7F' }}> +10</span>
                            </p>
                          </div>
                          :
                          <p>Your Answer <span style={{ color: '#ec526d' }}>{this.state.allAnswered[i]}</span></p>
                      }
                    </div>
                ))}
              </div>
              <button onClick={this.redirectToAction.bind(this, 'again')}>Play Again</button>
              <button onClick={this.redirectToAction.bind(this, 'explore')}>Explore</button>
            </div>
          </div>
      )
    }
  }

  renderQuestionCorrect () {

  }

  renderQuizSection () {
    const renderQuizGameUI = this.renderQuizGameUI()
    const renderEndGameResults = this.renderEndGameResults()
    return (
        <div id="quiz-game">
          { this.state.gameOver ? renderEndGameResults : renderQuizGameUI }
        </div>
    )
  }

  getParams (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  render () {
    const renderQuizSection = this.renderQuizSection();

    return (
        <div id="quiz-real-time-traditional">
          { renderQuizSection }
        </div>
    );
  }

}

export default SinglePlayerAnswerChoiceQuizGameComponent
