import React, { useEffect, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiServer } from '../config';

const reducer = (state, action) => {
  switch (action.type) {
    case 'USERS_REQUEST':
      return { ...state, loadingUsers: true };
    case 'USERS_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loadingUsers: false,
        errorUsers: '',
      };
    case 'USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loadingUsers: false,
        errorUsers: '',
      };
    case 'USERS_FAIL':
      return { ...state, error: action.payload, loadingUsers: false };
    case 'POSTS_REQUEST':
      return { ...state, loading: true };
    case 'POSTS_SUCCESS':
      return { ...state, posts: action.payload, loading: false, error: '' };
    case 'POSTS_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};
export default function HomePage() {
  const { userId, query } = useParams();
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    users: [],
    user: {},
    posts: [],
    error: '',
  });
  const { loadingUsers, errorUsers, users, user, loading, error, posts } =
    state;
  const loadUsers = async () => {
    dispatch({ type: 'USERS_REQUEST' });
    try {
      const response = await fetch(
        userId ? `${apiServer}/users/${userId}` : `${apiServer}/users`
      );
      const data = await response.json();
      dispatch({
        type: userId ? 'USER_SUCCESS' : 'USERS_SUCCESS',
        payload: data,
      });
    } catch (err) {
      dispatch({ type: 'USERS_FAIL', payload: err.message });
    }
  };
  const loadPosts = async () => {
    dispatch({ type: 'POSTS_REQUEST' });
    try {
      const response = await fetch(
        userId ? `${apiServer}/posts?userId=${userId}` : `${apiServer}/posts`
      );
      const data = await response.json();
      const filteredData = query
        ? data.filter(
            (x) => x.title.indexOf(query) >= 0 || x.body.indexOf(query) >= 0
          )
        : data;
      dispatch({ type: 'POSTS_SUCCESS', payload: filteredData });
    } catch (err) {
      dispatch({ type: 'POSTS_FAIL', payload: err.message });
    }
  };
  useEffect(() => {
    loadUsers();
    loadPosts();
  }, [userId, query]);
  return (
    <div className="blog">
      <div className="content">
        <h1>
          {query
            ? `Results for "${query}"`
            : userId
            ? `${user.name}'s Posts`
            : 'Posts'}
        </h1>
        {loading ? (
          <div>Loading posts...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : posts.length === 0 ? (
          <div>No post found</div>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link to={`/post/${post.id}`}>
                  <h2>{post.title}</h2>
                </Link>

                <p>{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="sidebar">
        {loadingUsers ? (
          <div>Loading users...</div>
        ) : errorUsers ? (
          <div>Error: {errorUsers}</div>
        ) : userId ? (
          <div>
            <h2> {user.name}'s Profile</h2>
            <ul>
              <li>Email: {user.email}</li>
              <li>Phone: {user.phone}</li>
              <li>Website: {user.website}</li>
            </ul>
          </div>
        ) : (
          <div>
            <h2>Authors</h2>
            {users.length === 0 && <div>No user found</div>}
            <ul>
              {users.map((user) => (
                <li key={user.name}>
                  <Link to={`/${user.id}`}>{user.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
