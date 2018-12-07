import React from 'react';
import $ from 'jquery';
import { TweenMax, Power4 } from 'gsap/all';
import 'gsap/CSSPlugin'

export default class MenuLeft extends React.Component {

  showCollapsedNavbar() {
    $('#menu').hide();
    TweenMax.to('.collapsed-navbar', 0.5, { opacity: 1, transform: 'translate3d(0, 0, 0)', ease: Power4.easeOut });
    TweenMax.to('.top h1', 1, { opacity: 1, transform: 'translate3d(0, 0, 0)', delay: 0.1, ease: Power4.easeOut });
    TweenMax.to('.inner-nav-link1', 1, { opacity: 1, transform: 'translate3d(0, 0, 0)', delay: 0.1, ease: Power4.easeOut });
    TweenMax.to('.inner-nav-link2', 1, { opacity: 1, transform: 'translate3d(0, 0, 0)', delay: 0.25, ease: Power4.easeOut });
    TweenMax.to('.inner-nav-link3', 1, { opacity: 1, transform: 'translate3d(0, 0, 0)', delay: 0.35, ease: Power4.easeOut });
    TweenMax.to('.inner-nav-link4', 1, { opacity: 1, transform: 'translate3d(0, 0, 0)', delay: 0.45, ease: Power4.easeOut });
  }

  render() {
    return (
      <div>
        <div onClick={this.showCollapsedNavbar.bind(this)} className="menu-left">
          <div className="menu-bars">
            <div className="bar bar1" />
            <div className="bar bar2" />
            <div className="bar bar3" />
            <div className="bar bar-hidden bar1 bar4" />
            <div className="bar bar-hidden bar2 bar5" />
            <div className="bar bar-hidden bar3 bar6" />
          </div>
        </div>
      </div>
    );
  }
}
