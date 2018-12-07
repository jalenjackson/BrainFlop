import Head from 'next/head';
import { withRouter } from 'next/router'
import CategoryComponent from '../src/components/Category'

const Category = ({router}) => (
    <div>
      <Head>
        <title>{toTitleCase(router.query.slug.split('-').join(' '))} Quizzes - BrainFlop</title>
        <meta name="description" content={`Play Your Favorite ${toTitleCase(router.query.slug.split('-').join(' '))} Quizzes! Play Online Or Challenge A Friend Here At BrainFlop!` } />
      </Head>
      <CategoryComponent />
      {console.log(toTitleCase('cool'))}
    </div>
);

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}

export default withRouter(Category);