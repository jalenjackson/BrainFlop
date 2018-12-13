import React from 'react';
import {Link} from '../../../routes';

export default class BlogComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      html: ''
    }
  }
  componentDidMount() {
    fetch(`https://api.quizop.com/blog/${this.props.pathName.split('/')[5].split('?')[0]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ html: body.blog.html })
      });
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className='blog-container'>
        <div className='blog-header'>
          <h1>7 Ways To Stay Motivated And Make Millions</h1>
          <p>Have you ever dreamed of making millions, but you lack motivation and time to get anything done? After reading this article you will be more motivated than ever to start making millions!</p>
          <img src='/static/images/blogHeader/blog1.svg' />
        </div>
        <div dangerouslySetInnerHTML={{ __html: this.state.html }} className='blog'>
        </div>
        <div className='blog'>
          <Link route='/'><a title='Go Home'><button className='explore-btn-blog'>Explore</button></a></Link>
        </div>
      </div>
    )
  }
}
