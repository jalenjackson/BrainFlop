import Head from 'next/head';
import { withRouter } from 'next/router'
import CategoriesComponent from '../src/components/Categories'
import Navbar from "../src/components/Navbar";
import React from "react";
import {checkAuthentication} from "../checkAuthentication";

const Categories = (Data) => (
  <div>
    <Head>
      <title>Quizzes By Category - BrainFlop</title>
      <meta name="description" content='Play These Quizzes About General Knowledge, Computers, Anatomy, Math, TV And Many More! Play Single Player, Online Or With A Friend!'  />
      <meta itemProp="name" content='Quizzes By Category - BrainFlop' />
      <meta itemProp="description" content='Play These Quizzes About General Knowledge, Computers, Anatomy, Math, TV And Many More! Play Single Player, Online Or With A Friend!' />
      <meta itemProp="image" content='https://quizop.s3.amazonaws.com/1541038760937' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content='Quizzes By Category - BrainFlop' />
      <meta name="twitter:description" content='Play These Quizzes About General Knowledge, Computers, Anatomy, Math, TV And Many More! Play Single Player, Online Or With A Friend!' />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://quizop.s3.amazonaws.com/1541038760937' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content='Quizzes By Category - BrainFlop' />
      <meta property="og:description" content='Play These Quizzes About General Knowledge, Computers, Anatomy, Math, TV And Many More! Play Single Player, Online Or With A Friend!' />
      <meta property="og:image" content='https://quizop.s3.amazonaws.com/1541038760937' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <CategoriesComponent />
  </div>
);

Categories.getInitialProps = async (req) => {
  return checkAuthentication(req)
};

export default withRouter(Categories);