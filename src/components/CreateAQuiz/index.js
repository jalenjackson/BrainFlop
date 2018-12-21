import React from 'react';
import TweenMax from 'gsap/TweenMax'
import TimelineMax from 'gsap/TimelineMax'
import {Power4} from 'gsap/all'
import $ from 'jquery';
import ReactGA from "react-ga";
import FaceBookAuthentication from "../facebook-login";
import { Router } from '../../../routes';
let SplitText = null;
require('es6-promise').polyfill();
require('isomorphic-fetch');

const myPlugins = [Power4, TimelineMax, TweenMax]; //<-- HARD REFERENCE IN YOUR CODE

class CreateAQuizComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      progressBarWidth: 25,
      'title': '',
      'description': '',
      category: '',
      quizImage: '',
      createdQuiz: false,
      tagsFilledIn: false,
      renderAutoCompleteResults: false,
      tagTerm: '',
      tagsAutocompleteResults: [],
      showModalCannotCreateQuiz: false,
    };
  }

  componentDidMount () {

    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(window.location.pathname);
    SplitText = require('../../gsap/SplitText');

    const T1Split = new SplitText('.form1 h1', { type: 'words' });
    const T1Animation = new TimelineMax();TweenMax.set('#split', { opacity: 1 });
    T1Animation.staggerFrom(T1Split.words, 0.2, {y: 10, opacity: 0, ease: Power4.easeOut, delay: 0.2}, 0.02, '+=0');
  }

  async editTextAndProcessImage(e) {
    $('.file-upload-wrapper').attr('data-text', $(e.target).val().replace(/.*(\/|\\)/, ''));
    let file = $('.file-upload-field')[0].files[0];
    if (file) { this.getBase64($('.file-upload-field')[0].files[0]) }
    $('.preview-img-modal').css({display: 'block'});
  }

  getBase64 (file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({ quizImage: reader.result })
    }
  }

  setInputValue (key, e) {
    this.setState({ [key]: e.target.value })
  }

  async nextForm (from, to, isBack, inputClassName, isTags) {
    if (isTags || isBack || $(inputClassName).val().length > 0) {
      const transform = !isBack ? 'translate3d(-10px, 0, 0)' : 'translate3d(10px, 0, 0)';
      const T1Split = new SplitText(`${to} h1`, { type: 'words' });
      const T1Animation = new TimelineMax();
      TweenMax.set('#split', { opacity: 1 });
      T1Animation.staggerFrom(T1Split.words, 0.7, {y: 10, opacity: 0, ease: Power4.easeOut, delay: 0.40}, 0.02, '+=0');
      TweenMax.to(from, 0.2, {opacity: 0, transform, pointerEvents: 'none', ease: Power4.easeOut });
      TweenMax.to(to, 0.2, {opacity: 1, delay: 0.35, transform: 'translate3d(0, 0, 0)', pointerEvents: 'auto', ease: Power4.easeOut });
      if (!isBack) { await this.setState({ progressBarWidth: this.state.progressBarWidth + 25 }) }
      else { await this.setState({ progressBarWidth: this.state.progressBarWidth - 25 }) }
      TweenMax.to('.progress-bar', 0.5, { width: `${this.state.progressBarWidth}%` });
    }
  }

  handleEnter (from, to, inputClassName, e) {
    if (e.key === 'Enter') { this.nextForm(from, to, false, inputClassName, false) }
  }

  closePreviewModal () {
    $('.file-upload-wrapper').attr('data-text', 'Select an image!');
    $('.file-upload-field').val('');
    $('.preview-img-modal').css({display: 'none'});
  }

  createQuiz () {
    const token = this.props.userObject.token;
    const data = new FormData;
    data.append('title', this.state.title);
    data.append('description', this.state.description);
    data.append('tags', this.state.category.toLowerCase());
    data.append('userId', this.props.userObject.userId);
    data.append('quizImage', $('.file-upload-field')[0].files[0]);
    $('.loader').css({ opacity: 1 });

    fetch(`https://api.quizop.com/quizzes`, {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      response.json().then((body) => {
        ReactGA.event({
          category: 'User',
          action: `${this.props.userObject.name} successfully created a quiz named ${body.createdQuiz.title}`
        });
        Router.pushRoute(`/create-quiz/${body.createdQuiz._id}`);
        setTimeout(() => {
          $('.loader').css({ opacity: 0 });
        }, 500)
      })
    }).catch((err) => {
      ReactGA.event({
        category: 'User',
        action: `an error occurred while ${this.props.userObject.name} tried to create a quiz`
      });
      console.log(err);
    })
  }

  tagAutocomplete (e) {
    this.setState({category: e.target.value, renderAutoCompleteResults: true }, () => {
      if (this.state.category !== '') {
        fetch(`https://api.quizop.com/search/tags?term=${encodeURIComponent(this.state.category)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
          response.json().then((body) => {
            this.setState({ tagsAutocompleteResults: body.tags })
          })
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.setState({
          tagsAutocompleteResults: []
        })
      }
    })
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    })
  }

  fillInCategoryInput (tag) {
    $('.input3').val(this.toTitleCase(tag));
    this.setState({ tagsAutocompleteResults: [], category: tag });
  }

  tagsAutocompleteResults (e) {
    if (this.state.tagsAutocompleteResults.length > 0 ) {
      return (
        this.state.tagsAutocompleteResults.map((tag) => (
          <div onClick={this.fillInCategoryInput.bind(this, tag.name)} className="tag">
            <span>{this.toTitleCase(tag.name)}</span>
          </div>
        ))
      )
    }
  }

  createQuizPrompts () {
    const tagsAutocompleteResults = this.tagsAutocompleteResults();

    return (
      <div>
        <div className="bottom-background"/>
        <div className="section">
          <div className="form">
            <div className="progress-bar"/>
            <div className="form1">
              <h1>What do you want to call your quiz?</h1>
              <input maxLength='45' value={this.state.title} onKeyPress={this.handleEnter.bind(this, '.form1', '.form2', '.input1')} onChange={this.setInputValue.bind(this, 'title')} className="input1" type="text" placeholder="Enter text here" />
              <button onClick={this.nextForm.bind(this, '.form1', '.form2', false, '.input1', false)}>NEXT</button>
            </div>
            <div className="form2">
              <h1>What is your quiz about?</h1>
              <input value={this.state.description} onKeyPress={this.handleEnter.bind(this, '.form2', '.form3', '.input2')} onChange={this.setInputValue.bind(this, 'description')} maxLength="80" className="input2" type="text"/>
              <button onClick={this.nextForm.bind(this, '.form2', '.form3', false, '.input2', false)}>NEXT</button>
              <button className="back-form" onClick={this.nextForm.bind(this, '.form2', '.form1', true)}>BACK</button>
            </div>
            <div className="form3">
              <h1>Type in any category for your quiz</h1>
              <input onChange={this.tagAutocomplete.bind(this)} onKeyPress={this.handleEnter.bind(this, '.form3', '.form4', '.input3')} maxLength="20" type="text" className="input3" placeholder="Press enter to add a new tag"/>
              <div className="tags-autocomplete">{tagsAutocompleteResults}</div>
              <button onClick={this.nextForm.bind(this, '.form3', '.form4', false, '.input3', false)}>NEXT</button>
              <button className="back-form back-form-with-tags" onClick={this.nextForm.bind(this, '.form3', '.form2', true)}>BACK</button>
            </div>
            <div className="form4">
              <h1>Add a cover image for your quiz</h1>
              <div className="file-upload-wrapper" data-text="Select an image!">
                <input onChange={this.editTextAndProcessImage.bind(this)} name="file-upload-field" type="file" className="file-upload-field"/>
              </div>
              <button className="back-form" onClick={this.nextForm.bind(this, '.form4', '.form3', true)}>BACK</button>
            </div>
          </div>
        </div>
        <div className="preview-img-modal">
          <div className="inner-img">
            <img alt="uploaded image" src={this.state.quizImage}/>
            <div className="bottom-buttons">
              <button onClick={this.closePreviewModal.bind(this)}>CHANGE IMAGE</button>
              <button onClick={this.createQuiz.bind(this)}>USE THIS IMAGE</button>
            </div>
          </div>
        </div>
        { !this.props.isAuthenticated
          ? <div className="create-quiz-overlay-modal">
            <div className="cannot-create-quiz-modal2">
              <div className="tesxt-container">
                <h1>We Give Away $100 To Whoever Creates The Best Quiz Every Month!</h1>
                <p>We cant wait to see what you create!</p>
                <FaceBookAuthentication redirect={'createQuiz'} redirectUrl={'/create-quiz'} />
              </div>
            </div>
          </div>
          : null
        }
        <div className="loader">
          <img src='/static/images/icons/loader.svg' />
        </div>
      </div>
    )
  }

  render () {
    const createQuizPrompts = this.createQuizPrompts();
    return (
      <div id="create-quiz">
        { createQuizPrompts }
      </div>
    )
  }
}

export default CreateAQuizComponent
