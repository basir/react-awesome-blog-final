import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

export default function Navbar() {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const { user, theme, toggleTheme, backendAPI, toggleBackendAPI } =
    useContext(ThemeContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    history.push('/search/' + query);
  };
  return (
    <div className="header">
      <div className="header-item">
        <NavLink to="/" exact={true} activeClassName="active">
          <strong>Awesome Blog</strong>
        </NavLink>
      </div>
      <div className="header-item">
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setQuery(e.target.value)}
            name="query"
            type="text"
            placeholder="search posts"
          ></input>
          <button>Go</button>
        </form>
      </div>
      <div className="header-item">
        {user ? (
          <>
            <NavLink to="/profile" activeClassName="active">
              {user.name}
            </NavLink>{' '}
            <NavLink to="/create" activeClassName="active">
              Create post
            </NavLink>
          </>
        ) : (
          <NavLink to="/login" activeClassName="active">
            Login
          </NavLink>
        )}{' '}
        <button onClick={toggleTheme}>
          {theme === 'light' ? 'Theme:Light' : 'Theme:Dark'}
        </button>{' '}
        <button onClick={toggleBackendAPI}>
          {backendAPI === '/api' ? 'API:Real' : 'API:Mock'}
        </button>
      </div>
    </div>
  );
}
