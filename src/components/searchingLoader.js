import React, { Component } from 'react';
import TimelineMax from "gsap/TimelineMax";
import TweenMax from 'gsap/TweenMax';
import {Power4} from 'gsap/all';
import $ from 'jquery';
let SplitText = null;
export default class SearchingLoader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startCountdown: false,
      startingText: '',
      foundText: 'Starting Game In...'
    };
  }
  componentDidMount() {
    SplitText = require('../gsap/SplitText');
    if (this.props.isInvite) {
      this.setState({ startingText: `` })
    } else {
      this.setState({ startingText: `Waiting For Another Player` })
    }

    SearchingLoader.init();
  }

  componentDidUpdate () {
    if (this.props.opponentFound) {
      $('.earth').css({ boxShadow: 'inset -30px 0 rgba(47,220,127, 0.2), 0 0 0 120px rgba(47,220,127, 0.1), 0 0 0 300px rgba(47,220,127, 0.1), 0 0 0 500px rgba(47,220,127, 0.1)', backgroundColor: '#2FDC7F' });
      $('.moon').css({ backgroundColor: '#2FDC7F' });
      $('#countdown svg circle').css({ animation: 'countdown 5s linear 1 forwards' });
    }
    if (this.props.countdown <= 0) {
      $('#searching-loader').css({ opacity: '0' });
      $('.earth').css({ transform: 'scale(5)' });
    }
  }

  render() {
    return (
        <div id="searching-loader">
          <div className="text-container">
            <h1>{!this.props.opponentFound ? this.state.startingText : this.state.foundText}</h1>
            {this.props.opponentFound ?
                <div id="countdown">
                  <div id="countdown-number">{this.props.countdown}</div>
                  <svg>
                    <circle r="18" cx="20" cy="20"/>
                  </svg>
                </div> :
                null
            }
          </div>
          <div className="earth">
            <div className="earth--shadow" />
          </div>
          <div className="moon" />
          <div className="stars" />
        </div>
    );
  }

  static init() {
    const T1Split = new SplitText('.text-container h1', {
      type: 'chars',
    });
    const T1Animation = new TimelineMax();
    TweenMax.set('#split', { opacity: 1 });
    T1Animation.staggerFrom(T1Split.chars, .2, {
      y: 10, opacity: 0, ease: Power4.easeOut, delay: 0.2,
    }, 0.02, '+=0');
  }
}
