import LoginComponent from '../src/components/Login';
import Navbar from '../src/components/Navbar';
import Head from 'next/head';

const Login = () => (
    <section>
      <Head>
        <title>BrainFlop - Quizzes You Need And Love</title>
        <meta name="description" content="" />
      </Head>
      <Navbar />
      <LoginComponent />
    </section>
);

export default Login;