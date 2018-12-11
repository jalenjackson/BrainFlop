import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import { withRouter } from 'next/router';
import QuizShowPage from '../src/components/Quiz'
import Navbar from '../src/components/Navbar';
import {checkAuthentication} from "../checkAuthentication";
import React from "react";

const Quiz = (Data) => (
    <section>
      <Head>
        <title>{toTitleCase(Data.router.query.quizName.split('-').join(' '))} - BrainFlop</title>
        <meta name="description" content={`Play This ${toTitleCase(Data.quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`}  />

        <meta itemProp="name" content={`${toTitleCase(Data.router.query.quizName.split('-').join(' '))} - BrainFlop`} />
        <meta itemProp="description" content={`Play This ${toTitleCase(Data.quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`} />
        <meta itemProp="image" content={Data.quiz.quizImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@QuizOp" />
        <meta name="twitter:title" content={`${toTitleCase(Data.router.query.quizName.split('-').join(' '))} - BrainFlop`} />
        <meta name="twitter:description" content={`Play This ${toTitleCase(Data.quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`} />
        <meta name="twitter:creator" content="@QuizOp" />
        <meta name="twitter:image:src" content={Data.quiz.quizImage} />

        <meta property="og:site_name" content="BrainFlop" />
        <meta property="fb:admins" content="100014621536916" />
        <meta property="og:url" content={Data.pathName} />
        <meta property="og:type" content="game" />
        <meta property="og:title" content={`${toTitleCase(Data.router.query.quizName.split('-').join(' '))} - BrainFlop`} />
        <meta property="og:description" content={`Play This ${toTitleCase(Data.quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`} />
        <meta property="og:image" content={Data.quiz.quizImage} />
        <link href={Data.pathName} rel="canonical" />
      </Head>
      <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
      <QuizShowPage userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    </section>
);

Quiz.getInitialProps  = async (req) => {
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
  resultObj.isPersonalityQuiz = json.quiz.personalityResults.length > 0;
  return resultObj;
};

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}

export default withRouter(Quiz);