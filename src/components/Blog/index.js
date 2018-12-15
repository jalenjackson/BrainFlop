import React from 'react';
import { Link } from '../../../routes';

export default class BlogComponent extends React.Component {
  render() {
    return (
      <div className='blog-container'>
        <div className='blog-header'>
          <h1>{ this.props.blog.title }</h1>
          <p>{ this.props.blog.description }</p>
          <img src='/static/images/blogHeader/blog1.svg' />
        </div>
        <div dangerouslySetInnerHTML={{ __html: this.props.blog.html }} className='blog'>
        </div>
        <div className='blog'>
          <Link route='/'><a title='Go Home'><button className='explore-btn-blog'>Explore</button></a></Link>
        </div>
      </div>
    )
  }
}
