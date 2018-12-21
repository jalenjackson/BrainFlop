import React from 'react';
import MenuLeft from './partials/menuLeft';
import MenuRightLinks from './partials/menuRightLinks'
import CollapsedNavbar from './partials/collapsedNavbar'
import './navbar.sass';
import {Router, Link} from '../../../routes';
import $ from 'jquery'
import _ from 'lodash';

class Navbar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchAutocomplete: [],
      searchTerm: '',
    };
  }

  redirectToSearchPage (searchTerm) {
    if (this.state.searchTerm.replace(/[^a-zA-Z ]/g, "") !== '') {
      if (window.location.pathname.split('/')[1] === 'search') {
        return window.location.href = `/search/${_.kebabCase(searchTerm.replace(/[^a-zA-Z ]/g, ""))}`
      }
      Router.pushRoute(`/search/${_.kebabCase(searchTerm.replace(/[^a-zA-Z ]/g, ""))}`);
      document.activeElement.blur();
      $("input").blur();
      this.setState({ searchAutocomplete: false }, () => {
        this.hideSearchResults()
      })
    }
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
        fetch(`https://api.quizop.com/search/quizzes?term=${encodeURIComponent(this.state.searchTerm)}&skipIterator=0`, {
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
      if (this.state.searchTerm && this.state.searchTerm.replace(/[^a-zA-Z ]/g, "") !== '') {
      if (e.key === 'Enter') {
        if (window.location.pathname.split('/')[1] === 'search') {
          return window.location.href = `/search/${_.kebabCase(this.state.searchTerm.replace(/[^a-zA-Z ]/g, ""))}`;
        }
        Router.pushRoute(`/search/${_.kebabCase(this.state.searchTerm.replace(/[^a-zA-Z ]/g, ""))}`);
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
          <MenuRightLinks pathName={this.props.pathName} userObject={this.props.userObject} isAuthenticated={this.props.isAuthenticated} />
          <div className="mobile-quick-links">
            <Link href={ '/' }>
              <a>
                <div className="icon-container home-icon">
                  <img className="icon-img" style={{ transform: 'scale(1.1)' }} src='/static/images/icons/home.svg' />
                </div>
              </a>
            </Link>
            <a>
              <div className="icon-container">
                <img onClick={this.showSearchInput.bind(this)} className="icon-img"  style={{ transform: 'scale(1.4) translateY(1.4px)' }} src='/static/images/icons/search.svg' />
              </div>
            </a>
            <Link route={ '/create-quiz' }>
              <a>
                <div className="icon-container">
                  <img className="icon-img"  style={{ transform: 'scale(1.65) translateY(2px)' }} src='/static/images/icons/build.svg' />
                </div>
              </a>
            </Link>
            <Link route={ this.props.isAuthenticated ? '/profile' : '/register' }>
              <a>
                <div className="icon-container">
                  <img className="icon-img"  style={{ transform: 'scale(1.1) translateY(-4px)' }} src='/static/images/icons/profile.svg' />
                </div>
              </a>
            </Link>
            <Link route='/leaderboard'>
              <a title="Top players on BrainFlop">
                <div className="icon-container">
                  <img className="icon-img"  style={{ transform: 'scale(1.1) translateY(-4px)' }} src='/static/images/icons/lightning.svg' />
                </div>
              </a>
            </Link>
          </div>
          <div className="side-bar">
            { this.props.pathName ?
                <div className="fb-share-button" data-href={this.props.pathName} data-layout="button" data-size="large" data-mobile-iframe="true">
                  <a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=brainflop.com;src=sdkpreparse`} className="fb-xfbml-parse-ignore">Share</a>
                </div>
                :
                null }
            <div className="quick-links">
              <Link route={ '/' }>
                <a title="Explore Quizzes">
                  <div className="icon-container home-icon">
                    <img className="icon-img" style={{ transform: 'scale(1.1)' }} src='/static/images/icons/home.svg' />
                  </div>
                </a>
              </Link>
              <Link route={'/create-quiz'}>
                <a title="Create Your Own Quiz">
                  <div className="icon-container">
                    <img className="icon-img"  style={{ transform: 'scale(1.65) translateY(2px)' }} src='/static/images/icons/build.svg' />
                  </div>
                </a>
              </Link>
              <Link route={ this.props.isAuthenticated ? '/profile' : '/register' }>
                <a title="Register To BrainFlop">
                  <div style={{ paddingBottom: '0px', width: '30px' }} className="icon-container">
                    <img className="icon-img"  style={{ transform: 'scale(1.1) translateY(-4px)' }} src='/static/images/icons/profile.svg' />
                  </div>
                </a>
              </Link>
              <Link route='/leaderboard'>
                <a title="Top players on BrainFlop">
                  <div style={{ transform: 'translateY(-7px)', width: '30px' }} className="icon-container">
                    <img className="icon-img"  style={{ transform: 'scale(1.1) translateY(-4px)' }} src='/static/images/icons/lightning.svg' />
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
