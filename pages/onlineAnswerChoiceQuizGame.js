import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import React from 'react';
import { checkAuthentication } from "../checkAuthentication";
import OnlineAnswerChoiceQuizGameComponent from '../src/components/OnlineAnswerChoiceQuizGame';
import Cookies from "universal-cookie";
import Router from "next/router";

const OnlineAnswerChoiceQuizGame = (Data) => (
  <div>
    <section>
      <Head>
        <title>Online Multiplayer - BrainFlop</title>
        <meta name="description" content='Play Your Favorite Quiz Online!' />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
      <OnlineAnswerChoiceQuizGameComponent userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} pathName={Data.pathName} />
    </section>
  </div>
);

OnlineAnswerChoiceQuizGame.getInitialProps = async (req) => {
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

export default withRouter(OnlineAnswerChoiceQuizGame);