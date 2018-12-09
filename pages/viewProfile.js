import Explore from '../src/components/Explore';
import Head from 'next/head';
import { withRouter } from 'next/router'
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import ViewProfileComponent from '../src/components/ViewProfile'
import React from 'react';

const ViewProfile = ({ userObject, router }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <ViewProfileComponent router={router} userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null}  />
  </section>
);

ViewProfile.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(ViewProfile);