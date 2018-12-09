import Explore from '../src/components/Explore';
import Head from 'next/head';
import { withRouter } from 'next/router'
import CustomizeExperienceComponent from '../src/components/CustomizeExperience';
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import React from 'react';

const CustomizeExperience = ({ userObject, router }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <CustomizeExperienceComponent userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null}  />
  </section>
);

CustomizeExperience.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

export default withRouter(CustomizeExperience);