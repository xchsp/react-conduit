import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ErrorsList from '../common/ErrorsList';
import { addComment } from '../../actions';
import PropTypes from 'prop-types';

class CommentInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
  }

  onTextareaChange = event => {
    event.preventDefault();
    this.setState({ content: event.currentTarget.value });
  };

  submit = event => {
    event.preventDefault();
    const {
      article: { slug },
    } = this.props;

    this.props.addComment(slug, this.state.content);
    this.setState({ content: '' });
  };

  render() {
    const { currentUser, commentErrors, commentSubmitting } = this.props;

    if (!currentUser) {
      return (
        <p>
          <Link to="/login">Sign in</Link>
          &nbsp;or&nbsp;
          <Link to="/register">sign up</Link>
          &nbsp;to add comments on this article.
        </p>
      );
    }

    return (
      <Fragment>
        <ErrorsList errors={commentErrors} />
        <form className="card comment-form" onSubmit={this.submit}>
          <div className="card-block">
            <textarea
              className="form-control"
              placeholder="Write a comment..."
              rows="3"
              value={this.state.content}
              onChange={this.onTextareaChange}
            ></textarea>
          </div>
          <div className="card-footer">
            <img
              src={currentUser.image}
              alt={currentUser.username}
              className="comment-author-img"
            />
            <button
              className="btn btn-sm btn-primary"
              type="submit"
              disabled={commentSubmitting}
            >
              Post Comment
            </button>
          </div>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  commentErrors: state.article.commentErrors,
  currentUser: state.app.currentUser,
  article: state.article.article,
});

CommentInput.propTypes = {
  commentErrors: PropTypes.shape({
    body: PropTypes.arrayOf(PropTypes.string),
  }),
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    token: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
    image: PropTypes.string,
  }),
  article: PropTypes.object,
  commentSubmitting: PropTypes.bool,
};

export default connect(mapStateToProps, { addComment })(CommentInput);
