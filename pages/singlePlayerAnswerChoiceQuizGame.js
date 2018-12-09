import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import SinglePlayerAnswerChoiceQuizGameComponent from '../src/components/SinglePlayerAnswerChoiceQuizGame';
import {checkAuthentication} from "../checkAuthentication";
import React from "react";

const SinglePlayerAnswerChoiceQuizGame = ({ userObject, router }) => (
    <section>
      <Head>
        <title>BrainFlop - Quizzes You Need And Love</title>
        <meta name="description" content="" />
      </Head>
      <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
      <SinglePlayerAnswerChoiceQuizGameComponent userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    </section>
);

SinglePlayerAnswerChoiceQuizGame.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(SinglePlayerAnswerChoiceQuizGame);