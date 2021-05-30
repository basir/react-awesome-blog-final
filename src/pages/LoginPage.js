import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import { ThemeContext } from '../ThemeContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loggedInUser: action.payload,
        loading: false,
        error: '',
      };
    case 'LOGIN_FAIL':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};
export default function LoginPage() {
  const { user, setUser, backendAPI } = useContext(ThemeContext);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    loggedInUser: null,
    error: '',
  });
  const { loading, error, loggedInUser } = state;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      return <Redirect to="/profile" />;
    }
  }, [loggedInUser]);

  if (user) {
    return <Redirect to="/profile" />;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_REQUEST' });
    try {
      const { data } = await axios.get(
        `${backendAPI}/users?email=${email}&password=${password}`
      );
      if (data.length > 0) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: data[0],
        });
      } else {
        dispatch({
          type: 'LOGIN_FAIL',
          payload: 'Inavlid email or password',
        });
      }
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.message });
    }
  };
  return (
    <div>
      <h1>Login User</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-item">
          <label>Email:</label>
          <input
            name="email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="form-item">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="form-item">
          <label> </label>
          <button>Login</button>
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
        <div className="form-item">
          <label> </label>
          <span>
            New User? <Link to="/register">Register</Link>
          </span>
        </div>
        <div className="form-item">
          <label> </label>
          <span>Or use email: Sincere@april.biz password: 123</span>
        </div>
      </form>
    </div>
  );
}
