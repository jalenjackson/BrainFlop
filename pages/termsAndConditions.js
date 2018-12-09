import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import TermsAndConditionsComponent from '../src/components/TermsAndConditions';
import {checkAuthentication} from "../checkAuthentication";
import React from "react";

const TermsAndConditions = ({ userObject }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <TermsAndConditionsComponent />
  </section>
);

TermsAndConditions.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default TermsAndConditions;