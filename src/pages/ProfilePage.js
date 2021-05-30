import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Redirect } from 'react-router';
import { apiServer } from '../config';
import { ThemeContext } from '../ThemeContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loading: true };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        updatedUser: action.payload,
        loading: false,
        success: true,
        error: '',
      };
    case 'UPDATE_FAIL':
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
export default function ProfilePage() {
  const { user, setUser } = useContext(ThemeContext);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    updatedUser: null,
    error: '',
    success: false,
  });
  const { loading, error, updatedUser, success } = state;

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    if (!user) {
      return <Redirect to="/login" />;
    }
    if (updatedUser) {
      setUser(updatedUser);
    } else {
      setEmail(user.email);
      setName(user.name);
      setPhone(user.phone);
    }
  }, [updatedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      const response = await fetch(`${apiServer}/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...user, email, name, password, phone }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const updatedUser = await response.json();
      console.log(updatedUser);
      dispatch({
        type: 'UPDATE_SUCCESS',
        payload: updatedUser,
      });
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: err.message });
    }
  };
  if (!user) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-item">
          <label>Name:</label>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="form-item">
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="form-item">
          <label>Phone:</label>
          <input
            name="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          ></input>
        </div>
        <div className="form-item">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="form-item">
          <label> </label>
          <button>Update</button>
        </div>
        <div className="form-item">
          <label> </label>
          <button onClick={() => setUser(null)} type="button">
            Logout
          </button>
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
        {success && (
          <div className="form-item">
            <label> </label>
            <span class="success">Profile updated successfully.</span>
          </div>
        )}
      </form>
    </div>
  );
}
