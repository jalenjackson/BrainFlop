import {Link, Router} from '../routes';

const About = () => (
  <section>
    <h1>About NextJs</h1>
    <p>Hello world</p>
    <li>
      <Link route='category' params={{ slug: 'random-category' }}>
        <a>A new category</a>
      </Link>
    </li>
  </section>
);

export default About