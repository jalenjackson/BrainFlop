import React, { Component } from 'react';
import {Router} from '../../routes';
import Navbar from '../components/Navbar';
import ReactGA from "react-ga";

export default class PageNotFound extends Component {
  componentDidMount () {
    document.title = 'This Page Does Not Exist - BrainFlop';
    ReactGA.initialize('UA-129744457-1')
    ReactGA.pageview(`/${window.location.pathname}`)
  }
  render () {
    return (
      <div id="not-found">
        <button onClick={(e) => Router.pushRoute('/')}>Go Back Home</button>
      </div>
    );
  }
}
