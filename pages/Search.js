import Explore from '../src/components/Explore';
import Head from 'next/head';
import { withRouter } from 'next/router'
import SearchComponent from '../src/components/Search';
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import React from 'react';

const Search = ({ userObject, router }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <SearchComponent router={router} userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null}  />
  </section>
);

Search.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(Search);