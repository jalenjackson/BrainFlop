import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import React from 'react';
import InviteAFriendAnswerChoiceQuizGameComponent from '../src/components/InviteAFriendAnswerChoiceQuizGame';
import { checkAuthentication } from "../checkAuthentication";
import OnlineAnswerChoiceQuizGameComponent from '../src/components/OnlineAnswerChoiceQuizGame';
import Index from "./index";

const OnlineAnswerChoiceQuizGame = ({ userObject, router }) => (
  <div>
    {console.log(userObject)}
    <section>
      <Head>
        <title>BrainFlop - Quizzes You Need And Love</title>
        <meta name="description" content="" />
      </Head>
      <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
      <OnlineAnswerChoiceQuizGameComponent userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} router={router} />
    </section>
  </div>
);

OnlineAnswerChoiceQuizGame.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(OnlineAnswerChoiceQuizGame);