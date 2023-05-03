import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
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
                  Home
                </NavLink>
                <NavLink className="postLink" to="/adoptpet">
                  Adopt
                </NavLink>
                <NavLink className="postLink" to="/account">
                  Account
                </NavLink>
                <NavLink className="postLink" to="/signin">
                  Sign In
                </NavLink>
              </div>
            </nav>
          </header>
          <Routes>
            {/* <Route path='/' element={<Home/>}/> */}
            <Route path="/adoptpet" element={<AdoptPet />} />
            {/* <Route path='*' element={<NotFound/>}/> */}
            <Route path="/account" element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/my-pets" element={<PetCenterHome></PetCenterHome>}/>
            <Route path="/my-pet-info" element={<PetInfo></PetInfo>}/>
            <Route path={`/community-posts`} element={<CommunityPosts />} />
          <Route path={`/community-posts/:postId`} element={<ViewPost />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
