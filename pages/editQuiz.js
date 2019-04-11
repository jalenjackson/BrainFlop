import Head from 'next/head';
import { withRouter } from 'next/router'
import EditQuizComponent from '../src/components/EditQuiz'
import Navbar from "../src/components/Navbar";
import React from "react";
import Cookies from "universal-cookie";
import { checkAuthentication } from "../checkAuthentication";
import fetch from "isomorphic-unfetch";

const EditQuiz = (Data) => (
  <div>
    <Head>
      <title>Edit Quiz - BrainFlop</title>
      <meta name="description" content='Edit Your Amazing Quiz At BrainFlop' />
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <EditQuizComponent router={Data.router} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
  </div>
);

EditQuiz.getInitialProps = async (req) => {
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

  const userObject = cookies.get('userObject').userObject;

  const getQuizId = isClient
    ? req.query.quizId
    : req.req.url.split('/')[2];

  const res = await fetch(`http://api.quizop.com/quizzes/${getQuizId}`);
  const json = await res.json();

  if (!json.quiz || json.quiz === undefined || json.quiz.userId !== userObject.userId) {
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

export default withRouter(EditQuiz);