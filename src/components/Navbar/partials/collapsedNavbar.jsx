import React from 'react';
import {Power4, TweenMax} from 'gsap/all';
import 'gsap/CSSPlugin'
import Link from 'next/link';
import $ from "jquery";

export default class CollapsedNavbar extends React.Component {

  closeCollapsedNavbar(event) {
    event.stopPropagation()
    TweenMax.to('.top h1', 1, { opacity: 0, transform: 'translate3d(-50px, 0, 0)', ease: Power4.easeOut });
    TweenMax.to('.inner-nav-links h1', 0.3, { opacity: 0, transform: 'translate3d(-50px, 0, 0)', ease: Power4.easeOut });
    TweenMax.to('.collapsed-navbar', 0.5, { opacity: 1, transform: 'translate3d(-150%, 0, 0)', delay: 0.15, ease: Power4.easeOut });
    if($(window).width() >= 750) {
      $('#menu').show();
    }
  }

  render() {
    return (
      <div>
        <div id="collapsed" className="collapsed-navbar">
          <div className="logo-container">
            <img onClick={this.closeCollapsedNavbar} alt="Close Navbar" src='/static/images/icons/close.png' />
            <Link onClick={this.closeCollapsedNavbar} href="/">
              <h1>BrainFlop</h1>
            </Link>
          </div>
          <div className="top">
            <h1>Menu</h1>
          </div>
          <div className="inner-nav-links">
            <Link onClick={this.closeCollapsedNavbar} href="/explore">
              <div>
                <h1 className="inner-nav-link1">Explore</h1>
              </div>
            </Link>
            <Link onClick={this.closeCollapsedNavbar} href="/create-quiz">
              <div>
                <h1 className="inner-nav-link2">Create A Quiz</h1>
              </div>
            </Link>
            <Link onClick={this.closeCollapsedNavbar} href="/login">
              <div>
                <h1 className="inner-nav-link3">Sign In</h1>
              </div>
            </Link>
            <Link onClick={this.closeCollapsedNavbar} href="/register">
              <div>
                <h1 className="inner-nav-link4">Register</h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
