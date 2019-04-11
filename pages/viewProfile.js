import Head from 'next/head';
import { withRouter } from 'next/router'
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import ViewProfileComponent from '../src/components/ViewProfile'
import React from 'react';
import fetch from "isomorphic-unfetch";
import _ from "lodash";

const ViewProfile = (Data) => (
  <section>
    <Head>
      <title>{Data.userName} Profile | BrainFlop</title>
      <meta name="description" content={`View ${Data.userName}'s Profile On BrainFlop.`} />
      <meta itemProp="name" content={`${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes | BrainFlop`} />
      <meta itemProp="description" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta itemProp="image" content={Data.quizImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="robots" content="noodp, noydir" />
      <meta name="twitter:title" content={`${Data.userName} Profile | BrainFlop`} />
      <meta name="twitter:description" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content={Data.quizImage} />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${Data.userName} Profile | BrainFlop`} />
      <meta property="og:description" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta property="og:image" content={Data.quizImage} />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <ViewProfileComponent router={Data.router} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
  </section>
);

ViewProfile.getInitialProps = async (req) => {

  const isClient = typeof document !== 'undefined';

  const userId = isClient
    ? req.query.id
    : req.req.url.split('/')[3];

  const res = await fetch(`http://api.quizop.com/users/get-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ userId })
  });

  const json = await res.json();

  let responseObj = checkAuthentication(req);
  responseObj.userName = json.user.name;
  return responseObj;
};

export default withRouter(ViewProfile);