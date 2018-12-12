import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import TermsAndConditionsComponent from '../src/components/TermsAndConditions';
import {checkAuthentication} from "../checkAuthentication";
import { withRouter } from 'next/router';
import React from "react";

const TermsAndConditions = (Data) => (
  <section>
    <Head>
      <title>Terms And Conditions | BrainFlop</title>
      <meta name="description" content='BrainFlop official Terms And Conditions' />
      <meta itemProp="name" content='Terms And Conditions | BrainFlop' />
      <meta itemProp="description" content='BrainFlop official Terms And Conditions' />
      <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content='Terms And Conditions | BrainFlop' />
      <meta name="twitter:description" content='BrainFlop official Terms And Conditions' />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content='Terms And Conditions | BrainFlop' />
      <meta property="og:description" content='BrainFlop official Terms And Conditions' />
      <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <TermsAndConditionsComponent />
  </section>
);

TermsAndConditions.getInitialProps = async (req) => {
  return checkAuthentication(req);
};

export default withRouter(TermsAndConditions);