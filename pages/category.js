import Head from 'next/head';
import { withRouter } from 'next/router'
import CategoryComponent from '../src/components/Category'
import fetch from 'isomorphic-unfetch';
import Navbar from "../src/components/Navbar";
import React from "react";
import pluralize from 'pluralize';
import _ from 'lodash';
import {checkAuthentication} from "../checkAuthentication";

const Category = (Data) => (
    <div>
      <Head>
        <title>Top 10 Best {_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes - BrainFlop</title>
        <meta name="description" content={`Play The Best 10 ${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes! Play Single Player, Online Or With A Friend!`} />
        <meta itemProp="name" content={`Top 10 Best ${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes - BrainFlop`} />
        <meta itemProp="description" content={`Play The Best 10 ${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes! Play Single Player, Online Or With A Friend!`} />
        <meta itemProp="image" content={Data.quizImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@QuizOp" />
        <meta name="twitter:title" content={`Top 10 Best ${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes - BrainFlop`} />
        <meta name="twitter:description" content={`Play The Best 10 ${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes! Play Single Player, Online Or With A Friend!`} />
        <meta name="twitter:creator" content="@QuizOp" />
        <meta name="twitter:image:src" content={Data.quizImage} />
        <meta property="og:site_name" content="BrainFlop" />
        <meta property="fb:admins" content="100014621536916" />
        <meta property="og:url" content={Data.pathName} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Top 10 Best ${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes - BrainFlop`} />
        <meta property="og:description" content={`Play The Best 10 ${_.startCase(_.toLower(Data.pluralizedTopic))} Quizzes! Play Single Player, Online Or With A Friend!`} />
        <meta property="og:image" content={Data.quizImage} />
        <link href={Data.pathName} rel="canonical" />
      </Head>
      <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
      <CategoryComponent topic={Data.pluralizedTopic} router={Data.router} />
    </div>
);

Category.getInitialProps = async (req) => {

  const isClient = typeof document !== 'undefined';
  let topic = isClient ? req.query.slug.split('-').join(' ') : req.req.url.split('/')[2].split('?')[0].split('-').join(' ');

  console.log(topic)

  const res = await fetch(`https://api.quizop.com/quizzes/quizzes-by-topic?limit=1`, {
    method: 'POST',
    body: JSON.stringify({ topic }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  const json = await res.json();

  let pluralizedTopic = pluralize.isPlural(topic)
    ? pluralize.singular(topic)
    : topic;

  let userObject = checkAuthentication(req);
  userObject.quizImage = json.quizzes.length > 0 ? json.quizzes[0].quizImage : 'https://quizop.s3.amazonaws.com/1541038760937';
  userObject.pluralizedTopic = pluralizedTopic;
  return userObject;
};

export default withRouter(Category);