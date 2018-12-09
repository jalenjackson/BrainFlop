import RegisterComponent from '../src/components/Register';
import Navbar from '../src/components/Navbar';
import Cookies from 'universal-cookie';
import Router from 'next/router'
import Head from 'next/head';

const Register = ({ userObject, isAuthenticated }) => (
  <section>
    <Head>
      <title>BrainFlop - Quizzes You Need And Love</title>
      <meta name="description" content="" />
    </Head>
    <Navbar />
    <RegisterComponent />
  </section>
);

Register.getInitialProps = async ({ req, res }) => {
  const isClient = typeof document !== 'undefined';
  if(!isClient) {
    const cookies = new Cookies(req.headers.cookie);
    if (cookies.get('userObject')) {
      if(typeof window === 'undefined'){
        res.redirect('/');
        res.end();
        return {}
      }
      Router.push('/');
      return {}
    }
    return {}
  }
};

export default Register;