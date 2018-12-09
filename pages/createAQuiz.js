import CreateAQuizComponent from '../src/components/CreateAQuiz';
import Head from 'next/head';
import { checkAuthentication } from '../checkAuthentication';
import { withRouter } from 'next/router';
import Navbar from '../src/components/Navbar';
import React from 'react';

const CreateAQuiz = ({ userObject, router }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <CreateAQuizComponent userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null}  />
  </section>
);

CreateAQuiz.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(CreateAQuiz);