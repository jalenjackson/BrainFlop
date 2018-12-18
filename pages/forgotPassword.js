import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import { withRouter } from 'next/router'
import React from 'react';
import { checkAuthentication } from "../checkAuthentication";
import ForgotPasswordComponent from '../src/components/forgotPasswordComponent';

const forgotPassword = (Data) => (
    <div>
      <section>
        <Head>
          <title>Online Multiplayer - BrainFlop</title>
          <meta name="description" content='Play Your Favorite Quiz Online!' />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Navbar pathName={Data.pathName} userObject={Data.userObject} isAuthenticated={Data.isAuthenticated} />
        <ForgotPasswordComponent pathName={Data.pathName} />
      </section>
    </div>
);

forgotPassword.getInitialProps = async (req) => {
  return checkAuthentication(req);
};

export default withRouter(forgotPassword);