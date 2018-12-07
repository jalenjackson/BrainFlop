import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import SinglePlayerAnswerChoiceQuizGameComponent from '../src/components/SinglePlayerAnswerChoiceQuizGame';

const SinglePlayerAnswerChoiceQuizGame = () => (
    <section>
      <Head>
        <title>BrainFlop - Quizzes You Need And Love</title>
        <meta name="description" content="" />
      </Head>
      <Navbar />
      <SinglePlayerAnswerChoiceQuizGameComponent />
    </section>
);

export default SinglePlayerAnswerChoiceQuizGame;