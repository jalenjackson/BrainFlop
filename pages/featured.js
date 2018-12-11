import Head from 'next/head';
import { withRouter } from 'next/router'
import FeaturedComponent from '../src/components/Featured'
import Navbar from "../src/components/Navbar";
import React from "react";
import {checkAuthentication} from "../checkAuthentication";

const Featured = (Data) => (
  <div>
    <Head>
      <title>Top 10 Best Featured Quizzes On BrainFlop</title>
      <meta name="description" content='Play The Top Featured Quizzes On BrainFlop! Play Single Player, Online, Or Invite A Friend!' />
      <meta itemProp="name" content='Top 10 Best Featured Quizzes On BrainFlop' />
      <meta itemProp="description" content='Play The Top Featured Quizzes On BrainFlop! Play Single Player, Online, Or Invite A Friend!' />
      <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content='Top 10 Best Featured Quizzes On BrainFlop' />
      <meta name="twitter:description" content='Play The Top Featured Quizzes On BrainFlop! Play Single Player, Online, Or Invite A Friend!' />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content='Top 10 Best Featured Quizzes On BrainFlop' />
      <meta property="og:description" content='Play The Top Featured Quizzes On BrainFlop! Play Single Player, Online, Or Invite A Friend!' />
      <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <FeaturedComponent router={Data.router} />
  </div>
);

Featured.getInitialProps = async (req) => {
  return checkAuthentication(req);
};

export default withRouter(Featured);