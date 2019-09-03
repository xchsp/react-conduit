import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeTab } from '../../actions/articleList';
import ArticleList from '../ArticleList';

const YourFeedTab = ({ token, tab, onChangeTab }) => {
  if (!token) {
    return null;
  }

  return (
    <li className="nav-item">
      <button
        className={`nav-link ${tab === 'feed' ? 'active' : ''}`}
        onClick={onChangeTab('feed')}
      >
        Your Feed
      </button>
    </li>
  );
};

const GlobalFeedTab = ({ tab, onChangeTab }) => {
  return (
    <li className="nav-item">
      <button
        className={`nav-link ${tab === 'all' ? 'active' : ''}`}
        onClick={onChangeTab('all')}
      >
        Global Feed
      </button>
    </li>
  );
};

const TagFilterTab = ({ tag }) => {
  if (!tag) {
    return null;
  }

  return (
    <li class="nav-item">
      <button class="nav-link active">
        <i className="ion-pound"></i> {tag}
      </button>
    </li>
  );
};

class MainView extends Component {
  handleChangeTab = tab => event => {
    event.preventDefault();
    this.props.changeTab(tab);
  };

  render() {
    const { articles, articlesCount, currentPage, tag, token, tab, pager } = this.props;

    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
            <YourFeedTab token={token} tab={tab} onChangeTab={this.handleChangeTab} />
            <GlobalFeedTab tab={tab} onChangeTab={this.handleChangeTab} />
            <TagFilterTab tag={tag} />
          </ul>
        </div>
        <ArticleList
          articles={articles}
          articlesCount={articlesCount}
          currentPage={currentPage}
          pager={pager}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.articleList,
  token: state.common.token,
});

export default connect(
  mapStateToProps,
  { changeTab }
)(MainView);
