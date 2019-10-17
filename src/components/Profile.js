import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { loadAuthorArticle, loadFavoriteArticle, unloadProfile } from '../actions/profile';
import ArticleList from './common/ArticleList';
import FollowButton from './common/FollowButton';
import { PROFILE_PAGE } from '../constants';
import { changeTabProfile } from '../actions/articleList';

const ProfileAction = ({ currentUser, username, following }) => {
  if (currentUser.username === username) {
    return (
      <Link className="btn btn-sm btn-outline-secondary action-btn" to="/settings">
        <i className="ion-gear-a"></i>
        &nbsp; Edit Profile Settings
      </Link>
    );
  } else {
    return <FollowButton username={username} following={following} pageName={PROFILE_PAGE} />;
  }
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 5,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {
      match: {
        params: { username },
      },
      loaded,
    } = props;
    const { limit } = state;

    if (loaded) {
      const {
        profile: { username: prevUsername },
      } = props;

      if (username !== prevUsername) {
        props.loadAuthorArticle(username, limit);
      }
    }

    return null;
  }

  componentDidMount() {
    const {
      match: {
        params: { username },
        path,
      },
    } = this.props;
    const { limit } = this.state;

    if (/.*favorites/.test(path)) {
      this.props.loadFavoriteArticle(username, limit);
    } else {
      this.props.loadAuthorArticle(username, limit);
    }
  }

  componentWillUnmount() {
    this.props.unloadProfile();
  }

  onChangeTab = (tab, username) => event => {
    const { limit } = this.state;

    this.props.changeTabProfile(tab, username, limit);
  };

  render() {
    const { profile, currentUser, articles, articlesCount, currentPage, pager, limit } = this.props;

    if (!profile) {
      return null;
    }

    const { username, bio, image, following } = profile;

    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={image} alt={username} className="user-img" />
                <h4>{username}</h4>
                <p>{bio}</p>
                <ProfileAction
                  username={username}
                  following={following}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      exact
                      to={`/profile/${username}`}
                      activeClassName="active"
                      onClick={this.onChangeTab('author', username)}
                    >
                      My Articles
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to={`/profile/${username}/favorites`}
                      onClick={this.onChangeTab('favorites', username)}
                    >
                      Favorited Articles
                    </NavLink>
                  </li>
                </ul>
              </div>
              <ArticleList
                articles={articles}
                articlesCount={articlesCount}
                currentPage={currentPage}
                pager={pager}
                limit={limit}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.profile,
  currentUser: state.common.currentUser,
  ...state.articleList,
});

export default connect(
  mapStateToProps,
  { loadAuthorArticle, loadFavoriteArticle, unloadProfile, changeTabProfile }
)(Profile);