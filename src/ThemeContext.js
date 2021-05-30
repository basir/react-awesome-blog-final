import React, { createContext, useState } from 'react';

const ThemeContext = createContext();
function ThemeContextProvider(props) {
  const [theme, setTheme] = useState('light');
  const [backendAPI, setBackendAPI] = useState(
    'https://jsonplaceholder.typicode.com'
  );
  const [user, setUser] = useState(null);
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const toggleBackendAPI = () => {
    console.log(backendAPI);
    setBackendAPI(
      backendAPI === '/api' ? 'https://jsonplaceholder.typicode.com' : '/api'
    );
  };
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        setUser,
        backendAPI,
        toggleBackendAPI,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeContextProvider };
