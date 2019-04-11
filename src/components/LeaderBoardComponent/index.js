import React from 'react';
import $ from "jquery";
import TweenMax, {Power3} from "gsap/TweenMaxBase";
import _ from "lodash";
import {Link} from '../../../routes';

export default class LeaderBoardComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: this.props.users,
      skipIterator: 0,
      ranking: 0,
      rankSet: false
    }
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  isBottom(el) {
    return $(window).scrollTop() == ($(document).height() - $(window).height())
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById("quizzes");
    if (this.isBottom(wrappedElement)) {
      this.fetchMoreUsers();
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };

  async fetchMoreUsers() {
    await this.setState({ skipIterator: this.state.skipIterator + 20 });
    TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 0, 0)', ease: Power3.easeOut });
    fetch(`http://api.quizop.com/users/get-top-users?skip=${this.state.skipIterator}&limit=20`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }).then((response) => {
      response.json().then((body) => {
        let tmpArr = this.state.users;
        tmpArr.push(...body.users);
        document.addEventListener('scroll', this.trackScrolling);
        this.setState({ users: tmpArr }, () => {
          setTimeout(() => {
            TweenMax.to('.pagination-loader', 0.5, { transform: 'translate3d(0, 200%, 0)', ease: Power3.easeOut });
          }, 550)
        });
      });
    }).catch((err) => {
      console.log(err)
    })
  }

  getRandomColor () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  renderUsers() {
    if (this.state.users.length > 0) {
      return this.state.users.map((user, i) => (
          <Link route={`/profile/${_.kebabCase(user.name)}/${user._id}`}>
            <a title={`${user.name}'s profile`}>
              {user._id === this.props.userObject.userId && !this.state.rankSet ? this.setState({ ranking: i + 1, rankSet: true }) : null}
              <div className='user'>
                <div style={{ background: `${this.getRandomColor()}` }} className='number'>
                  <p>{i + 1}</p>
                </div>
                <h1>{user.name}</h1>
                <span><img src='/static/images/icons/diamond.svg' />{this.numberWithCommas(user.points)}</span>
              </div>
            </a>
          </Link>
      ))
    }
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  render() {
    const users = this.renderUsers();

    return (
        <div id="leaderboard">
          <div className='background-image' />
          <div className="leaderboard">
            <div className="header">
              <h1><img src="/static/images/icons/lightning.svg" /> BrainFlop Leaderboard</h1>
            </div>
            { this.props.isAuthenticated
                ?
                <Link route={`/profile`}>
                  <a title={`Your Profile`}>
                    <div className='user'>
                      <div style={{ background: `${this.getRandomColor()}` }} className='number'>
                        <p>{this.state.ranking}</p>
                      </div>
                      <h1>Your Ranking</h1>
                      <span><img src='/static/images/icons/diamond.svg' />{this.numberWithCommas(this.props.userObject.points)}</span>
                    </div>
                  </a>
                </Link>
                : null
            }
            {users}
          </div>
          <div className="pagination-loader">
            <img src="/static/images/icons/rings.svg" />
          </div>
        </div>
    )
  }
}


