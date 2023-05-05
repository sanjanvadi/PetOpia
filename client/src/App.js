import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link
} from "react-router-dom";
import CommunityPosts from "./components/CommunityPosts";
import ViewPost from "./components/ViewPost";
import "./App.css";
import AdoptPet from "./components/AdoptPet";
import Account from "./components/Account";
import SignIn from "./components/SignIn";
import { AuthProvider } from "./components/firebase/Auth";
import PrivateRoute from "./components/PrivateRoute";
import { PetCenterHome, PetInfo } from "./components/Home";
import SignOutButton from "./components/SignOut";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <header>
            <nav className="App-header">
              <h1 className="App-title">PetOpia</h1>
              <div className="navLinks">
                <NavLink className="postLink" to="/">
                  signIn
                </NavLink>
                <NavLink className="postLink" to="/account/my-pets">
                  Pet-Center
                </NavLink>
                <NavLink className="postLink" to="/account/community-posts">
                  Community
                </NavLink>
                <NavLink className="postLink" to="/adoptpet">
                  Adopt
                </NavLink>
                {/* <NavLink className="postLink" to="/account">
                  Account
                </NavLink> */}
                {/* <NavLink className="postLink" to="/signin">
                  Sign Out
                </NavLink> */}
                <div className="postLink">
                  <SignOutButton/>
                </div>
              </div>
            </nav>
          </header>
          <Routes>
            {/* <Route path='/' element={<Home/>}/> */}
            <Route path="/adoptpet" element={<AdoptPet />} />
            {/* <Route path='*' element={<NotFound/>}/> */}
            <Route path="/account" element={<PrivateRoute />}>
              {/* <Route path="/account" element={<Account />} /> */}
              <Route path="/account/my-pets" element={<PetCenterHome />} />
              <Route path="/account/my-pet-info" element={<PetInfo />} />
              <Route path={`/account/community-posts`} element={<CommunityPosts />} />
              <Route path={`/account/community-posts/:postId`} element={<ViewPost />} />
            </Route>
            <Route path="/" element={<SignIn />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
