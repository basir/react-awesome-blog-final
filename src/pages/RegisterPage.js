import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Redirect } from 'react-router';

import { ThemeContext } from '../ThemeContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER_REQUEST':
      return { ...state, loading: true };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        registeredUser: action.payload,
        loading: false,
        success: true,
        error: '',
      };
    case 'REGISTER_FAIL':
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
export default function RegisterPage() {
  const { user, setUser, backendAPI } = useContext(ThemeContext);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    success: false,
  });
  const { loading, error, registeredUser } = state;

  useEffect(() => {
    if (registeredUser) {
      setUser(registeredUser);
      return <Redirect to="/profile" />;
    }
  }, [registeredUser]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'REGISTER_REQUEST' });
    try {
      const { data: registeredUser } = await axios.post(`${backendAPI}/users`, {
        id: Math.floor(Math.random() * 100000),
        email,
        name,
        password,
      });

      console.log(registeredUser);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: registeredUser,
      });
    } catch (err) {
      dispatch({ type: 'REGISTER_FAIL', payload: err.message });
    }
  };
  if (user) {
    return <Redirect to="/profile" />;
  }
  return (
    <div>
      <h1>Register User</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-item">
          <label>Name:</label>
          <input
            name="name"
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
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
          <button>Register</button>
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
    </div>
  );
}
