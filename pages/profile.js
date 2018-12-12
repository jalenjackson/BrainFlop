import Head from 'next/head';
import { withRouter } from 'next/router'
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import ProfileComponent from '../src/components/Profile';
import React from 'react';
import Cookies from "universal-cookie";
import Router from "next/router";

const Profile = (Data) => (
  <section>
    <Head>
      <title>Profile - BrainFlop</title>
      <meta name="description" content='View Your Profile Here At BrainFlop!' />
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <ProfileComponent userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
  </section>
);

Profile.getInitialProps = async (req) => {
  const isClient = typeof document !== 'undefined';

  const cookies = isClient ? new Cookies() : new Cookies(req.req.headers.cookie);

  if (!cookies.get('userObject')) {
    if(typeof window === 'undefined'){
      req.res.redirect('/');
      req.res.end();
      return {}
    }
    Router.push('/');
    return {}
  }
  return checkAuthentication(req);
};

export default withRouter(Profile);