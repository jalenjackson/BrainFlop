import React from 'react'
import $ from 'jquery'
import ReactGA from "react-ga";
import {verifyFrontEndAuthentication} from "../verifyFrontEndAuthentication";
var SpeechRecognition = null;
var recognition = null;
let isError = false;
let userData = {};
let host = null;

class EditQuiz extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'question': '',
      'answer1': '',
      'answer2': '',
      'answer3': '',
      'answer4': '',
      addedQuestions: [],
      quizData: false,
      addingQuestion: false,
      editingQuestion: false,
      editingQuestionId: false,
      isFileIncluded: false,
      questionImage: '',
      questionAutocompleteResults: [],
      'editingTitleField': false,
      'editingTagField': false,
      'editingParagraphField': false,
      title: '',
      description: '',
      renderAutoCompleteResults: false,
      addQuestionText: 'ADD QUESTION',
      questionsFetched: false,
      editTagValue: ''
    };
    userData = verifyFrontEndAuthentication(this.props.userObject, this.props.isAuthenticated);
  }

  componentDidMount () {
    host = window.location.protocol + '//' + window.location.host;
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(`/quiz/edit/${this.props.router.query.quizId}`);
    fetch(`${host}/api/quizzes/${this.props.router.query.quizId}`, {
      method: 'GET'
    }).then((response) => {
      response.json().then((body) => {
        if (!body.quiz || body.quiz === undefined || body.quiz.userId !== userData.userObject.userId) {
          window.location.href = '/'
        }
        this.setState({ quizData: body, title: body.quiz.title, description: body.quiz.description, editTagValue: body.quiz.tags })
      })
    }).catch((err) => {
      console.log(err)
    });

    fetch(`${host}/api/questions/get-quiz-questions`, {
      method: 'POST',
      body: JSON.stringify({ quizId: this.props.router.query.quizId, usingForEdit: true }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ addedQuestions: body.questions, questionsFetched: true })
      });
    }).catch((err) => {
      console.log(err)
    })
  }

  setQuestionValue (key, e) {
    this.setState({
      [key]: e.target.value,
      renderAutoCompleteResults: true
    }, () => {
      if (key === 'question' && this.state.question !== '') {
        fetch(`${host}/api/search/questions?term=${encodeURIComponent(this.state.question)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
          response.json().then((body) => {
            this.setState({ questionAutocompleteResults: body.questionsFound })
          })
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.setState({
          renderAutoCompleteResults: false
        })
      }
    })
  }

  submitQuestion () {
    if (this.state.question && this.state.answer1 && this.state.answer2 && this.state.answer3 && this.state.answer4) {
      const data = {
        quizId: this.props.router.query.quizId,
        question: this.state.question,
        answer1: this.state.answer1,
        answer2: this.state.answer2,
        answer3: this.state.answer3,
        answer4: this.state.answer4
      };
      let dataWithFile = null
      if (this.state.isFileIncluded) {
        dataWithFile = new FormData
        dataWithFile.append('quizId', this.props.router.query.quizId)
        dataWithFile.append('question', this.state.question)
        dataWithFile.append('answer1', this.state.answer1)
        dataWithFile.append('answer2', this.state.answer2)
        dataWithFile.append('answer3', this.state.answer3)
        dataWithFile.append('answer4', this.state.answer4)
        dataWithFile.append('questionImage', $('.file-upload')[0].files[0])
      }

      const headers = this.state.isFileIncluded ? {
        'Authorization': `Bearer ${userData.userObject.token}`
      } : {
        'Authorization': `Bearer ${userData.userObject.token}`,
        'Content-Type': 'application/json'
      }

      const body = this.state.isFileIncluded
        ? dataWithFile
        : JSON.stringify(data)

      $('.loader').css({ opacity: 1 })

      fetch(`${host}/api/questions`, {
        method: 'POST',
        body,
        headers
      }).then((response) => {
        response.json().then((body) => {
          this.setState({ question: '', answer1: '', answer2: '', answer3: '', answer4: '', isFileIncluded: false })
          let tmpArr = this.state.addedQuestions
          let newQuestion = {
            _id: body.createdQuestion._id,
            answer1: body.createdQuestion.answer1,
            answer2: body.createdQuestion.answer2,
            answer3: body.createdQuestion.answer3,
            answer4: body.createdQuestion.answer4,
            question: body.createdQuestion.question,
            questionImage: body.createdQuestion.questionImage,
            quiz: body.createdQuestion.quiz
          }
          tmpArr.push(newQuestion)
          this.setState({
            addedQuestions: tmpArr,
          });
          $('.file-upload-wrapper').attr('data-text', 'Add an optional image!');
          $('.file-upload').val('');
          this.closeAddQuestionModal();
          ReactGA.event({
            category: 'User',
            action: `${userData.userObject.name} succesfully added a new question!`
          })
          $('.loader').css({ opacity: 0 });
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  async showAddQuestionModal (protocol, questionId, question, answer1, answer2, answer3, answer4, questionImage) {
    if (protocol === 'add') {
      await this.setState({
        addingQuestion: true,
        editingQuestion: false,
        question: '',
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        questionImage: '',
        addQuestionText: 'ADD QUESTION'
      })
    } else {
      const isFileIncluded = questionImage !== 'none'
      await this.setState({
        addingQuestion: false,
        editingQuestion: true,
        editingQuestionId: questionId,
        question,
        answer1,
        answer2,
        answer3,
        answer4,
        questionImage,
        isFileIncluded,
        addQuestionText: 'EDIT QUESTION'
      })
    }
    $('.add-question-modal').css({ opacity: '1', pointerEvents: 'auto' })
  }

  closeAddQuestionModal () {
    $('.add-question-modal').css({ opacity: '0', pointerEvents: 'none' })
  }

  deleteQuestion (questionId, e) {
    e.stopPropagation()
    fetch(`${host}/api/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userData.userObject.token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      response.json().then((body) => {
        let tmpArray = this.state.addedQuestions.filter((obj) => {
          return obj._id !== questionId
        })
        this.setState({ addedQuestions: tmpArray })
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  editQuestion () {
    const data = {
      quizId: this.props.router.query.quizId,
      question: this.state.question,
      answer1: this.state.answer1,
      answer2: this.state.answer2,
      answer3: this.state.answer3,
      answer4: this.state.answer4
    }
    $('.loader').css({ opacity: 1 })

    fetch(`${host}/api/questions/${this.state.editingQuestionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userData.userObject.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => {
      response.json().then(() => {
        this.state.addedQuestions.filter((obj) => {
          if (obj._id === this.state.editingQuestionId) {
            obj.question = this.state.question
            obj.answer1 = this.state.answer1
            obj.answer2 = this.state.answer2
            obj.answer3 = this.state.answer3
            obj.answer4 = this.state.answer4
          }
        })
        this.setState({ question: '', answer1: '', answer2: '', answer3: '', answer4: '' })
        this.closeAddQuestionModal()
        $('.loader').css({ opacity: 0 })
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  renderAddedQuestions () {
    if (this.state.addedQuestions.length > 0) {
      return this.state.addedQuestions.map(question => (
        <div>
          <div onClick={this.showAddQuestionModal.bind(this, 'edit', question._id, question.question, question.answer1, question.answer2, question.answer3, question.answer4, question.questionImage)} className="question card">
            <img className="trashcan" onClick={this.deleteQuestion.bind(this, question._id)} src='/static/images/icons/trashcan.svg' />
            <div className="inner-text">
              <h1>{question.question}</h1>
              <div className="answers">
                <div className="added-answers correct-added-question">{question.answer1}</div>
                <div className="added-answers">{question.answer2}</div>
                <div className="added-answers">{question.answer3}</div>
                <div className="added-answers">{question.answer4}</div>
              </div>
            </div>
          </div>
        </div>
      ))
    }
  }

  setFileFieldValue (e) {
    $('.file-upload')[0].files[0]
      ? this.setState({ isFileIncluded: true })
      : this.setState({ isFileIncluded: false })
    $('.file-upload-wrapper').attr('data-text', $(e.target).val().replace(/.*(\/|\\)/, ''))
    let file = $('.file-upload')[0].files[0]
    if (file) {
      this.getBase64($('.file-upload')[0].files[0])
    }
    $('.preview-img-modal').css({
      opacity: 1,
      pointerEvents: 'auto'
    })
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

  getBase64 (file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        questionImage: reader.result
      });
    }
  }

  fillInQuestionValues (question, answer1, answer2, answer3, answer4) {
    this.setState({ question, answer1, answer2, answer3, answer4, renderAutoCompleteResults: false })
  }

  renderAutoCompleteResults () {
    if (this.state.questionAutocompleteResults.length > 0 && this.state.renderAutoCompleteResults) {
      return this.state.questionAutocompleteResults.map((result) => (
        <li onClick={this.fillInQuestionValues.bind(this, result.question, result.answer1, result.answer2, result.answer3, result.answer4)}>
          {result.question}
        </li>
      ))
    }
  }

  editField (key) {
    this.setState({ [key]: true })
  }

  saveEditField (key, e) {
    const data = {
      title: key === 'title' ? $('.input-title').val() : this.state.title,
      description: key === 'description' ? $('.input-description').val() : this.state.description,
      tags: key === 'tag' ? $('.input-tag').val() : this.state.quizData.quiz.tags
    }
    $('.loader').css({ opacity: 1 })
    fetch(`${host}/api/quizzes/${this.props.router.query.quizId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userData.userObject.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(() => {
      if (key === 'title') {
        this.setState({ title: data.title })
      }
      if (key === 'description') {
        this.setState({ description: data.description });
      }
      if (key === 'tag') {
        this.setState({ editTagValue: data.tags });
      }
      this.setState({
        editingTitleField: false,
        editingParagraphField: false,
        editingTagField: false,
        title: data.title,
        description: data.description
      })
      $('.loader').css({ opacity: 0 })
    }).catch((err) => {
      console.log(err)
    })
  }

  renderTitle () {
    return (
      <div>
        <h1 className="quiz-header-title">
          {this.state.title}
          <span
            onClick={this.editField.bind(this, 'editingTitleField')}
            className="edit-field">
            <img src='/static/images/icons/edit-quiz-icon.svg' />
          </span>
        </h1>
      </div>
    )
  }

  renderTag () {
    return (
      <div className="edit-tag">
        <h1 className="quiz-header-title">
          <span className="edit-tag-span">
            Category: {this.state.editTagValue}
          </span>
          <span
            onClick={this.editField.bind(this, 'editingTagField')}
            className="edit-field">
            <img src='/static/images/icons/edit-quiz-icon.svg' />
          </span>
        </h1>
      </div>
    )
  }

  cancelEditField (key) {
    this.setState({ [key]: false })
  }

  renderEditTitle () {
    return (
      <div className="edit-field-container">
        <input className="input-title" />
        <img onClick={this.cancelEditField.bind(this, 'editingTitleField')} src='/static/images/icons/close.png' />
        <button onClick={this.saveEditField.bind(this, 'title')}>Save Changes</button>
      </div>
    )
  }

  renderDescription () {
    return (
      <div>
        <p>{this.state.description}
          <span
            onClick={this.editField.bind(this, 'editingParagraphField')}
            className="edit-field">
            <img onClick={this.cancelEditField.bind(this, 'editingTitleField')} src='/static/images/icons/edit-quiz-icon.svg' />
          </span>
        </p>
      </div>
    )
  }

  renderEditDescription () {
    return (
      <div className="edit-field-container">
        <input className="input-description" />
        <img onClick={this.cancelEditField.bind(this, 'editingParagraphField')} src='/static/images/icons/close.png' />
        <button onClick={this.saveEditField.bind(this, 'description')}>Save Changes</button>
      </div>
    )
  }

  renderEditTag () {
    return (
      <div className="edit-field-container">
        <input className="input-tag" />
        <img onClick={this.cancelEditField.bind(this, 'editingTagField')} src='/static/images/icons/close.png' />
        <button onClick={this.saveEditField.bind(this, 'tag')}>Save Changes</button>
      </div>
    )
  }

  removeAddedQuestionImage () {
    this.setState({
      isFileIncluded: false
    })
    $('.file-upload-wrapper').attr('data-text', 'Add an optional image!')
    $('.file-upload').val('')
  }

  renderShowAddedImage () {
    return (
      <div className="show-added-image-container">
        { this.state.addQuestionText !== 'EDIT QUESTION'
          ? <div onClick={this.removeAddedQuestionImage.bind(this)} className="overlay">
            <h1>Remove Image</h1>
          </div>
          : ''
        }
        <img src={this.state.questionImage} className="show-added-image" />
      </div>
    )
  }

  render () {
    const addedQuestions = this.renderAddedQuestions()
    const renderAutoCompleteResults = this.renderAutoCompleteResults()
    const renderTitle = this.renderTitle()
    const renderTag = this.renderTag()
    const renderEditTitle = this.renderEditTitle()
    const renderDescription = this.renderDescription()
    const renderEditDescription = this.renderEditDescription()
    const renderEditTag = this.renderEditTag()
    const showAddedImage = this.renderShowAddedImage()
    const contentLoader = this.renderContentLoader()

    return (
      <div>
        {userData.isAuthenticated
          ?
          <div id="edit-quiz">

            <div className="edit-quiz-overlay-modal">
              <div className="edit-quiz-modal">
                <div className="text-container">
                  <h1>Great! Now click the "Add Question Button" And Add 7 or more Questions.</h1>
                  <p>Once you are finished share this quiz on our facebook page and give us a review for a chance of winning $200!</p>
                  <a target="_blank" href="https://www.facebook.com/brainflopcorp">BrainFlopCorp</a>
                  <button onClick={() => $('.edit-quiz-overlay-modal').css({ display: 'none' })}>Okay</button>
                </div>
              </div>
            </div>
            <div className="edit-quiz-background" />
            <div className="quiz-header">

              { this.state.editingTitleField ? renderEditTitle : renderTitle }
              { this.state.editingParagraphField ? renderEditDescription : renderDescription }
              { this.state.editingTagField ? renderEditTag : renderTag }

              <p className="question-amount">{this.state.addedQuestions.length} questions</p>
            </div>
            <div className="questions-container">
              <div className="added-questions">
                {this.state.questionsFetched ? addedQuestions : contentLoader}
              </div>
              <div onClick={this.showAddQuestionModal.bind(this, 'add')} className="card add-new-question">
                <h1>Add A New Question</h1>
                <img src='/static/images/icons/add-new-question.svg' />
              </div>
            </div>
            <div className="add-question-modal">
              <div className="add-question">
                <img className="close-add-question" onClick={this.closeAddQuestionModal.bind(this)} src='/static/images/icons/close.png' />
                <h1>Add new question</h1>

                <div className="question-container-with-icon">
                  <input value={this.state.question} onChange={this.setQuestionValue.bind(this, 'question')} className="question" type="text" placeholder="Question" />
                </div>
                <div>
                  <ul className="add-question-autocomplete">
                    { this.state.renderAutoCompleteResults ? renderAutoCompleteResults : ''}
                  </ul>
                </div>
                {this.state.isFileIncluded ? showAddedImage : ''}
                <div className="question-container-with-icon question-container-with-icon2">
                  <input value={this.state.answer1} onChange={this.setQuestionValue.bind(this, 'answer1')} className="correct-answer answer1" type="text" placeholder="Correct Answer" />
                </div>
                <div className="question-container-with-icon question-container-with-icon2">
                  <input value={this.state.answer2} onChange={this.setQuestionValue.bind(this, 'answer2')} type="text" className="answer2" placeholder="Wrong Answer" />
                </div>
                <div className="question-container-with-icon question-container-with-icon2">
                  <input value={this.state.answer3} onChange={this.setQuestionValue.bind(this, 'answer3')} type="text" className="answer3" placeholder="Wrong Answer" />
                </div>
                <div className="question-container-with-icon question-container-with-icon2">
                  <input value={this.state.answer4} onChange={this.setQuestionValue.bind(this, 'answer4')} type="text" className="answer4" placeholder="Wrong Answer" />
                </div>
                {this.state.addQuestionText !== 'EDIT QUESTION'
                  ? <div className="file-upload-wrapper" data-text="Add an optional image!">
                    <input onChange={this.setFileFieldValue.bind(this)} className='file-upload' type="file"/>
                  </div>
                  : ''
                }
                <button onClick={this.state.addingQuestion ? this.submitQuestion.bind(this) : this.editQuestion.bind(this)}>{ this.state.addQuestionText }</button>
              </div>
            </div>
            <div className="loader">
              <img src='/static/images/icons/loader.svg' />
            </div>
          </div>
          :
          <Redirect to='/register' />
        }
      </div>
    )
  }
}

export default EditQuiz
