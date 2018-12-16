import Head from 'next/head';
import { withRouter } from 'next/router'
import SearchComponent from '../src/components/Search';
import { checkAuthentication } from '../checkAuthentication';
import Navbar from '../src/components/Navbar';
import _ from 'lodash';
import React from 'react';

const Search = (Data) => (
  <section>
    <Head>
      <title>Search {_.startCase(_.toLower(Data.router.query.searchQuery))} | BrainFlop</title>
      <meta name="description" content={`Search Results For ${_.startCase(_.toLower(Data.router.query.searchQuery))}`} />
      <meta itemProp="name" content={`Search ${_.startCase(_.toLower(Data.router.query.searchQuery))} | BrainFlop`} />
      <meta itemProp="description" content={`Search Results For ${_.startCase(_.toLower(Data.router.query.searchQuery))}`} />
      <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="robots" content="noodp, noydir" />
      <meta name="twitter:title" content={`Search ${_.startCase(_.toLower(Data.router.query.searchQuery))} | BrainFlop`} />
      <meta name="twitter:description" content={`Search Results For ${_.startCase(_.toLower(Data.router.query.searchQuery))}`} />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`Search ${_.startCase(_.toLower(Data.router.query.searchQuery))} | BrainFlop`} />
      <meta property="og:description" content={`Search Results For ${_.startCase(_.toLower(Data.router.query.searchQuery))}`} />
      <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <SearchComponent router={Data.router} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated}  />
  </section>
);

Search.getInitialProps = async (req) => {
  return checkAuthentication(req);
};

export default withRouter(Search);