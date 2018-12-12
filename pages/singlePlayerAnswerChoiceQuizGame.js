import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import SinglePlayerAnswerChoiceQuizGameComponent from '../src/components/SinglePlayerAnswerChoiceQuizGame';
import {checkAuthentication} from "../checkAuthentication";
import React from "react";
import fetch from "isomorphic-unfetch";

const SinglePlayerAnswerChoiceQuizGame = (Data) => (
    <section>
      <Head>
        <title>{Data.quiz.title} Single Player | BrainFlop</title>
        <meta name="description" content={`${Data.quiz.title} Play This Quiz Single Player, Online, Or Invite A Friend! Only At BrainFlop!`} />
        <meta itemProp="name" content={`${Data.quiz.title} Single Player | BrainFlop`} />
        <meta itemProp="description" content={`${Data.quiz.title} Play This Quiz Single Player, Online, Or Invite A Friend! Only At BrainFlop!`} />
        <meta itemProp="image" content={Data.quiz.quizImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@QuizOp" />
        <meta name="twitter:title" content={`${Data.quiz.title} Single Player | BrainFlop`} />
        <meta name="twitter:description" content={`${Data.quiz.title} Play This Quiz Single Player, Online, Or Invite A Friend! Only At BrainFlop!`} />
        <meta name="twitter:creator" content="@QuizOp" />
        <meta name="twitter:image:src" content={Data.quiz.quizImage} />
        <meta property="og:site_name" content="BrainFlop" />
        <meta property="fb:admins" content="100014621536916" />
        <meta property="og:url" content={Data.pathName} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${Data.quiz.title} Single Player | BrainFlop`} />
        <meta property="og:description" content={`${Data.quiz.title} Play This Quiz Single Player, Online, Or Invite A Friend! Only At BrainFlop!`} />
        <meta property="og:image" content={Data.quiz.quizImage} />
        <link href={Data.pathName} rel="canonical" />
      </Head>
      <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
      <SinglePlayerAnswerChoiceQuizGameComponent router={Data.router} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    </section>
);

SinglePlayerAnswerChoiceQuizGame.getInitialProps = async (req) => {
  const isClient = typeof document !== 'undefined';

  const getQuizId = isClient
    ? req.query.quizId
    : req.req.url.split('/')[4].split('?')[0];

  const res = await fetch(`https://api.quizop.com/quizzes/${getQuizId}`);
  const json = await res.json();

  let resultObj = {};
  resultObj = checkAuthentication(req);
  resultObj.quiz = json.quiz;
  resultObj.isPersonalityQuiz = json.quiz.personalityResults.length > 0;
  return resultObj;
};

export default withRouter(SinglePlayerAnswerChoiceQuizGame);