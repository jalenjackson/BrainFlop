import Head from 'next/head';
import { withRouter } from 'next/router'
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import PersonalityQuizzesComponent from '../src/components/PersonalityQuizzes';
import React from 'react';

const PersonalityQuizzes = (Data) => (
  <section>
    <Head>
      <title>Personality Quizzes | BrainFlop</title>
      <meta name="description" content='Take Our Awesome Personality Quizzes And We Will Uncover Things You Never Knew About Yourself!'  />
      <meta itemProp="name" content='Personality Quizzes | BrainFlop' />
      <meta itemProp="description" content='Take Our Awesome Personality Quizzes And We Will Uncover Things You Never Knew About Yourself!' />
      <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content='Personality Quizzes | BrainFlop' />
      <meta name="twitter:description" content='Take Our Awesome Personality Quizzes And We Will Uncover Things You Never Knew About Yourself!' />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content='Personality Quizzes | BrainFlop' />
      <meta property="og:description" content='Take Our Awesome Personality Quizzes And We Will Uncover Things You Never Knew About Yourself!' />
      <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <PersonalityQuizzesComponent userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
  </section>
);

PersonalityQuizzes.getInitialProps = async (req) => {
  return checkAuthentication(req)
};

export default withRouter(PersonalityQuizzes);
