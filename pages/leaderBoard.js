import Head from 'next/head';
import { withRouter } from 'next/router'
import LeaderBoardComponent from '../src/components/LeaderBoardComponent';
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import React from 'react';
import fetch from "isomorphic-unfetch";

const LeaderBoard = (Data) => (
    <section>
      <Head>
        <title>Top Players On BrainFlop</title>
        <meta name="description" content='See the top players score on the BrainFlop leaderboard!' />
        <meta itemProp="name" content='Top Players BrainFlop' />
        <meta itemProp="description" content='See the top players score on the BrainFlop leaderboard!' />
        <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@QuizOp" />
        <meta name="robots" content="noodp, noydir" />
        <meta name="twitter:title" content='Top Players BrainFlop' />
        <meta name="twitter:description" content='See the top players score on the BrainFlop leaderboard!' />
        <meta name="twitter:creator" content="@QuizOp" />
        <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
        <meta property="og:site_name" content="BrainFlop" />
        <meta property="fb:admins" content="100014621536916" />
        <meta property="og:url" content={Data.pathName} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content='Top Players BrainFlop' />
        <meta property="og:description" content='See the top players score on the BrainFlop leaderboard!' />
        <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
        <link href={Data.pathName} rel="canonical" />
      </Head>
      <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
      <LeaderBoardComponent users={Data.users} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
    </section>
);

LeaderBoard.getInitialProps = async (req) => {
  const res = await fetch(`https://api.quizop.com/users/get-top-users?skip=0&limit=20`);
  const json = await res.json();

  console.log(json);

  let userObject = checkAuthentication(req);
  userObject.users = json.users;
  return userObject;
};

export default withRouter(LeaderBoard);
