import React, { Component } from 'react';
import Link from 'next/link';
import './navbar.sass'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <nav>
        <div id="navbar">
          <Link href="/about">
            <a title="About Next Js">About Next Js</a>
          </Link>
          <Link href="/">
            <a title="Our API">Home</a>
          </Link>
        </div>
      </nav>
    )
  }
}

export default Navbar;