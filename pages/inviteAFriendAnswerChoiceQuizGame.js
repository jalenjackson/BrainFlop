import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import React from 'react';
import InviteAFriendAnswerChoiceQuizGameComponent from '../src/components/InviteAFriendAnswerChoiceQuizGame';
import { checkAuthentication } from "../checkAuthentication";

const InviteAFriendAnswerChoiceQuizGame = ({ userObject, router }) => (
    <div>
      <section>
        <Head>
          <title>BrainFlop - Quizzes You Need And Love</title>
          <meta name="description" content="" />
        </Head>
        <Navbar />
        <InviteAFriendAnswerChoiceQuizGameComponent userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} router={router} />
      </section>
    </div>
);

InviteAFriendAnswerChoiceQuizGame.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(InviteAFriendAnswerChoiceQuizGame);