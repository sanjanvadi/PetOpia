import { React } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import CommunityPosts from "./components/CommunityPosts";
import ViewPost from "./components/ViewPost";

function App() {
  return (
    <Router>
      <div>
        <header>
          <nav className="App-header">
            <h1 className="App-title">PetOpia</h1>
            <div className="navLinks">
              <NavLink className="post-link nav-link" to="/">
                Home
              </NavLink>
              <NavLink className="post-link nav-link" to="/community-posts">
                Community
              </NavLink>
            </div>
          </nav>
        </header>
        <Routes>
          <Route path={`/community-posts`} element={<CommunityPosts />} />
          <Route path={`/community-posts/:postId`} element={<ViewPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
