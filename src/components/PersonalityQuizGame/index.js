import React from 'react'
import $ from 'jquery'
import _ from 'lodash';
let quizId = null;

export default class PersonalityQuizGameComponent extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      questions: [],
      selectedAnswers: {},
      results: [],
      FinalResult: '',
      quiz: {},
      questionsRendered: false,
      resultButtonText: 'SEE RESULTS'
    };
    quizId = this.props.router.query.quizId;
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

  getRandomColor () {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  componentDidMount () {
    fetch(`https://api.quizop.com/quizzes/${quizId}`, {
      method: 'GET'
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ results: body.quiz.personalityResults, quiz: body.quiz })
      })
    }).catch((err) => {
      console.log(err)
    });

    fetch(`https://api.quizop.com/questions/get-personality-quiz-questions`, {
      method: 'POST',
      body: JSON.stringify({ quizId: quizId }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ questions: body.questions }, () => {
          this.setState({ questionsRendered: true })
        })
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  selectAnswer (questionKey, answerData, e) {
    $(`.${questionKey}`).removeClass('selected-answer')
    $(`.${questionKey}`).children(0).css('color', 'rgb(150, 150, 150)')
    this.setState({ resultButtonText: "SEE RESULTS" })
    $(e.currentTarget).addClass('selected-answer')
    $(e.currentTarget).children(0).css('color', 'white')
    const tmpObj = this.state.selectedAnswers
    tmpObj[questionKey] = answerData
    this.setState({ selectedAnswers: tmpObj })
  }

  renderQuestions () {
    return this.state.questions.map((question, i) => (
      <div className='question-main-container'>
        <div className='question-container'>
          { question.questionImage ? <img className='question-image' alt='Question Image' src={question.questionImage} /> : null }
          <h1>{question.personalityQuestion}</h1>
          {question.personalityAnswers.map((personalityAnswer) => (
            <div onClick={this.selectAnswer.bind(this, `personalityQuestion${i + 1}`, personalityAnswer.resultsArr)} style={{ borderBottom: `2px solid ${this.getRandomColor()}` }} className={`question personalityQuestion${i + 1} answer`}>
              <p>{personalityAnswer.answerText}</p>
            </div>
          ))}
        </div>
        {i === this.state.questions.length - 1
          ? null
          : <img className='underline' src='/static/images/icons/squiggly.svg' />
        }
      </div>
    ))
  }

  calculateScore () {
    if (Object.keys(this.state.selectedAnswers).length === this.state.questions.length) {
      let testResults = {}
      const selectedAnswers = this.state.selectedAnswers

      for (var i = 0; i < Object.keys(selectedAnswers).length; i++) {
        selectedAnswers['personalityQuestion' + (i + 1)].map((results) => {
          testResults.hasOwnProperty(results.id)
            ? testResults[results.id] += Number(results.matchPoints)
            : testResults[results.id] = Number(results.matchPoints)
        })
      }
      let highestScoreId = Object.keys(testResults).reduce(function (a, b) {
        return testResults[a] > testResults[b] ? a : b
      })
      this.state.results.map((result) => {
        if (result.id === highestScoreId) {
          this.setState({ finalResult: result.title, resultButtonText: 'SEE RESULTS' }, () => {
            $('.results-modal-container').css({ pointerEvents: 'auto', opacity: 1 })
          })
        }
      })
    } else {
      this.setState({ resultButtonText: "You Didn't Answer All Of The Questions Yet" })
    }
  }

  render () {
    const questions = this.renderQuestions()
    const contentLoader = this.renderContentLoader()
    return (
      <div id="personality-quiz-game">
        <div id='personality-quiz-play'>
          <div className="title">
            <h1>{_.startCase(_.toLower(this.state.quiz.title))}</h1>
          </div>
          {this.state.questionsRendered
            ? <div>
              {questions}
              <button onClick={this.calculateScore.bind(this)}>{this.state.resultButtonText}</button>
            </div>
            : contentLoader
          }
        </div>
        <div className='results-modal-container'>
          <div className='results-modal'>
            <h1 className='modal-header'>Your Result</h1>
            <h2>You may die of heart disease and win the lottery</h2>
          </div>
        </div>
      </div>
    )
  }
}