import React from 'react';
import $ from 'jquery'
import {Link} from '../../../../routes.js';

export default class MenuRightLinks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rightGuest: '195px',
      topGuest: '-5.5px',
      rightUser: '180px',
      topUser: '20px'
    }
  }

  componentDidMount() {
    if($(window).width() < 500) {
      this.setState({ rightGuest: '10px', topGuest: '10px', rightUser: '10px', topUser: '10px' })
    }
  }

  render () {
    const guestLinks = (
      <div className="guest-links">
        { this.props.pathName ?
            <div style={{ position: 'absolute', right: this.state.rightGuest, top: this.state.topGuest }} className="fb-share-button" data-href={this.props.pathName} data-layout="button" data-size="large" data-mobile-iframe="true">
              <a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=brainflop.com;src=sdkpreparse`} className="fb-xfbml-parse-ignore">Share</a>
            </div>
            :
            null }
        <Link style={{ transform: 'translateY(-35px)' }} className="menu-right-links login-right-link" route="/login"><a className='undo-hide' title='Login To BrainFlop'>Login</a></Link>
        <Link className="menu-right-links" route="/register"><a title='Register To BrainFlop' className='register-right-link undo-hide'>Register</a></Link>
      </div>
    );

    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const userLinks = (
      <div>
        { this.props.pathName ?
            <div style={{ position: 'absolute', right: this.state.rightUser, top: this.state.topUser }} className="fb-share-button" data-href={this.props.pathName} data-layout="button" data-size="large" data-mobile-iframe="true">
              <a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=brainflop.com;src=sdkpreparse`} className="fb-xfbml-parse-ignore">Share</a>
            </div>
            :
            null
        }
        <Link route='/profile'>
          <a className='undo-hide' style={{ display: 'inline-block' }} title='View Your Profile'>
            <div className="mrn">
              <h1 style={{ transform: 'translate(50px, -5px)' }} className="navbar-points">{ numberWithCommas(String(this.props.userObject && this.props.userObject.points ? this.props.userObject.points : 0))}</h1>
              <div style={{ cursor: 'pointer' }} className='profile-img'>
                <img src='/static/images/icons/user-profile.svg' />
              </div>
            </div>
          </a>
        </Link>
      </div>
    );

    return (
      <div>
        { this.props.isAuthenticated ? userLinks : guestLinks }
      </div>
    )
  }
}
