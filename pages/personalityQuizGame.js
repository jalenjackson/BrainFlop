import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import {checkAuthentication} from "../checkAuthentication";
import PersonalityQuizGameComponent from '../src/components/PersonalityQuizGame';
import React from "react";

const PersonalityQuizGame = ({ userObject, router }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <PersonalityQuizGameComponent router={router} userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
  </section>
);

PersonalityQuizGame.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(PersonalityQuizGame);