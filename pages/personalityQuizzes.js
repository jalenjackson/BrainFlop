import Head from 'next/head';
import { withRouter } from 'next/router'
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import PersonalityQuizzesComponent from '../src/components/PersonalityQuizzes';
import React from 'react';

const PersonalityQuizzes = ({ userObject, router }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <PersonalityQuizzesComponent router={router} userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null}  />
  </section>
);

PersonalityQuizzes.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(PersonalityQuizzes);