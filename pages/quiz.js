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
        <title>{toTitleCase(Data.router.query.quizName.split('-').join(' '))} | BrainFlop</title>
        <meta name="description" content={`Play This ${toTitleCase(Data.quiz.quiz.tags)} Quiz Online, Single Player, Or Challenge A Friend!`}  />

        <meta itemProp="name" content={`${toTitleCase(Data.router.query.quizName.split('-').join(' '))} | BrainFlop`} />
        <meta itemProp="description" content={`${Data.quiz.quiz.title} ${Data.quiz.quiz.description}`} />
        <meta itemProp="image" content={Data.quiz.quiz.quizImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@QuizOp" />
        <meta name="robots" content="noodp, noydir" />
        <meta name="twitter:title" content={`${toTitleCase(Data.router.query.quizName.split('-').join(' '))} | BrainFlop`} />
        <meta name="twitter:description" content={`${Data.quiz.quiz.title} ${Data.quiz.quiz.description}`} />
        <meta name="twitter:creator" content="@QuizOp" />
        <meta name="twitter:image:src" content={Data.quiz.quiz.quizImage} />

        <meta property="og:site_name" content="BrainFlop" />
        <meta property="fb:admins" content="100014621536916" />
        <meta property="og:url" content={Data.pathName} />
        <meta property="og:type" content="game" />
        <meta property="og:title" content={`${toTitleCase(Data.router.query.quizName.split('-').join(' '))} | BrainFlop`} />
        <meta property="og:description" content={`${Data.quiz.quiz.title} ${Data.quiz.quiz.description}`} />
        <meta property="og:image" content={Data.quiz.quiz.quizImage} />
        <link href={Data.pathName} rel="canonical" />
        <div id="fb-root" />
      </Head>
      <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
      <QuizShowPage quizData={Data.quiz} router={Data.router} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    </section>
);

Quiz.getInitialProps  = async (req) => {
  const isClient = typeof document !== 'undefined';

  const quizId = isClient
    ? req.query.quizId
    : req.req.url.split('/')[3].split('?')[0];

  const res = await fetch(`http://api.quizop.com/quizzes/quiz-page`, {
    method: 'POST',
    body: JSON.stringify({ quizId }),
    headers: {'Content-Type': 'application/json; charset=utf-8'}
  });
  const json = await res.json();

  let resultObj = checkAuthentication(req);
  resultObj.quiz = json.quizPageData;
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