import React, { Component } from 'react';
import PubNubReact from 'pubnub-react';
import {Power4} from 'gsap/all';
import {Router} from '../../../routes';
import TimelineMax from 'gsap/TimelineMax';
import TweenMax from 'gsap/TweenMax';
import SearchingLoader from '../searchingLoader';
import $ from 'jquery';
import Cookies from 'universal-cookie';
import ReactGA from "react-ga";
let SplitText = null;
require('es6-promise').polyfill();
require('isomorphic-fetch');

let uuid = null;
let quizId = null;
let channel = null;

class QuizRealTimeTraditional extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playersInLobby: 0,
      playersInGame: 0,
      status: 'available',
      opponent: '',
      opponentFound: false,
      quizQuestions: [],
      currentActiveQuestion: 0,
      shouldRenderQuizQuestions: false,
      countDownTimer: 5,
      youAnswered: false,
      opponentAnswered: false,
      opponentAnswerChoice: null,
      gameOver: false,
      isAnimating: true,
      submittedAnswer: false,
      yourScore: 0,
      opponentScore: 0,
      timer: 0,
      questionTimer: 10,
      startingCountdown: true,
      questionsShuffled: false,
      shuffledQuizQuestions: ['', '', '', ''],
      opponentLeft: false,
      opponentName: '',
      opponentAnswer: '',
      questionAboutToTransition: false,
      questionAboutToTransitionTimer: 3,
      timeToReadFinished: false,
      timeToReadCounter: 0,
      currentTimeToReadCounterSet: false,
      allAnsweredQuestions: [],
      allAnswered: [],
      allAnswerCompare: [],
      grade: null,
      opponentTimerHit0: false,
      yourTimerHit0: false
    };

    uuid = this.props.isAuthenticated ? this.props.userObject.userId : null;
    quizId = this.props.pathName.split('/')[6].split('?')[0];
    channel = quizId;

    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-dfb943ec-8bac-4d2e-be38-d28503ff79fd',
      subscribeKey: 'sub-c-9c5ace5a-ccf6-11e8-b5de-7a9ddb77e130',
      uuid,
    });

    this.pubnub.setState(
      {
        state: {
          busy: false,
          answeredQuestion: false,
          screenName: this.props.userObject.name
        },
        uuid,
        channels: [channel],
      },
    );

    setTimeout(() => {
      this.pubnub.subscribe({
        channels: [channel],
        withPresence: true,
        restore: false,
      });
    }, 500);


    this.pubnub.init(this);
  }

  tick () {
    if (!this.state.timeToReadFinished && this.state.shouldRenderQuizQuestions && !this.state.isAnimating && !this.state.questionAboutToTransition) {
      $('#countdown-number').css({ color: 'rgb(100, 100, 100)' })
      if (!this.state.currentTimeToReadCounterSet) {
        let moreTime = 5000
        if (this.state.quizQuestions[this.state.currentActiveQuestion].questionImage !== 'none') {
          moreTime = 8000
        }
        this.setState({ timeToReadCounter: Math.round(this.state.quizQuestions[this.state.currentActiveQuestion].timeToRead) + moreTime }, () => {
          this.setState({ currentTimeToReadCounterSet: true })
        })
      }
      if (this.state.currentTimeToReadCounterSet) {
        this.setState({ timeToReadCounter: this.state.timeToReadCounter - 1000 }, () => {
          $('#countdown').css({
            '-webkit-animation': 'pulsate 1s infinite',
            'animation': 'pulsate 1s infinite'
          });
          if (this.state.timeToReadCounter < -1000) {
            $('#countdown-number').css({ color: '#ec526d' })
            $('#countdown').css({ animation: 'none' })
            $('#countdown svg circle').css({ animation: 'countdown 10s linear 1 forwards' })
            this.setState({
              timeToReadFinished: true,
              currentTimeToReadCounterSet: false,
            })
          }
        })
      }
    }

    if (this.state.questionAboutToTransition) {
      this.setState({ timeToReadFinished: false })
      this.setState({ questionAboutToTransitionTimer: this.state.questionAboutToTransitionTimer - 1 }, () => {
        if (this.state.questionAboutToTransitionTimer < 0) {
          $('.answer').css({ background: 'none' });
          $('.answer h1').css({ color: 'rgb(80, 80, 85)' });
          $('.letter').css({color: 'rgb(200,200,200)'})
          this.setState({
            currentActiveQuestion: this.state.currentActiveQuestion + 1,
            questionAboutToTransition: false,
            questionAboutToTransitionTimer: 3,
            questionTimer: 10,
            submittedAnswer: false,
            youAnswered: false,
            opponentAnswered: false,
            startingCountdown: true,
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
          });
        }
      })
    }

    if (this.state.shouldRenderQuizQuestions && !this.state.isAnimating && !this.state.questionAboutToTransition && this.state.timeToReadFinished) {
      if (this.state.startingCountdown) {
        $('#countdown svg circle').css({ animation: 'countdown 10s linear 1 forwards' })
        this.setState({ startingCountdown: false })
      }
      this.setState({ questionTimer: this.state.questionTimer - 1 }, () => {
        if (this.state.questionTimer < 0) {
          if (this.state.currentActiveQuestion >= this.state.quizQuestions.length - 1) {
            this.setState({
              gameOver: true
            })
          } else {
            this.setState({ questionTimer: 0 });
            this.pubnub.publish({
              message: {
                status: {
                  operation: 'CHECK_TIMERS_ARE_BOTH_AT_0',
                },
                uuid,
                payload: {
                  uuid,
                }
              },
              channel,
            });
          }
        }
      })
    }
  }

  async componentWillMount() {
    this.timer = setInterval(this.tick.bind(this), 1000);
    this.pubnub.getMessage(channel, (data) => {
      switch(data.message.status.operation) {
        case 'PNSubscribeOperation': {
          if (data.message.uuid === this.state.opponent) {
            this.setState({ gameOver: true, opponentLeft: true })
          }
          if (data.publisher === uuid && !this.state.opponentFound) {
            this.pubnub.hereNow(
              {
                channels: [channel],
                includeUUIDs: true,
                includeState: true,
              },
              (status, response) => {
                const usersInLobby = response.channels[channel].occupants;
                const matches = [];

                for (let i = usersInLobby.length - 1; i >= 0; i--) {
                  if (usersInLobby[i].uuid !== uuid && usersInLobby[i].state && !usersInLobby[i].state.busy) {
                    matches.push(usersInLobby[i]);
                  }
                }
                if (matches.length > 0) {
                  const randomUser = matches[Math.floor(Math.random() * matches.length)];


                  this.pubnub.publish({
                    message: {
                      status: {
                        operation: 'SET_UP_NEW_GAME',
                      },
                      uuid,
                      payload: {
                        uuid,
                        questions: this.state.quizQuestions,
                        opponentName: this.props.userObject.name,
                        target: randomUser.uuid
                      }
                    },
                    channel,
                  });

                  this.pubnub.setState(
                    {
                      state: {
                        busy: true,
                      },
                      uuid,
                      channels: [channel],
                    },
                  );
                  this.setState({
                    status: 'busy',
                    opponent: randomUser.uuid,
                    opponentName: randomUser.state.screenName,
                    opponentFound: true,
                  });
                }
              },
            );
          }
          break;
        }
        case 'CHECK_TIMERS_ARE_BOTH_AT_0': {
          if (data.message.payload.uuid === this.state.opponent) {
            this.setState({ opponentTimerHit0: true })
          }
          if (data.message.payload.uuid === uuid) {
            this.setState({ yourTimerHit0: true })
          }
          if (this.state.yourTimerHit0 && this.state.opponentTimerHit0) {
            $('#countdown svg circle').css({ animation: 'none' })
            $('.answer').css({ background: 'none' });
            $('.answer h1').css({ color: 'rgb(80, 80, 85)' });
            $('.letter').css({color: 'rgb(200,200,200)'})
            this.setState({
              submittedAnswer: false,
              youAnswered: false,
              opponentAnswered: false,
              currentActiveQuestion: this.state.currentActiveQuestion + 1,
              questionTimer: 10,
              startingCountdown: true,
              questionsShuffled: false,
              timeToReadFinished: false,
              yourTimerHit0: false,
              opponentTimerHit0: false
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
          break;
        }
        case 'SET_UP_NEW_GAME': {
          if (data.message.payload.target === uuid || data.message.payload.uuid === uuid) {
            if (data.message.payload.target === uuid) {
              this.pubnub.setState(
                {
                  state: {
                    busy: true,
                  },
                  uuid: data.message.payload.target,
                  channels: [channel],
                },
              );
              this.setState({
                status: 'busy',
                opponent: data.message.payload.uuid,
                quizQuestions: data.message.payload.questions,
                opponentName: data.message.payload.opponentName,
                opponentFound: true,
              });
            }
            this.pubnub.publish({
              message: {
                status: {
                  operation: 'START_GAME',
                },
                payload: {
                  uuid,
                  opponent: data.message.payload.uuid,
                },
              },
              channel,
            });
          }
          break;
        }
        case 'START_GAME': {
          if (data.message.payload.target === uuid || data.message.payload.uuid === uuid) {
            this.startTimer();
          }
          break;
        }
        case 'SUBMIT_ANSWER': {
          if (data.message.payload.target === uuid || data.message.payload.uuid === uuid) {
            if (data.message.payload.uuid === uuid) {
              this.setState({youAnswered: true});
              $('.user p').css({ transform: 'translate(10px, -10px) scale(1.3)', color: `${data.message.payload.answerData.correct ? '#2FDC7F' : '#ec526d'}` });
              setTimeout(() => {
                $('.user p').css({ transform: 'translate(0px, -10px) scale(1)', color: 'rgb(80, 80, 85)' })
              }, 600)
            }
            if (data.message.payload.uuid === this.state.opponent) {
              this.setState({
                opponentScore: data.message.payload.opponentScore,
                opponentAnswer: data.message.payload.answerData.answer ,
              });
              $('.opponent p').css({ transform: 'translate(10px, -10px) scale(1.3)', color: `${data.message.payload.answerData.correct ? '#2FDC7F' : '#ec526d'}` });
              setTimeout(() => {
                $('.opponent p').css({ transform: 'translate(0px, -10px) scale(1)', color: 'rgb(80, 80, 85)' })
              }, 600)
              if (data.message.payload.answerData.answer === 'answer1') {
                $('.user p').css({ color: '#2FDC7F' })
                setTimeout(() => {
                  $('.user p').css({ color: 'rgb(80, 80, 85)' })
                }, 600)
              } else {
                $('.user p').css({ color: '#DE346B' })
                setTimeout(() => {
                  $('.user p').css({ color: 'rgb(80, 80, 85)' })
                }, 600)
              }
              this.setState({
                opponentAnswered: true,
                opponentAnswerChoice: data.message.payload.answerData.answerChoice,
              });
            }
            break;
          }
        }
      }
    });

    this.pubnub.getPresence(channel, (presence) => {
      if (presence.action === 'join') {
        this.setState({ playersInLobby: presence.occupancy });
      }
      if (presence.action === 'leave') {
        this.setState({ playersInLobby: presence.occupancy });
        if (presence.uuid === this.state.opponent) {
          this.setState({ gameOver: true, opponentLeft: true })
        }
      }
    });

    this.pubnub.getStatus((status) => {
      this.pubnub.publish({
        message: { status, uuid },
        channel,
      });
    });
  }

  numberWithCommas (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  componentDidUpdate() {
    if (!this.state.gameOver) {
      if (this.state.youAnswered && this.state.opponentAnswered && !this.state.questionAboutToTransition) {
        if (this.state.currentActiveQuestion >= this.state.quizQuestions.length - 1) {
          this.setState({
            gameOver: true
          })

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
              const correctAnswers = String(this.state.yourScore).slice(0, -1);
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
                      $('.navbar-points').html(this.numberWithCommas(body.user.points)).css({ transform: 'translate(45px, 3px) scale(1.5)', color: '#2FDC7F' })
                      setTimeout(() => {
                        $('.navbar-points').html(this.numberWithCommas(body.user.points)).css({ transform: 'translate(45px, 3px) scale(1)', color: 'rgb(200, 190, 190)' })
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
                      }).catch(() => {
                        window.location.href = '/error'
                      })
                    }
                  })
                }).catch(() => {
                  window.location.href = '/error'
                })
              }
            })
          }).catch(() => {
            window.location.href = '/error'
          })
        } else {
          this.setState({
            questionAboutToTransition: true
          });
          $('#countdown svg circle').css({ animation: 'none' })
          $(`.${this.state.opponentAnswer}`).css({ background: 'rgb(255, 200, 200)' });
          $(`.${this.state.opponentAnswer} h2`).html(`${this.state.opponentAnswer === 'answer1' ? this.state.opponentName + ' was correct!' : this.state.opponentName + ' answered incorrectly'}. <span>${this.state.opponentAnswerChoice}</span>`)
        }
      }
    }
  }

  startTimer = () => {
    setInterval(this.countDown.bind(this), 1000);
  };

  async countDown() {
    if (process.browser) {
      if (this.state.countDownTimer > 0) {
        let countDownTimer = this.state.countDownTimer - 1;
        await this.setState({countDownTimer});
      } else {
        this.setState({
          shouldRenderQuizQuestions: true,
          isAnimating: false,
        }, () => {
          $('body').css({background: 'linear-gradient(rgb(255,245,245), rgb(200, 150, 150)) fixed'});
        });
      }
    }
  }

  updateTimer() {
    if (this.state.shouldRenderQuizQuestions) {
      this.setState({ timer: this.state.quizQuestions[this.state.currentActiveQuestion].timer });
    }
  }

  componentDidMount() {
    SplitText = require("../../gsap/SplitText");
    ReactGA.initialize('UA-129744457-1')
    ReactGA.pageview(window.location.pathname);
    this.interval = setInterval(() => this.updateTimer(), 1000);
    window.addEventListener('beforeunload', this.leaveQuizGame);

    fetch(`https://api.quizop.com/questions/get-quiz-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ quizId }),
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ quizQuestions: body.questions });
      });
    }).catch(() => {
      window.location.href = '/error'
    })
  }

  componentWillUnmount() {
    this.leaveQuizGame();
    $('body').css({ background: 'white'});
  }

  leaveQuizGame() {
    this.pubnub.unsubscribe({
      channels: [channel],
    });
  }

  submitAnswer(answer, answerText, e) {
    if (!this.state.submittedAnswer) {
      let tmpArr = this.state.allAnswered;
      tmpArr.push(answerText)
      this.setState({ allAnswered: tmpArr });
      this.setState({ submittedAnswer: true });
      const answerChoice = answerText;
      let yourScore = this.state.yourScore;

      let answerData = null;
      if (answer === 'answer1') {
        $('.letter').css({color: 'rgb(230, 230, 230)'});
        $(e.currentTarget).css({background: '#2FDC7F'});
        $(e.currentTarget).find('.letter').css({color: '#2FDC7F'});
        yourScore += 10;
        answerData = {correct: true, answer, answerChoice};
      } else {
        $('.letter').css({color: 'rgb(230, 230, 230)'});
        $(e.currentTarget).css({background: '#FD7479'});
        $(e.currentTarget).find('.letter').css({color: '#FD7479'});
        answerData = {correct: false, answer, answerChoice};
      }

      this.setState({ yourScore }, () => {
        this.pubnub.publish({
          message: {
            status: {
              operation: 'SUBMIT_ANSWER',
            },
            payload: {
              answerData,
              opponentScore: this.state.yourScore,
              uuid,
              target: this.state.opponent
            }
          },
          channel,
        });
      });
    }
  }

  shuffle (a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x
    }
    return a
  }

  changeBackgroundColor(protocol, e) {
    if (!this.state.submittedAnswer) {
      protocol === 'enter'
        ? e.currentTarget.style.backgroundColor = "rgb(255,245,245)"
        : e.currentTarget.style.backgroundColor = "white"
    }
  }

  renderQuizQuestions() {
    if (this.state.quizQuestions.length > 0 && this.state.shouldRenderQuizQuestions) {
      let currentActiveQuestionObject = this.state.quizQuestions[this.state.currentActiveQuestion];
      if (!this.state.questionsShuffled) {
        let quizQuestions = [
          { answer: currentActiveQuestionObject.answer1, key: 'answer1' },
          { answer: currentActiveQuestionObject.answer2, key: 'answer2' },
          { answer: currentActiveQuestionObject.answer3, key: 'answer3' },
          { answer: currentActiveQuestionObject.answer4, key: 'answer4' }
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
        });
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
          <div className={`answer ${this.state.shuffledQuizQuestions[3].key}`} onMouseLeave={this.changeBackgroundColor.bind(this, 'leave')} onMouseEnter={this.changeBackgroundColor.bind(this, 'enter')} onClick={this.submitAnswer.bind(this, this.state.shuffledQuizQuestions[3].key, this.state.shuffledQuizQuestions[3].answer)}>
            <div className="letter"><span>D</span></div>
            <h2>{this.state.shuffledQuizQuestions[3].answer}</h2>
          </div>
        </div>
      )
    }
  }

  renderQuizGameUI() {
    const renderQuizQuestions = this.renderQuizQuestions();

    return (
      <div>
        <div className="user">
          <h1>{this.props.userObject.name}</h1>
          <p>{this.state.yourScore} points</p>
        </div>
        <div className="opponent">
          <h1>{this.state.opponentName}</h1>
          <p>{this.state.opponentScore} points</p>
        </div>
        <div className="all-questions">
          {renderQuizQuestions}
        </div>
      </div>
    )
  }

  redirectToSignUp (history) {
    history.push('/register')
  }

  redirectToAction (action) {
    $("html, body").animate({ scrollTop: 0 }, 350);
    action === 'again'
      ? window.location.reload()
      : Router.pushRoute('/')
  }

  renderEndGameResults() {
    if (this.state.gameOver) {
      const correctAnswers = this.state.yourScore !== 0
        ? String(this.state.yourScore).slice(0, -1)
        : String(0)
      const totalQuestions = String(this.state.quizQuestions.length);
      let score = correctAnswers + ' / ' + totalQuestions;

      $("#quiz-real-time-traditional").css({ marginTop: '70px' })
      let results = null

      if (this.state.yourScore > this.state.opponentScore || this.state.opponentLeft) {
        results = `Congrats you won! you earned ${this.state.yourScore} points`
        if (this.state.opponentLeft) {
          results = `It looks like your opponent left, so you win! you earned ${this.state.yourScore} points`
        }
      } else if (this.state.yourScore === this.state.opponentScore) {
        results = `It was a tie! you earned ${this.state.yourScore} points`
      } else {
        results = `Sorry you lost! You earned ${this.state.yourScore} points`
      }

      return (
        <div className="online-results-page" id='results-page'>
          <img className='results-page-img' src='/static/images/icons/win.svg' />
          <div className='text-container'>
            <h1 className="grade"><span>{this.state.grade}</span></h1>
            <h1><img src='/static/images/icons/diamond.svg' />{results}</h1>

            <p>You scored a {score}</p>
            <div className="show-wrong-container">
              { this.state.allAnswered.length > 0 ?
                <h1>Your results</h1>
                :
                null
              }
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

  renderQuizSection() {
    const renderQuizGameUI = this.renderQuizGameUI();
    const renderEndGameResults = this.renderEndGameResults();
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

  render() {
    const renderQuizSection = this.renderQuizSection();

    return (
      <div id="quiz-real-time-traditional">
        { !this.props.isAuthenticated ? <Redirect to="/explore" /> : null }
        { this.state.isAnimating || !this.state.opponentFound ? <SearchingLoader countdown={this.state.countDownTimer} opponentFound={this.state.opponentFound} isInvite={false} /> : renderQuizSection }
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default QuizRealTimeTraditional;