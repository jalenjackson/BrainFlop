import React from 'react'
import $ from 'jquery'
import _ from 'lodash';
import TimelineMax from "gsap/TimelineMax";
import TweenMax, {Power4} from "gsap/TweenMax";
let quizId = null;
let SplitText = null;

export default class PersonalityQuizGameComponent extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      questions: this.props.personalityQuizData.personalityQuizQuestions,
      selectedAnswers: {},
      results: this.props.personalityQuizData.personalityQuiz.personalityResults,
      FinalResult: '',
      quiz: this.props.personalityQuizData.personalityQuiz,
      questionsRendered: false,
      resultButtonText: 'SEE RESULTS'
    };
    quizId = this.props.pathName.split('/')[5].split('?')[0];
  }

  getRandomColor () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  componentDidMount () {
    $(".fb-comments").attr("data-href", window.location.href);
    SplitText = require("../../gsap/SplitText");
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
      });
      this.state.results.map((result) => {
        if (result.id === highestScoreId) {
          this.setState({ finalResult: result.title, resultButtonText: 'SEE RESULTS' }, () => {
            const T1Split = new SplitText(
                '.results-modal p',
                {type: 'words'}
            );
            const T1Animation = new TimelineMax()
            TweenMax.set(
                '#split',
                {opacity: 1}
            );
            T1Animation.staggerFrom(
                T1Split.words,
                0.2,
                {
                  y: 10,
                  opacity: 0,
                  ease: Power4.easeOut,
                  delay: 0.4
                },
                0.01, '+=0');
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
    return (
      <div id="personality-quiz-game">
        <div id='personality-quiz-play'>
          <div className="title">
            <h1>{_.startCase(_.toLower(this.state.quiz.title))}</h1>
          </div>
          <div>
            {questions}
            <button onClick={this.calculateScore.bind(this)}>{this.state.resultButtonText}</button>
          </div>
        </div>
        <div className='results-modal-container'>
          <div className='results-modal'>
            <p>{this.state.finalResult}</p>
          </div>
        </div>
        <div className="fb-comments" data-href={this.props.router.asPath} data-width="470" data-num-posts="10" />
      </div>
    )
  }
}