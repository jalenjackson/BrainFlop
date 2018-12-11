import React from 'react';
import {Link} from '../../../../routes.js';

export default class MenuRightLinks extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    const guestLinks = (
      <div className="guest-links">
        <Link className="menu-right-links login-right-link" route="/login"><a title='Login To BrainFlop'>Login</a></Link>
        <Link className="menu-right-links" route="/register"><a title='Register To BrainFlop' className='register-right-link'>Register</a></Link>
      </div>
    );

    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const userLinks = (
      <Link route='/profile'>
        <a style={{ display: 'inline-block' }} title='View Your Profile'>
          <div className="mrn">
            <h1 className="navbar-points">{ numberWithCommas(String(this.props.userObject && this.props.userObject.points ? this.props.userObject.points : 0))}</h1>
            <div style={{ cursor: 'pointer' }} className='profile-img'>
              <img src='/static/images/icons/user-profile.svg' />
            </div>
          </div>
        </a>
      </Link>
    );

    return (
      <div>
        { this.props.isAuthenticated ? userLinks : guestLinks }
      </div>
    )
  }
}
