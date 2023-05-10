import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";
import CommunityPosts from "./components/CommunityPosts";
import ViewPost from "./components/ViewPost";
import "./App.css";
import AdoptPet from "./components/AdoptPet";
import SignIn from "./components/SignIn";
import { AuthProvider } from "./components/firebase/Auth";
import PrivateRoute from "./components/PrivateRoute";
import { PetCenterHome, PetInfo } from "./components/Home";
import SignOutButton from "./components/SignOut";
import ErrorHandler from "./components/ErrorHandler";

function App() {
  const handleChange = () => {
    setCount(count + 1);
  };

  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState(window.sessionStorage.getItem("userid"));
  useEffect(() => {
    setUserId(window.sessionStorage.getItem("userid"));
  }, [count]);

  return (
    <div className="App-container">
      <AuthProvider>
        <Router>
          <div>
            <header className="headerMain">
              <nav className="App-header">
                <h1 className="App-title">PetOpia</h1>
                <div className="navLinks">
                  {!userId && (
                    <NavLink className="postLink" to="/">
                      Home
                    </NavLink>
                  )}
                  {userId && (
                    <NavLink className="postLink" to="/account/my-pets">
                      Pet-Center
                    </NavLink>
                  )}
                  {userId && (
                    <NavLink className="postLink" to="/account/community-posts">
                      Community
                    </NavLink>
                  )}
                  <NavLink className="postLink" to="/adoptpet">
                    Adopt
                  </NavLink>
                </div>
              </nav>
              {userId && (
                <div className="navLinksRight">
                  <SignOutButton handleChange={handleChange} />
                </div>
              )}
            </header>
            <Routes>
              <Route path="/adoptpet" element={<AdoptPet />} />
              <Route path="/account" element={<PrivateRoute />}>
                <Route path="/account/my-pets" element={<PetCenterHome />} />
                <Route
                  path="/account/my-pet-info/:petId"
                  element={<PetInfo />}
                />
                <Route
                  path={"/account/community-posts"}
                  element={<CommunityPosts />}
                />
                <Route
                  path={"/account/community-posts/:postId"}
                  element={<ViewPost />}
                />
              </Route>
              <Route
                path="/"
                element={<SignIn handleChange={handleChange} />}
              />
              <Route
                path="*"
                element={
                  <ErrorHandler
                    error={
                      <div><h1>
                        <br />
                        <br />
                        Error 404: Page Not Found!
                      </h1>
                      <Link to={`/account/my-pets`}>
                        <button className="post-link my-posts">
                          Back to Pet-Center
                        </button>
                      </Link>
                      </div>
                    }
                  />
                }
              />
            </Routes>
          </div>
        </Router>   
        <footer
          style={{ backgroundColor: "#9c6800" }}
          className="bg-orange text-center text-lg-start fixed-bottom"
        >
          <div className="text-center p-1">
            <span
              style={{
                color: "white",
                fontWeight: "lighter",
                fontSize: "medium",
              }}
            >
              © 2023 Copyright:{" "}
            </span>
            <span style={{ fontSize: "medium" }} className="text-light" href="">
              TEAM PETOPIA
            </span>
          </div>
        </footer>
      </AuthProvider>
    </div>
  );
}

export default App;
