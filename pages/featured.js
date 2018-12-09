import Head from 'next/head';
import { withRouter } from 'next/router'
import FeaturedComponent from '../src/components/Featured'
import Navbar from "../src/components/Navbar";
import React from "react";
import {checkAuthentication} from "../checkAuthentication";

const Featured = ({ router, userObject  }) => (
  <div>
    <Head>
      <title>Featued</title>
      <meta name="description" content='Featued' />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <FeaturedComponent router={router} />
  </div>
);

Featured.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export default withRouter(Featured);