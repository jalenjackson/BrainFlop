import Explore from '../src/components/Explore';
import Head from 'next/head';
import { withRouter } from 'next/router'
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import React from 'react';
import _ from "lodash";

const Index = (Data) => (
  <section>
    <Head>
      <title>A Beautiful Multiplayer|Single Player Quiz Platform</title>
      <meta name="description" content='Play the most exciting quizzes there is! Play online, invite a friend, or play alone! Whether your studying or just love trivia. We got you!' />
      <meta itemProp="name" content='A Beautiful Multiplayer|Single Player Quiz Platform' />
      <meta itemProp="description" content='Play the most exciting quizzes there is! Play online, invite a friend, or play alone! Whether your studying or just love trivia. We got you!' />
      <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content='A Beautiful Multiplayer|Single Player Quiz Platform' />
      <meta name="twitter:description" content='Play the most exciting quizzes there is! Play online, invite a friend, or play alone! Whether your studying or just love trivia. We got you!' />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content='A Beautiful Multiplayer|Single Player Quiz Platform' />
      <meta property="og:description" content='Play the most exciting quizzes there is! Play online, invite a friend, or play alone! Whether your studying or just love trivia. We got you!' />
      <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <Explore userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
  </section>
);

Index.getInitialProps = async (req) => {
  return checkAuthentication(req)
};

export default withRouter(Index);