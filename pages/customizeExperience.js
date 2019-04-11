import Head from 'next/head';
import { withRouter } from 'next/router'
import CustomizeExperienceComponent from '../src/components/CustomizeExperience';
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import React from 'react';
import Cookies from "universal-cookie";
import Router from "next/router";
import fetch from "isomorphic-unfetch";

const CustomizeExperience = (Data) => (
  <section>
    <Head>
      <title>Customize Experience - BrainFlop</title>
      <meta name="description" content='Customize Your Experience Here At BrainFlop' />
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <CustomizeExperienceComponent categories={Data.categories} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
  </section>
);

CustomizeExperience.getInitialProps = async (req) => {
  const isClient = typeof document !== 'undefined';
  const res = await fetch(`http://api.quizop.com/tags?limit=15&skipAmount=0`);
  const json = await res.json();

  const cookies = isClient ? new Cookies() : new Cookies(req.req.headers.cookie);

  if (!cookies.get('userObject')) {
    if(typeof window === 'undefined'){
      req.res.redirect('/');
      req.res.end();
      return {}
    }
    Router.push('/');
    return {}
  }
  let userObject = checkAuthentication(req);
  userObject.categories = json.tags;
  return userObject;
};

export default withRouter(CustomizeExperience);