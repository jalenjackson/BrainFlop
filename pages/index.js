import Explore from '../src/components/Explore';
import Head from 'next/head';

const Index = () => (
  <section>
    <Head>
      <title>Index page!</title>
      <meta name="description" content="This index page is awesome" />
    </Head>
    <Explore />
  </section>
);

export default Index;