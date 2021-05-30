import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'DATA_REQUEST':
      return { ...state, loading: true };
    case 'DATA_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: '',
      };
    case 'DATA_FAIL':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};
export default function PostPage() {
  const { backendAPI } = useContext(ThemeContext);
  const { postId } = useParams();
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: { post: {}, user: {} },
    error: '',
  });
  const {
    loading,
    error,
    data: { post, user },
  } = state;

  const loadData = async () => {
    dispatch({ type: 'DATA_REQUEST' });
    try {
      const postResponse = await fetch(`${backendAPI}/posts/${postId}`);
      const postData = await postResponse.json();
      const userResponse = await fetch(
        `${backendAPI}/users/${postData.userId}`
      );
      const userData = await userResponse.json();
      dispatch({
        type: 'DATA_SUCCESS',
        payload: { post: postData, user: userData },
      });
    } catch (err) {
      dispatch({ type: 'DATA_FAIL', payload: err.message });
    }
  };
  useEffect(() => {
    loadData();
  }, [backendAPI]);
  return (
    <div>
      <Link to={`/`}>back to posts</Link>
      <div className="blog">
        <div className="content">
          {loading ? (
            <div>Loading post...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div>
              <h1>{post.title}</h1>
              <p>{post.body}</p>
            </div>
          )}
        </div>
        <div className="sidebar">
          {loading ? (
            <div>Loading user...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <div>
              <h2> {user.name}' Profile</h2>
              <ul>
                <li>Email: {user.email}</li>
                <li>Phone: {user.phone}</li>
                <li>Website: {user.website}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
