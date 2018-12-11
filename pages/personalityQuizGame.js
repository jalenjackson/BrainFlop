import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import {checkAuthentication} from "../checkAuthentication";
import PersonalityQuizGameComponent from '../src/components/PersonalityQuizGame';
import React from "react";
import _ from "lodash";
import fetch from "isomorphic-unfetch";

const PersonalityQuizGame = (Data) => (
  <section>
    <Head>
      <title>{_.startCase(_.toLower(Data.quiz.title))} - BrainFlop</title>
      <meta name="description" content={`Play this awesome personality quiz only on BrainFlop! ${_.startCase(_.toLower(Data.quiz.title))}`} />
      <meta itemProp="name" content={`${_.startCase(_.toLower(Data.quiz.title))} - BrainFlop`} />
      <meta itemProp="description" content={`Play this awesome personality quiz only on BrainFlop! ${_.startCase(_.toLower(Data.quiz.title))}`} />
      <meta itemProp="image" content={Data.quiz.quizImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content={`${_.startCase(_.toLower(Data.quiz.title))} - BrainFlop`} />
      <meta name="twitter:description" content={`Play this awesome personality quiz only on BrainFlop! ${_.startCase(_.toLower(Data.quiz.title))}`} />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content={Data.quiz.quizImage} />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${_.startCase(_.toLower(Data.quiz.title))} - BrainFlop`} />
      <meta property="og:description" content={`Play this awesome personality quiz only on BrainFlop! ${_.startCase(_.toLower(Data.quiz.title))}`} />
      <meta property="og:image" content={Data.quiz.quizImage} />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <PersonalityQuizGameComponent router={Data.router} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
  </section>
);

PersonalityQuizGame.getInitialProps = async (req) => {
  const isClient = typeof document !== 'undefined';

  const getQuizId = isClient
    ? req.query.quizId
    : req.req.url.split('/')[3];

  const res = await fetch(`https://api.quizop.com/quizzes/${getQuizId}`);
  const json = await res.json();
  const pathName = isClient
    ? window.location.href
    : `https://brainflop.com${req.req.url}`;

  let resultObj = {};
  resultObj = checkAuthentication(req);
  resultObj.quiz = json.quiz;
  return resultObj;
};

export default withRouter(PersonalityQuizGame);