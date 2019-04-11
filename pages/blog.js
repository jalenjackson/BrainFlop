import BlogComponent from '../src/components/Blog';
import Navbar from '../src/components/Navbar';
import {withRouter} from 'next/router'
import Head from 'next/head';
import {checkAuthentication} from "../checkAuthentication";
import React from "react";
require('es6-promise').polyfill();
require('isomorphic-fetch');

const Blog = (Data) => (
  <section>
    <Head>
      <title>{Data.blog.title} | BrainFlop</title>
      <meta name="description" content={Data.blog.description} />
      <meta itemProp="name" content={`${Data.blog.title} | BrainFlop`} />
      <meta itemProp="description" content={Data.blog.description} />
      <meta itemProp="image" content={Data.blog.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content="noodp, noydir" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content={`${Data.blog.title} | BrainFlop`} />
      <meta name="twitter:description" content={Data.blog.description} />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content={Data.blog.image} />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${Data.blog.title} | BrainFlop`} />
      <meta property="og:description" content={Data.blog.description} />
      <meta property="og:image" content={Data.blog.image} />
      <link href={Data.pathName} rel="canonical" />
      <link href="https://fonts.googleapis.com/css?family=Charm" rel="stylesheet" />
    </Head>
    <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <BlogComponent blog={Data.blog} pathName={Data.pathName}  />
  </section>
);

Blog.getInitialProps = async (req) => {
  const isClient = typeof document !== 'undefined';
  const blogId = isClient ? req.query.id : req.req.url.split('/')[3].split('?')[0];

  const res = await fetch(`http://api.quizop.com/blog/${blogId}`);
  const json = await res.json();
  if (!json.blog) {
    req.res.redirect('/');
    req.res.end();
    return {}
  }
  let result = checkAuthentication(req);
  result.blog = json.blog;
  return result
};

export default withRouter(Blog);
