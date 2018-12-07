import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import React from 'react';

const InviteAFriendAnswerChoiceQuizGame = ({ router }) => (
    <div>
      <section>
        <Head>
          <title>BrainFlop - Quizzes You Need And Love</title>
          <meta name="description" content="" />
        </Head>
        <Navbar />
      </section>
    </div>
);

export default withRouter(InviteAFriendAnswerChoiceQuizGame);