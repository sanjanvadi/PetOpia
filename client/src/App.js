import React from "react";
import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import AdoptPet from "./components/AdoptPet";
import { PetCenterHome, PetInfo } from "./components/Home";
function App() {
  return (
    <Router>
      <div>
        <header>
          <nav className="App-header">
            <NavLink className='mainLogo' to="/">
              <h1 className="App-title">PetOpia</h1>
            </NavLink>
            <div className="navLinks">
                <NavLink className='showlink' to="/">
                  Home
                </NavLink>
                <NavLink className='showlink' to="/adoptpet">
                  Adopt
                </NavLink>
                <NavLink className="showlink" to="/my-pets">
                  MyPets
                </NavLink>
                <NavLink className="showlink" to="/adoptpet">
                  Adopt
                </NavLink>
            </div>
          </nav>
        </header>
        <Routes>
          {/* <Route path='/' element={<Home/>}/> */}
          <Route path="/adoptpet" element={<AdoptPet />} />
          {/* <Route path='*' element={<NotFound/>}/> */}
          <Route path="/my-pets" element={<PetCenterHome></PetCenterHome>}></Route>
          <Route path="/my-pet-info" element={<PetInfo></PetInfo>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
