import CreateAQuizComponent from '../src/components/CreateAQuiz';
import Head from 'next/head';
import { checkAuthentication } from '../checkAuthentication';
import { withRouter } from 'next/router';
import Navbar from '../src/components/Navbar';
import React from 'react';

const CreateAQuiz = (Data) => (
  <section>
    <Head>
      <title>Quiz Maker: Create Your Own Quizzes | BrainFlop</title>
      <meta name="description" content='Whether You Are Studying For An Exam Or You Have A Great Quiz Idea, Create Your Own Quiz In Minutes And Share It With The World!' />
      <meta itemProp="name" content={`Quiz Maker: Create Your Own Quizzes | BrainFlop`} />
      <meta itemProp="description" content={`Whether You Are Studying For An Exam Or You Have A Great Quiz Idea, Create Your Own Quiz In Minutes And Share It With The World!`} />
      <meta itemProp="image" content='https://s3.amazonaws.com/quizop/aws-create-quiz-seo-s3.png' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content={`Quiz Maker: Create Your Own Quizzes | BrainFlop`} />
      <meta name="twitter:description" content={`Whether You Are Studying For An Exam Or You Have A Great Quiz Idea, Create Your Own Quiz In Minutes And Share It With The World!`} />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/aws-create-quiz-seo-s3.png' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`Quiz Maker: Create Your Own Quizzes | BrainFlop`} />
      <meta property="og:description" content={`Whether You Are Studying For An Exam Or You Have A Great Quiz Idea, Create Your Own Quiz In Minutes And Share It With The World!`} />
      <meta property="og:image" content='https://s3.amazonaws.com/quizop/aws-create-quiz-seo-s3.png' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <CreateAQuizComponent router={Data.router} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
  </section>
);

CreateAQuiz.getInitialProps = async (req) => {
  return checkAuthentication(req)
};

export default withRouter(CreateAQuiz);