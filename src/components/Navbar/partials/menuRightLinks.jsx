import React from 'react';
import Link from 'next/link';
let auth = {};

export default class MenuRightLinks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userPoints: 0
    }
  }

  componentDidMount() {
    auth = window.Auth;
  }

  render () {
    const guestLinks = (
      <div className="guest-links">
        <Link className="menu-right-links login-right-link" href="/login">Login</Link>
        <Link className="menu-right-links register-right-link" href="/register">Register</Link>
      </div>
    );

    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const userLinks = (
      <div className="mrn">
        <Link href='/profile'>
          <h1 className="navbar-points">{ numberWithCommas(String(auth.userObject && auth.userObject.points ? auth.userObject.points : 0))}</h1>
        </Link>
        <Link href='/profile'>
          <div className='profile-img'>
            <img src='/static/images/icons/user-profile.svg' />
          </div>
        </Link>
      </div>
    );

    return (
      <div>
        { auth.isAuthenticated ? userLinks : guestLinks }
      </div>
    )
  }
}
