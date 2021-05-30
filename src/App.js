import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import CreatePostPage from './pages/CreatePostPage';
import AboutPage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <BrowserRouter>
      <div className={`container ${theme}`}>
        <Navbar />
        <div className="main">
          <Switch>
            <Route path="/register">
              <RegisterPage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/profile">
              <ProfilePage />
            </Route>
            <Route path="/create">
              <CreatePostPage />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
            <Route path="/search/:query?">
              <HomePage />
            </Route>
            <Route path="/post/:postId">
              <PostPage />
            </Route>
            <Route path="/:userId">
              <HomePage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </div>
        <div className="footer">Awesome Blog. All right reserved</div>
      </div>
    </BrowserRouter>
  );
}

export default App;
