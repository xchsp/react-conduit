import React, { Component } from 'react';
import { connect } from 'react-redux';
import ArticleMeta from '../common/ArticleMeta';
import { loadArticle, unloadArticle } from '../../actions';
import CommentList from './CommentList';
import marked from 'marked';
import CommentInput from './CommentInput';
import ArticleActions from './ArticleActions';
import PropTypes from 'prop-types';

class Article extends Component {
  componentDidMount() {
    const {
      params: { slug },
    } = this.props.match;
    this.props.loadArticle(slug);
  }

  componentWillUnmount() {
    this.props.unloadArticle();
  }

  render() {
    const {
      article,
      loading,
      match: { params },
    } = this.props;

    if (loading) {
      return null;
    }

    const {
      slug,
      title,
      description,
      body,
      tagList,
      createdAt,
      author,
    } = article;
    const markup = { __html: marked(body, { sanitize: true }) };

    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{title}</h1>
            <ArticleMeta createdAt={createdAt} author={author}>
              <ArticleActions params={params} />
            </ArticleMeta>
          </div>
        </div>
        <div className="container page">
          <div className="row article-content">
            <div className="col-md-12">
              <h2 id="introducing-ionic">{description}</h2>
              <p dangerouslySetInnerHTML={markup}></p>
            </div>
            <ul className="tag-list">
              {tagList.length &&
                tagList.map((tag, idx) => (
                  <li
                    className="tag-default tag-pill tag-outline"
                    key={`${tag}-${idx}`}
                  >
                    {tag}
                  </li>
                ))}
            </ul>
          </div>

          <hr />

          <div className="article-actions">
            <ArticleMeta createdAt={createdAt} author={author}>
              <ArticleActions />
            </ArticleMeta>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-8 offset-md-2">
              <CommentInput />
              <CommentList slug={slug} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.article,
});

Article.propTypes = {
  loading: PropTypes.bool,
  article: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    body: PropTypes.string,
    tagList: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    author: PropTypes.object,
  }),
};

export default connect(mapStateToProps, { loadArticle, unloadArticle })(
  Article
);
