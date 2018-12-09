import Head from 'next/head';
import { withRouter } from 'next/router'
import CategoriesComponent from '../src/components/Categories'
import Navbar from "../src/components/Navbar";
import React from "react";
import {checkAuthentication} from "../checkAuthentication";

const Categories = ({ router, userObject  }) => (
  <div>
    <Head>
      <title>All CAtegories BrainFlop</title>
      <meta name="description" content='Idk' />
    </Head>
    <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
    <CategoriesComponent userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
  </div>
);

Categories.getInitialProps = async ({ req }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    return checkAuthentication(req.headers.cookie);
  }
};

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

export default withRouter(Categories);