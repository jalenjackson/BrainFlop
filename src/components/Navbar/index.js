import React from 'react';
import MenuLeft from './partials/menuLeft';
import MenuRightLinks from './partials/menuRightLinks'
import CollapsedNavbar from './partials/collapsedNavbar'
import './navbar.sass';
import {Router} from '../../../routes';
import Link from 'next/link';
import $ from 'jquery'
import _ from 'lodash';
let host = null;

class Navbar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchAutocomplete: [],
      searchTerm: '',
    };
  }

  componentDidMount() {
    host = window.location.protocol + '//' + window.location.host;
  }


  redirectToSearchPage (searchTerm) {
    if (window.location.pathname.split('/')[1] === 'search') {
      return window.location.href = `/search/${searchTerm}`
    }
    Router.pushRoute(`/search/${_.kebabCase(searchTerm)}`);
    document.activeElement.blur();
    $("input").blur();
    this.setState({ searchAutocomplete: false }, () => {
      this.hideSearchResults()
    })
  }

  renderSearchAutocomplete () {
    if (this.state.searchAutocomplete.length > 0) {
      return this.state.searchAutocomplete.map((result) => (
        <div onClick={this.redirectToSearchPage.bind(this, result.title)} className="autocomplete-elem">
          <img src={result.quizImage} className="results-image" />
          <h1>{result.title}</h1>
          <p>{result.description}</p>
        </div>
      ))
    }
  }

  updateSearchTern (e) {
    this.setState({ searchTerm: e.target.value }, () => {
      if (this.state.searchTerm) {
        fetch(`${host}/api/search/quizzes?term=${encodeURIComponent(this.state.searchTerm)}&skipIterator=0`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then((response) => {
          response.json().then((body) => {
            this.setState({ searchAutocomplete: body.quizzesFound })
          })
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.setState({ searchAutocomplete: [], searchTerm: '' })
      }
    })
  }

  showSearchInput () {
    $('.search-overlay').css({ opacity: 1, pointerEvents: 'auto' });
    $('.menu-right input').css({ opacity: 1, transform: 'translateX(0)', pointerEvents: 'auto' }).focus();
    $('.mobile-quick-links').css({ opacity: 0, pointerEvents: 'none' });
  }

  handleEnter (e) {
    if (this.state.searchTerm) {
      if (e.key === 'Enter') {
        if (window.location.pathname.split('/')[1] === 'search') {
          return window.location.href = `/search/${this.state.searchTerm}`;
        }
        Router.pushRoute(`/search/${_.kebabCase(this.state.searchTerm)}`);
        this.setState({ searchAutocomplete: [], searchTerm: '' });
        $('.quiz-search-input').blur();
        this.hideSearchResults();
      }
    }
  }

  hideSearchResults () {
    $('.mobile-quick-links').css({ opacity: 1, pointerEvents: 'auto'});
    this.setState({ searchAutocomplete: [], searchTerm: '' });
    $('.search-overlay').css({ opacity: 0, pointerEvents: 'none'  });
    $('.menu-right input').css({ opacity: 0, transform: 'translateX(30px)', pointerEvents: 'none' }).focus();
  }

  render () {

    const searchAutocomplete = this.renderSearchAutocomplete();

    return (
        <div id="navbar">
          <CollapsedNavbar />
          <MenuLeft />
          <div className="menu-right">
            <div onClick={this.showSearchInput.bind(this)} className="menu-search" />
            <div className="logo">
              <Link href="/">
                <a title='Go Back Home'>
                  <div className="logo-svg" />
                </a>
              </Link>
            </div>
            <input className="quiz-search-input" value={this.state.searchTerm} onKeyPress={this.handleEnter.bind(this)} onChange={this.updateSearchTern.bind(this)} type="text" placeholder="Search" />
            { this.state.searchAutocomplete.length > 0 ?
                <div className="search-autocomplete">
                  <h1>Quizzes</h1>
                  <div onClick={this.showSearchInput.bind(this)}>
                    {searchAutocomplete}
                  </div>
                </div>
                :
                null
            }
          </div>
          <MenuRightLinks userObject={this.props.userObject} isAuthenticated={this.props.isAuthenticated} />
          <div className="mobile-quick-links">
            <Link href={ '/explore' }>
              <a>
                <div className="icon-container home-icon">
                  <img className="icon-img" style={{ transform: 'scale(1.1)' }} src='/static/images/icons/home.svg' />
                </div>
              </a>
            </Link>
            <a href="#">
              <div className="icon-container">
                <img onClick={this.showSearchInput.bind(this)} className="icon-img"  style={{ transform: 'scale(1.4) translateY(1.4px)' }} src='/static/images/icons/search.svg' />
              </div>
            </a>
            <Link href="/create-quiz">
              <a>
                <div className="icon-container">
                  <img className="icon-img"  style={{ transform: 'scale(1.65) translateY(2px)' }} src='/static/images/icons/build.svg' />
                </div>
              </a>
            </Link>
            <Link href={ '/register' }>
              <a>
                <div className="icon-container">
                  <img className="icon-img"  style={{ transform: 'scale(1.1) translateY(-4px)' }} src='/static/images/icons/profile.svg' />
                </div>
              </a>
            </Link>
          </div>
          <div className="side-bar">
            <div className="quick-links">
              <Link href={ '/explore' }>
                <a title="A Revolutionary Quizzing Experience | BrainFlop">
                  <div className="icon-container home-icon">
                    <img className="icon-img" style={{ transform: 'scale(1.1)' }} src='/static/images/icons/home.svg' />
                  </div>
                </a>
              </Link>
              <Link href="/explore">
                <a title="Explore Quizzes | BrainFlop">
                  <div className="icon-container">
                    <img className="icon-img"  style={{ transform: 'scale(1.4) translateY(1.4px)' }} src='/static/images/icons/lightning.svg' />
                  </div>
                </a>
              </Link>
              <Link href="/create-quiz">
                <a title="Create A Quiz | BrainFlop">
                  <div className="icon-container">
                    <img className="icon-img"  style={{ transform: 'scale(1.65) translateY(2px)' }} src='/static/images/icons/build.svg' />
                  </div>
                </a>
              </Link>
              <Link href={ '/profile' }>
                <a title="Register | BrainFlop">
                  <div style={{ paddingBottom: '0px' }} className="icon-container">
                    <img className="icon-img"  style={{ transform: 'scale(1.1) translateY(-4px)' }} src='/static/images/icons/profile.svg' />
                  </div>
                </a>
              </Link>
            </div>
          </div>
          <div onClick={this.hideSearchResults.bind(this)} className="search-overlay" />
        </div>
    )
  }
}

export default Navbar
