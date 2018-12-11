import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import React from 'react';
import InviteAFriendAnswerChoiceQuizGameComponent from '../src/components/InviteAFriendAnswerChoiceQuizGame';
import { checkAuthentication } from "../checkAuthentication";
import Cookies from "universal-cookie";
import Router from "next/router";

const InviteAFriendAnswerChoiceQuizGame = (Data) => (
    <div>
      <section>
        <Head>
          <title>Invite A Friend - BrainFlop</title>
          <meta name="description" content='Invite A Friend To Play Along With You On This Quiz!' />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
        <InviteAFriendAnswerChoiceQuizGameComponent userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} router={Data.router} />
      </section>
    </div>
);

InviteAFriendAnswerChoiceQuizGame.getInitialProps = async (req) => {
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
  return checkAuthentication(req);
};

export default withRouter(InviteAFriendAnswerChoiceQuizGame);