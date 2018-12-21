import React from 'react';
import $ from 'jquery';
import { TweenMax, Power4 } from 'gsap/all';
import 'gsap/CSSPlugin'

export default class MenuLeft extends React.Component {

  render() {
    return (
      <div>
        <div className="menu-left">
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
