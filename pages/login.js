import LoginComponent from '../src/components/Login';
import Navbar from '../src/components/Navbar';
import Cookies from 'universal-cookie';
import Router from 'next/router'
import Head from 'next/head';
import {checkAuthentication} from "../checkAuthentication";
import React from "react";

const Login = (Data) => (
    <section>
      <Head>
        <title>Login To BrainFlop</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.0/TweenMax.min.js"></script>
        <meta name="description" content='Welcome Back To BrainFlop! Login Easy And Fast With Facebook Or Your Email!' />
        <meta itemProp="name" content='Login To BrainFlop' />
        <meta itemProp="description" content='Welcome Back To BrainFlop! Login Easy And Fast With Facebook Or Your Email!' />
        <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@QuizOp" />
        <meta name="twitter:title" content='Login To BrainFlop' />
        <meta name="twitter:description" content='Welcome Back To BrainFlop! Login Easy And Fast With Facebook Or Your Email!' />
        <meta name="twitter:creator" content="@QuizOp" />
        <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
        <meta property="og:site_name" content="BrainFlop" />
        <meta property="fb:admins" content="100014621536916" />
        <meta property="og:url" content={Data.pathName} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noodp, noydir" />
        <meta property="og:title" content='Login To BrainFlop' />
        <meta property="og:description" content='Welcome Back To BrainFlop! Login Easy And Fast With Facebook Or Your Email!' />
        <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
        <link href={Data.pathName} rel="canonical" />
      </Head>
      <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
      <LoginComponent />
    </section>
);

Login.getInitialProps = async (req) => {
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

export default Login;