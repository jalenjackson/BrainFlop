import RegisterComponent from '../src/components/Register';
import Navbar from '../src/components/Navbar';
import Cookies from 'universal-cookie';
import Router from 'next/router'
import Head from 'next/head';
import React from "react";
import {checkAuthentication} from "../checkAuthentication";

const Register = (Data) => (
  <section>
    <Head>
      <title>Register To BrainFlop</title>
      <meta name="description" content='Register Easy And Fast With Facebook Or Your Email!' />
      <meta itemProp="name" content='Register To BrainFlop' />
      <meta itemProp="description" content='Register Easy And Fast With Facebook Or Your Email!' />
      <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@QuizOp" />
      <meta name="twitter:title" content='Register To BrainFlop' />
      <meta name="twitter:description" content='Register Easy And Fast With Facebook Or Your Email!' />
      <meta name="twitter:creator" content="@QuizOp" />
      <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <meta property="og:site_name" content="BrainFlop" />
      <meta property="fb:admins" content="100014621536916" />
      <meta property="og:url" content={Data.pathName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content='Register To BrainFlop' />
      <meta property="og:description" content='Register Easy And Fast With Facebook Or Your Email!' />
      <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
      <link href={Data.pathName} rel="canonical" />
    </Head>
    <Navbar userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
    <RegisterComponent />
  </section>
);

Register.getInitialProps = async (req) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    const cookies = new Cookies(req.req.headers.cookie);
    if (cookies.get('userObject')) {
      if(typeof window === 'undefined'){
        req.res.redirect('/');
        req.res.end();
        return {}
      }
      Router.push('/');
      return {}
    }
  }
  return checkAuthentication(req)
};

export default Register;