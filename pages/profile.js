import Explore from '../src/components/Explore';
import Head from 'next/head';
import { withRouter } from 'next/router'
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import ProfileComponent from '../src/components/Profile';
import React from 'react';

const Profile = ({ userObject, router }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <ProfileComponent userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null}  />
  </section>
);

Profile.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(Profile);