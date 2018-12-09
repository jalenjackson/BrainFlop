import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import { withRouter } from 'next/router';
import QuizShowPage from '../src/components/Quiz'
import Navbar from '../src/components/Navbar';
import {checkAuthentication} from "../checkAuthentication";
import _ from 'lodash';
import React from "react";

const Quiz = ({quiz, isPersonalityQuiz, router, pathName, userObject}) => (
    <section>
      <Head>
        <title>{toTitleCase(router.query.quizName.split('-').join(' '))} - BrainFlop</title>
        <meta name="description" content={`Play This ${toTitleCase(quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`}  />

        <meta itemProp="name" content={`${toTitleCase(router.query.quizName.split('-').join(' '))} - BrainFlop`} />
        <meta itemProp="description" content={`Play This ${toTitleCase(quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`} />
        <meta itemProp="image" content={quiz.quizImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@QuizOp" />
        <meta name="twitter:title" content={`${toTitleCase(router.query.quizName.split('-').join(' '))} - BrainFlop`} />
        <meta name="twitter:description" content={`Play This ${toTitleCase(quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`} />
        <meta name="twitter:creator" content="@QuizOp" />
        <meta name="twitter:image:src" content={quiz.quizImage} />

        <meta property="og:site_name" content="BrainFlop" />
        <meta property="fb:admins" content="100014621536916" />
        <meta property="og:url" content={pathName} />
        <meta property="og:type" content="game" />
        <meta property="og:title" content={`${toTitleCase(router.query.quizName.split('-').join(' '))} - BrainFlop`} />
        <meta property="og:description" content={`Play This ${toTitleCase(quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`} />
        <meta property="og:image" content={quiz.quizImage} />
        <link href={pathName} rel="canonical" />
      </Head>
      <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
      <QuizShowPage userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    </section>
);

Quiz.getInitialProps  = async (req) => {
  const isClient = typeof document !== 'undefined';

  const getQuizId = isClient
    ? req.query.quizId
    : req.req.params[0].split('/')[3];

  console.log(getQuizId);

  const res = await fetch(`http://localhost:3000/api/quizzes/${getQuizId}`);
  const json = await res.json();
  const pathName = isClient
    ? window.location.href
    : `http://localhost:3000${req.req.params[0]}`;

  let resultObj = {};
  if(!isClient) {
    resultObj = checkAuthentication(req.req.headers.cookie);
  }
  resultObj.quiz = json.quiz;
  resultObj.isPersonalityQuiz = json.quiz.personalityResults.length > 0;
  resultObj.pathname = pathName;
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