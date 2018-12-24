import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import React from 'react';
import { checkAuthentication } from "../checkAuthentication";
import CtaComponent from '../src/components/ctaComponent';

const Cta = (Data) => (
    <div>
      <section>
        <Head>
          <title>Register To Win $100 | BrainFlop</title>
          <meta name="description" content='Register to win $100 just by adding your email address!' />
          <meta itemProp="name" content='Register To Win $100 | BrainFlop' />
          <meta itemProp="description" content='Register to win $100 just by adding your email address!' />
          <meta itemProp="image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@QuizOp" />
          <meta name="robots" content="noodp, noydir" />
          <meta name="twitter:title" content='Register To Win $100 | BrainFlop' />
          <meta name="twitter:description" content='Register to win $100 just by adding your email address!' />
          <meta name="twitter:creator" content="@QuizOp" />
          <meta name="twitter:image:src" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
          <meta property="og:site_name" content="BrainFlop" />
          <meta property="fb:admins" content="100014621536916" />
          <meta property="og:url" content={Data.pathName} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content='Register To Win $100 | BrainFlop' />
          <meta property="og:description" content='Register to win $100 just by adding your email address!' />
          <meta property="og:image" content='https://s3.amazonaws.com/quizop/46787915_984167748452313_32209441516421120_o+(1).png' />
          <link rel='stylesheet' href='/static/cta.css' />
          <link href={Data.pathName} rel="canonical" />
        </Head>
        <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
        <CtaComponent pathName={Data.pathName} />
      </section>
    </div>
);

Cta.getInitialProps = async (req) => {
  return checkAuthentication(req);
};

export default withRouter(Cta);
