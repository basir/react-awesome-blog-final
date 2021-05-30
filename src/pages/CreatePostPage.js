import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Redirect } from 'react-router';
import { apiServer } from '../config';
import { ThemeContext } from '../ThemeContext';
const initialState = {
  loading: false,
  createdPost: null,
  error: '',
  success: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_RESET':
      return initialState;
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        createdPost: action.payload,
        loading: false,
        success: true,
        error: '',
      };
    case 'CREATE_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
        success: false,
      };

    default:
      return state;
  }
};
export default function LoginPage() {
  const { user } = useContext(ThemeContext);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, success, createdPost } = state;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (!user) {
    return <Redirect to="/profile" />;
  }
  const reset = () => {
    dispatch({ type: 'CREATE_RESET' });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      const { data } = await axios.post(`${apiServer}/posts`, {
        id: Math.floor(Math.random() * 100000),
        title,
        body,
        userId: user.id,
      });
      dispatch({
        type: 'CREATE_SUCCESS',
        payload: data,
      });
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL', payload: err.message });
    }
  };
  return (
    <div>
      <h1>Create Post</h1>
      {success ? (
        <div>
          <p>
            Post titled <strong>{createdPost.title}</strong> has been created.
          </p>
          <button onClick={reset}>Create another post</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-item">
            <label>Title:</label>
            <input
              name="title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div className="form-item">
            <label>Body:</label>
            <textarea
              name="body"
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <div className="form-item">
            <label> </label>
            <button>Create</button>
          </div>
          {loading && (
            <div className="form-item">
              <label> </label>
              <span>Processing...</span>
            </div>
          )}
          {error && (
            <div className="form-item">
              <label> </label>
              <span class="error">{error}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
