import Head from 'next/head';
import { withRouter } from 'next/router'
import EditQuizComponent from '../src/components/EditQuiz'
import Navbar from "../src/components/Navbar";
import React from "react";
import { checkAuthentication } from "../checkAuthentication";

const EditQuiz = ({ router, userObject  }) => (
  <div>
    <Head>
      <title>Edit Quiz</title>
      <meta name="description" content='Featued' />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <EditQuizComponent router={router} userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
  </div>
);

EditQuiz.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(EditQuiz);