import Head from 'next/head';
import { withRouter } from 'next/router'
import CategoryComponent from '../src/components/Category'
import Navbar from "../src/components/Navbar";
import React from "react";
import {checkAuthentication} from "../checkAuthentication";

const Category = ({ router, userObject  }) => (
    <div>
      <Head>
        <title>{toTitleCase(router.query.slug.split('-').join(' '))} Quizzes - BrainFlop</title>
        <meta name="description" content={`Play Your Favorite ${toTitleCase(router.query.slug.split('-').join(' '))} Quizzes! Play Online Or Challenge A Friend Here At BrainFlop!` } />
      </Head>
      <Navbar userObject={userObject ? userObject.userObject : null} isAuthenticated={userObject ? userObject.isAuthenticated : null} />
      <CategoryComponent router={router} />
    </div>
);

Category.getInitialProps = async ({ req }) => {
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

export default withRouter(Category);