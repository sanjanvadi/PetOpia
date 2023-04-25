import React from "react";
import "./App.css";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import AdoptPet from "./components/AdoptPet";
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
            </div>
          </nav>
        </header>
        <Routes>
          {/* <Route path='/' element={<Home/>}/> */}
          <Route path="/adoptpet" element={<AdoptPet />} />
          {/* <Route path='*' element={<NotFound/>}/> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
