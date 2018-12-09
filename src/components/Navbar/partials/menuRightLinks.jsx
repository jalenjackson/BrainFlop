import React from 'react';
import Link from 'next/link';
import { verifyFrontEndAuthentication } from "../../verifyFrontEndAuthentication";
let auth = {};
let userData = {};

export default class MenuRightLinks extends React.Component {

  constructor(props) {
    super(props);

    userData = verifyFrontEndAuthentication(this.props.userObject, this.props.isAuthenticated);
  }

  render () {
    const guestLinks = (
      <div className="guest-links">
        <Link className="menu-right-links login-right-link" href="/login"><a>Login</a></Link>
        <Link className="menu-right-links" href="/register"><a className='register-right-link'>Register</a></Link>
      </div>
    );

    const numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const userLinks = (
      <div className="mrn">
        <Link href='/profile'>
          <h1 className="navbar-points">{ numberWithCommas(String(userData.userObject && userData.userObject.points ? userData.userObject.points : 0))}</h1>
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
        {console.log(userData.isAuthenticated)}
        { userData.isAuthenticated ? userLinks : guestLinks }
      </div>
    )
  }
}
