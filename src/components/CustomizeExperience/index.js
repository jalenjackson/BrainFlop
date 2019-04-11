import React, {Component} from 'react';
import TweenMax from 'gsap/TweenMax';
import {Power3} from "gsap/all";
import $ from "jquery";
import { Router } from '../../../routes';
import ReactGA from "react-ga";
import Cookies from "universal-cookie";
let host = null;
require('es6-promise').polyfill();
require('isomorphic-fetch');

export default class CustomizeExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {customizeExperienceTags: this.props.categories, skipIterator: 0, addedTags: []}
  }

  static toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  static isBottom() {
    return $(window).scrollTop() == ($(document).height() - $(window).height());
  }

  componentDidMount() {
    host = window.location.protocol + '//' + window.location.host;
    ReactGA.initialize('UA-129744457-1');
    ReactGA.pageview(window.location.pathname);
    document.addEventListener('scroll', this.trackScrolling);
  }

  addTagToSelection(tagName, e) {
    if (this.state.addedTags.indexOf(tagName) > -1) {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.color = 'rgb(80, 80, 80)';
      let tmpArr = this.state.addedTags;
      tmpArr.splice(this.state.addedTags.indexOf(tagName), 1);
      TweenMax.to('#customize button', 0.5, { transform: 'translate3d(0, 300px, 0)', ease: Power3.easeOut });
      return this.setState({ addedTags: tmpArr });
    }
    if (this.state.addedTags.length === 4) {
      TweenMax.to('#customize button', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    }
    if (this.state.addedTags.length < 5) {
      e.currentTarget.style.backgroundColor = '#304EFE';
      e.currentTarget.style.color = 'white';
      let tmpArr = this.state.addedTags;
      tmpArr.push(tagName);
      this.setState({addedTags: tmpArr});
    }
  }

  renderCustomizeExperienceTags() {
    if (this.state.customizeExperienceTags.length > 0) {
      return this.state.customizeExperienceTags.map(tag => (
        <div onClick={this.addTagToSelection.bind(this, tag.name)} className="customize-experience-tag">
          <h1>{ CustomizeExperience.toTitleCase(tag.name) }</h1>
        </div>
      ));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("customize-experience");
    if (CustomizeExperience.isBottom(wrappedElement)) {
      this.fetchMoreTags();
    }
  };

  async fetchMoreTags() {
    await this.setState({ skipIterator: this.state.skipIterator + 15 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    $.ajax({
      type: 'GET',
      url: `https://api.quizop.com/tags?limit=15&skipAmount=${this.state.skipIterator}`,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: (body) => {
        let tmpArr = this.state.customizeExperienceTags;
        tmpArr.push(...body.tags);
        this.setState({ customizeExperienceTags: tmpArr }, () => {
          setTimeout(() => {
            TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 200%, 0)', ease: Power3.easeOut });
          }, 550)
        });
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  saveUserTags() {
    $('.submit-btn').css({ filter: 'grayscale(100%)' });
    $.ajax({
      type: 'POST',
      url: `https://api.quizop.com/users/update-customized-tags`,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${this.props.userObject.token}`
      },
      data: JSON.stringify({ tags: this.state.addedTags }),
      success: (body) => {
        const newCookie = {
          isAuthenticated: true,
          userObject: body.userObject
        };
        newCookie.userObject.token = body.token;
        const cookies = new Cookies();
        cookies.set('userObject', newCookie, { path: '/' });
        ReactGA.event({
          category: 'User',
          action: `${this.props.userObject.name} customized their experience!`
        });
        $("html, body").animate({ scrollTop: 0 }, 350);
        Router.pushRoute('/')
      },
      error: (err) => {
        ReactGA.event({
          category: 'User',
          action: `an error occured customizing experience ${err}`
        });
        console.log(err)
      }
    });
  }

  renderCustomizedExperienceComponent() {
    const customizeExperienceTags = this.renderCustomizeExperienceTags();
    return (
      <div id="customize">
        <div id="customize-experience" className="customize-experience">
          <div className="mover">
            <h1 className="customize-experience-header">What do you like?</h1>
            <p>Select 5 categories you enjoy the most</p>
            <div className="customize-experience-tags-container">
              {customizeExperienceTags}
            </div>
            <div className="pagination-loader">
              <img src='/static/images/icons/rings.svg' />
            </div>
          </div>
        </div>
        <button className="submit-btn" onClick={this.saveUserTags.bind(this)}>SUBMIT</button>
      </div>
    )
  }

  render() {
    const customizeExperienceComponent = this.renderCustomizedExperienceComponent();
    return (
      <div>
        { customizeExperienceComponent }
      </div>
    )
  }
}
